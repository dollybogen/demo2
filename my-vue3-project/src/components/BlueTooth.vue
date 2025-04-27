<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <h1>多设备IMU数据采集系统</h1>
      <div class="header-actions">
        <el-button
          type="primary"
          @click="connectSingleDevice"
          :disabled="isConnecting || devices.length >= 6"
        >
          {{ isConnecting ? "正在连接..." : `连接设备 (${devices.length}/6)` }}
        </el-button>

        <el-button-group>
          <el-button
            type="success"
            @click="startDataCollection"
            :disabled="devices.length < 6 || isCollecting"
          >
            开始采集
          </el-button>
          <el-button
            type="warning"
            @click="stopDataCollection"
            :disabled="!isCollecting"
          >
            停止采集
          </el-button>
        </el-button-group>

        <el-button-group>
          <el-button
            type="info"
            @click="exportToCSV"
            :disabled="imuDataArray.count === 0"
          >
            导出CSV
          </el-button>
          <el-button
            type="danger"
            @click="clearData"
            :disabled="imuDataArray.count === 0"
          >
            清空数据
          </el-button>
        </el-button-group>

        <el-button
          type="success"
          @click="sendCsvToBackend"
          :disabled="imuDataArray.count === 0 || isSending"
        >
          {{ isSending ? '发送中...' : '发送到后端' }}
        </el-button>
      </div>
    </el-header>

    <el-main class="app-main">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="device-list">
            <template #header>
              <div class="card-header">
                <span>已连接设备</span>
                <el-button type="text" @click="stopAllDevices" :disabled="devices.length === 0">
                  断开全部
                </el-button>
              </div>
            </template>

            <el-empty v-if="devices.length === 0" description="未连接设备" />

            <div v-else class="device-item" v-for="dev in devices" :key="dev.id">
              <div class="device-info">
                <el-tag :type="dev.connected ? 'success' : 'danger'" size="small">
                  {{ dev.connected ? '在线' : '离线' }}
                </el-tag>
                <span>{{ dev.name }}</span>
              </div>
              <div class="device-data" v-if="dev.lastData">
                <div>Acc: {{ dev.lastData.AccX }}, {{ dev.lastData.AccY }}, {{ dev.lastData.AccZ }}</div>
                <div>Gyro: {{ dev.lastData.GyroX }}, {{ dev.lastData.GyroY }}, {{ dev.lastData.GyroZ }}</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="18">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>IMU数据 (实时采集)</span>
                <span class="data-count">共 {{ imuDataArray.count }} 条数据</span>
              </div>
            </template>

            <el-table
              :data="imuDataArray.visibleData"
              border
              height="500"
              style="width: 100%"
              v-loading="isCollecting"
              :row-key="row => row.timestamp + row.deviceId"
            >
              <el-table-column prop="timestamp" label="时间" width="180" />
              <el-table-column prop="deviceName" label="设备名称" width="120" />

              <el-table-column label="加速度(g)">
                <el-table-column prop="AccX" label="X" width="90" />
                <el-table-column prop="AccY" label="Y" width="90" />
                <el-table-column prop="AccZ" label="Z" width="90" />
              </el-table-column>

              <el-table-column label="角速度(°/s)">
                <el-table-column prop="GyroX" label="X" width="90" />
                <el-table-column prop="GyroY" label="Y" width="90" />
                <el-table-column prop="GyroZ" label="Z" width="90" />
              </el-table-column>

              <el-table-column label="角度(°)">
                <el-table-column prop="Roll" label="Roll" width="90" />
                <el-table-column prop="Pitch" label="Pitch" width="90" />
                <el-table-column prop="Yaw" label="Yaw" width="90" />
              </el-table-column>
            </el-table>

            <el-pagination
              v-if="imuDataArray.count > imuDataArray.pageSize"
              @current-change="changePage"
              :current-page="imuDataArray.currentPage + 1"
              :page-size="imuDataArray.pageSize"
              layout="prev, pager, next"
              :total="imuDataArray.count"
              class="pagination"
            />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { useRoute } from 'vue-router'; // 引入 useRoute


const SERVICE_UUID = "0000ffe5-0000-1000-8000-00805f9a34fb";
const READ_CHAR_UUID = "0000ffe4-0000-1000-8000-00805f9a34fb";
const WRITE_CHAR_UUID = "0000ffe9-0000-1000-8000-00805f9a34fb";

// 状态管理
const devices = ref([]);
const isConnecting = ref(false);
const isCollecting = ref(false);
const isSending = ref(false);
const patientId = ref(null);
const route = useRoute();

// 用于临时存储采集到的数据
const rawImuData = ref([]);

// 优化后的数据结构 - 用于显示的数据
const imuDataArray = ref({
  data: [],
  pageSize: 100,
  currentPage: 0,
  get count() {
    return this.data.length;
  },
  get visibleData() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return [...this.data].reverse().slice(start, end);
  }
});

onMounted(() => {
  if (route.query.patientId) {
    patientId.value = route.query.patientId;
    console.log('蓝牙页面接收到患者 ID:', patientId.value);
  } else {
    console.warn('蓝牙页面未接收到患者 ID');
    ElMessage.error('未获取到患者 ID，无法进行数据关联');
  }
});

onBeforeUnmount(() => {
  stopAllDevices();
});

async function connectSingleDevice() {
  if (devices.value.length >= 6) {
    ElMessage.warning("已连接6个设备，请开始采集数据！");
    return;
  }

  let loadingInstance;
  try {
    isConnecting.value = true;
    loadingInstance = ElLoading.service({
      lock: true,
      text: '正在搜索并连接蓝牙设备...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "WT" }],
      optionalServices: [SERVICE_UUID],
    });

    device.addEventListener('gattserverdisconnected', () => handleDisconnect(device.id));

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);

    const [notifyChar, writeChar] = await Promise.all([
      service.getCharacteristic(READ_CHAR_UUID),
      service.getCharacteristic(WRITE_CHAR_UUID)
    ]);

    const deviceObj = {
      id: device.id,
      name: device.name || `设备${devices.value.length + 1}`,
      device,
      server,
      notifyChar,
      writeChar,
      connected: true,
      lastData: null,
      tempBytes: [],
      handler: (event) => {
        handleData(event, device.id);
      }
    };

    devices.value.push(deviceObj);

    await notifyChar.startNotifications();
    notifyChar.addEventListener('characteristicvaluechanged', deviceObj.handler);

    ElMessage.success(`${device.name || '设备'}已连接！`);

  } catch (error) {
    console.error('连接失败:', error);
    ElMessage.error(`连接失败: ${error.message}`);
  } finally {
    isConnecting.value = false;
    if (loadingInstance) {
      loadingInstance.close();
    }
  }
}

function handleData(event, deviceId) {
  if (!isCollecting.value) return;

  const value = event.target.value;
  const bytes = new Uint8Array(value.buffer);
  const device = devices.value.find(d => d.id === deviceId);
  if (!device) return;

  for (const byte of bytes) {
    device.tempBytes.push(byte);

    if (device.tempBytes.length === 1 && device.tempBytes[0] !== 0x55) {
      device.tempBytes.shift();
      continue;
    }

    if (device.tempBytes.length === 2 && device.tempBytes[1] !== 0x61) {
      device.tempBytes.shift();
      continue;
    }

    if (device.tempBytes.length === 20) {
      const data = processDataPacket(device.tempBytes, device);
      // 将处理后的数据存储到临时数组中
      rawImuData.value.push(data);
      device.lastData = data;
      device.tempBytes = [];
    }
  }
}

function processDataPacket(bytes, device) {
  if (bytes.length < 20) {
    throw new Error(`Incomplete data packet (${bytes.length} bytes)`);
  }

  const buffer = new ArrayBuffer(20);
  const view = new DataView(buffer);
  for (let i = 0; i < 20; i++) {
    view.setUint8(i, bytes[i]);
  }

  const getInt16 = (offset) => {
    try {
      const val = view.getInt16(offset, true);
      return val >= 32768 ? val - 65536 : val;
    } catch (e) {
      console.error(`Error reading int16 at offset ${offset}:`, e);
      return 0;
    }
  };

  return {
    timestamp: new Date().toISOString(),
    deviceName: device.name,
    deviceId: device.id,
    AccX: (getInt16(2) / 32768 * 16).toFixed(4),
    AccY: (getInt16(4) / 32768 * 16).toFixed(4),
    AccZ: (getInt16(6) / 32768 * 16).toFixed(4),
    GyroX: (getInt16(8) / 32768 * 2000).toFixed(2),
    GyroY: (getInt16(10) / 32768 * 2000).toFixed(2),
    GyroZ: (getInt16(12) / 32768 * 2000).toFixed(2),
    Roll: (getInt16(14) / 32768 * 180).toFixed(2),
    Pitch: (getInt16(16) / 32768 * 180).toFixed(2),
    Yaw: (getInt16(18) / 32768 * 180).toFixed(2)
  };
}

function startDataCollection() {
  if (devices.value.length < 6) {
    ElMessage.warning("请先连接6个设备！");
    return;
  }

  isCollecting.value = true;
  rawImuData.value = []; // 清空临时数据
  imuDataArray.value.data = [];
  imuDataArray.value.currentPage = 0;
  ElMessage.success("开始采集数据...");
}

function stopDataCollection() {
  isCollecting.value = false;
  // 停止采集后，将临时数据更新到 imuDataArray
  imuDataArray.value.data = [...rawImuData.value];
  ElMessage.info(`已停止数据采集，共采集到 ${rawImuData.value.length} 条数据`);
}

function handleDisconnect(deviceId) {
  const device = devices.value.find(d => d.id === deviceId);
  if (device) {
    device.connected = false;
    ElMessage.warning(`${device.name || '设备'}已断开连接`);
  }
}

async function stopAllDevices() {
  stopDataCollection();

  const disconnectPromises = devices.value.map(async (dev) => {
    try {
      if (dev.connected) {
        if (dev.notifyChar) {
          try {
            dev.notifyChar.removeEventListener('characteristicvaluechanged', dev.handler);
            await dev.notifyChar.stopNotifications();
          } catch (error) {
            console.error('停止通知失败:', error);
          }
        }
        if (dev.server) {
          try {
            await dev.server.disconnect();
          } catch (error) {
            console.error('断开连接失败:', error);
          }
        }
      }
    } catch (error) {
      console.error('断开设备时出错:', error);
    }
  });

  await Promise.all(disconnectPromises);
  devices.value = [];
  ElMessage.info("已断开所有设备");
}

function exportToCSV() {
  if (imuDataArray.value.count === 0) {
    ElMessage.warning("没有数据可以导出");
    return;
  }

  const loading = ElLoading.service({
    lock: true,
    text: '正在准备CSV数据...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  try {
    const headers = [
      '时间戳', '设备ID', '设备名称',
      'AccX(g)', 'AccY(g)', 'AccZ(g)',
      'GyroX(°/s)', 'GyroY(°/s)', 'GyroZ(°/s)',
      'Roll(°)', 'Pitch(°)', 'Yaw(°)'
    ].join(',') + '\n';

    let csvString = "\uFEFF" + headers;
    csvString += imuDataArray.value.data.map(row =>
      [
        `"${row.timestamp}"`, row.deviceId, `"${row.deviceName}"`,
        row.AccX, row.AccY, row.AccZ,
        row.GyroX, row.GyroY, row.GyroZ,
        row.Roll, row.Pitch, row.Yaw
      ].join(',')
    ).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `imu_data_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出CSV失败:', error);
    ElMessage.error('导出CSV失败');
  } finally {
    loading.close();
  }
}

async function sendCsvToBackend() {
  if (imuDataArray.value.count === 0) {
    ElMessage.warning("没有数据可以发送");
    return;
  }

  if (!patientId.value) {
    ElMessage.error("未获取到患者 ID，无法发送数据");
    return;
  }

  isSending.value = true;
  const loading = ElLoading.service({
    lock: true,
    text: "正在发送数据到后端...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    const headers = [
      "时间戳",
      "设备ID",
      "设备名称",
      "AccX(g)",
      "AccY(g)",
      "AccZ(g)",
      "GyroX(°/s)",
      "GyroY(°/s)",
      "GyroZ(°/s)",
      "Roll(°)",
      "Pitch(°)",
      "Yaw(°)",
    ].join(",") + "\n";

    let csvString = "\uFEFF" + headers;
    csvString += imuDataArray.value.data
      .map((row) =>
        [
          `"${row.timestamp}"`,
          row.deviceId,
          `"${row.deviceName}"`,
          row.AccX,
          row.AccY,
          row.AccZ,
          row.GyroX,
          row.GyroY,
          row.GyroZ,
          row.Roll,
          row.Pitch,
          row.Yaw,
        ].join(",")
      )
      .join("\n");

    const csvFile = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const filename = `imu_data_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.csv`;

    const formData = new FormData();
    formData.append("file", csvFile, filename);
    formData.append("patientId", patientId.value);

    const uploadUrl = "/api/upload/csv";
    console.log("发送请求到:", uploadUrl);
    console.log("即将发送的 FormData:");
    for (const pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      ElMessage.success("数据已成功发送到后端");
      console.log("后端响应:", responseData);
    } else {
      throw new Error(`${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    ElMessage.error(`发送数据到后端时发生错误: ${error.message}`);
    console.error("发送数据到后端时发生错误:", error);
  } finally {
    isSending.value = false;
    loading.close();
  }
}

function clearData() {
  rawImuData.value = [];
  imuDataArray.value.data = [];
  imuDataArray.value.currentPage = 0;
  ElMessage.success("已清空所有数据");
}

function changePage(newPage) {
  imuDataArray.value.currentPage = newPage - 1;
}
</script>
<style scoped>
.app-container {
  height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409EFF;
  color: white;
  padding: 0 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.app-main {
  padding: 20px;
  background-color: #f5f7fa;
  height: calc(100vh - 60px);
  overflow: auto;
}

.device-list {
  height: 100%;
  min-height: 500px;
}

.device-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
}

.device-item:last-child {
  border-bottom: none;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: bold;
}

.device-data {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-count {
  font-size: 14px;
  color: #666;
}

.pagination {
  margin-top: 15px;
  justify-content: flex-end;
}
</style>