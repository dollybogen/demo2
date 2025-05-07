<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <h1>Multi-device IMU Data Collection System</h1>
      <div class="header-actions">
        <el-button
          type="primary"
          @click="connectSingleDevice"
          :disabled="isConnecting || devices.length >= 6"
        >
          {{ isConnecting ? "Connecting..." : `Connect Device (${devices.length}/6)` }}
        </el-button>

        <el-button-group>
          <el-button
            type="success"
            @click="startDataCollection"
            :disabled="devices.length < 6 || isCollecting"
          >
            Start Collection
          </el-button>
          <el-button
            type="warning"
            @click="stopDataCollection"
            :disabled="!isCollecting"
          >
            Stop Collection
          </el-button>
        </el-button-group>

        <el-button-group>
          <el-button
            type="info"
            @click="exportToCSV"
            :disabled="imuDataArray.count === 0"
          >
            Export CSV
          </el-button>
          <el-button
            type="danger"
            @click="clearData"
            :disabled="imuDataArray.count === 0"
          >
            Clear Data
          </el-button>
        </el-button-group>

        <el-button
          type="success"
          @click="sendCsvToBackend"
          :disabled="imuDataArray.count === 0 || isSending"
        >
          {{ isSending ? 'Sending...' : 'Send to Backend' }}
        </el-button>
      </div>
    </el-header>

    <el-main class="app-main">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="device-list">
            <template #header>
              <div class="card-header">
                <span>Connected Devices</span>
                <el-button type="text" @click="stopAllDevices" :disabled="devices.length === 0">
                  Disconnect All
                </el-button>
              </div>
            </template>

            <el-empty v-if="devices.length === 0" description="No devices connected" />

            <div v-else class="device-item" v-for="dev in devices" :key="dev.id">
              <div class="device-info">
                <el-tag :type="dev.connected ? 'success' : 'danger'" size="small">
                  {{ dev.connected ? 'Online' : 'Offline' }}
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
        <span>IMU Data (Real-time Collection)</span>
        <span class="data-count">Total {{ imuDataArray.count }} records</span>
      </div>
    </template>

    <el-table
      :data="imuDataArray.visibleData"
      border
      height="270"
      style="width: 100%"
      v-loading="isCollecting"
      :row-key="row => row.timestamp + row.deviceId"
    >
      <!-- Table Columns -->
      <el-table-column prop="timestamp" label="Time" width="180" />
      <el-table-column prop="deviceName" label="Device Name" width="120" />

      <el-table-column label="Acceleration(g)">
        <el-table-column prop="AccX" label="X" width="90" />
        <el-table-column prop="AccY" label="Y" width="90" />
        <el-table-column prop="AccZ" label="Z" width="90" />
      </el-table-column>

      <el-table-column label="Angular Velocity(°/s)">
        <el-table-column prop="GyroX" label="X" width="90" />
        <el-table-column prop="GyroY" label="Y" width="90" />
        <el-table-column prop="GyroZ" label="Z" width="90" />
      </el-table-column>

      <el-table-column label="Angle(°)">
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

    <!-- New content area -->
    <div style="display: flex; margin-top: 20px;">
      <el-card style="flex: 1; margin-right: 20px;">
<template #header>Amplitude Analysis</template>
        <div style="padding: 20px; max-height: 100px; overflow-y: auto;">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="index" label="No." width="80"></el-table-column>
          <el-table-column prop="normal" label="Normal Amplitude"></el-table-column>
          <el-table-column prop="motion" label="Motion Amplitude"></el-table-column>
          <el-table-column prop="difference" label="Difference"></el-table-column>
        </el-table>
    </div>
      </el-card>

<div style="flex: 1;">
  <el-form label-position="top">
    <el-form-item label="Report Type">
      <el-input v-model="reportType" placeholder="Enter report type" />
    </el-form-item>
    <el-form-item label="Doctor's Comment">
      <el-input
        type="textarea"
        v-model="doctorComment"
        placeholder="Enter doctor's comment"
        :rows="4"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click="handleReportUpload">Upload Report File</el-button>
    </el-form-item>
  </el-form>
</div>

    </div>
  </el-card>
</el-col>

      </el-row>
    </el-main>
  </el-container>
</template>
<script setup>
import { ref, onBeforeUnmount,computed , onMounted } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { useRoute } from 'vue-router'; // Import useRoute


const SERVICE_UUID = "0000ffe5-0000-1000-8000-00805f9a34fb";
const READ_CHAR_UUID = "0000ffe4-0000-1000-8000-00805f9a34fb";
const WRITE_CHAR_UUID = "0000ffe9-0000-1000-8000-00805f9a34fb";

// State management
const devices = ref([]);
const isConnecting = ref(false);
const isCollecting = ref(false);
const isSending = ref(false);
const patientId = ref(null);
const route = useRoute();

// Temporary storage for collected data
const rawImuData = ref([]);

// Optimized data structure - for display
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


import { ElMessageBox } from 'element-plus';
const normalAmplitude = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
const motionAmplitude = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
const difference = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

// Compute table data by combining the arrays
const tableData = computed(() => {
  return normalAmplitude.value.map((value, index) => ({
    index: index + 1,
    normal: normalAmplitude.value[index],
    motion: motionAmplitude.value[index],
    difference: difference.value[index],
  }));
});
const reportType = ref('');
const doctorComment = ref('');

function handleReportUpload() {
  // Simulate successful upload
  ElMessageBox.alert('Report uploaded successfully!', 'Success', {
    confirmButtonText: 'OK',
    type: 'success',
  });
}


onMounted(() => {
  if (route.query.patientId) {
    patientId.value = route.query.patientId;
    console.log('Bluetooth page received patient ID:', patientId.value);
  } else {
    console.warn('Bluetooth page did not receive patient ID');
    ElMessage.error('Failed to get patient ID, cannot associate data');
  }
});

onBeforeUnmount(() => {
  stopAllDevices();
});

async function connectSingleDevice() {
  if (devices.value.length >= 6) {
    ElMessage.warning("Already connected to 6 devices, please start data collection!");
    return;
  }

  let loadingInstance;
  try {
    isConnecting.value = true;
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Searching and connecting to Bluetooth device...',
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
      name: device.name || `Device ${devices.value.length + 1}`,
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

    ElMessage.success(`${device.name || 'Device'} connected successfully!`);

  } catch (error) {
    console.error('Connection failed:', error);
    ElMessage.error(`Connection failed: ${error.message}`);
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
      // Store processed data in temporary array
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
    ElMessage.warning("Please connect 6 devices first!");
    return;
  }

  isCollecting.value = true;
  rawImuData.value = []; // Clear temporary data
  imuDataArray.value.data = [];
  imuDataArray.value.currentPage = 0;
  ElMessage.success("Starting data collection...");
}

function stopDataCollection() {
  isCollecting.value = false;
  // After stopping collection, update imuDataArray with temporary data
  imuDataArray.value.data = [...rawImuData.value];
  ElMessage.info(`Data collection stopped, collected ${rawImuData.value.length} records`);
}

function handleDisconnect(deviceId) {
  const device = devices.value.find(d => d.id === deviceId);
  if (device) {
    device.connected = false;
    ElMessage.warning(`${device.name || 'Device'} disconnected`);
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
            console.error('Failed to stop notifications:', error);
          }
        }
        if (dev.server) {
          try {
            await dev.server.disconnect();
          } catch (error) {
            console.error('Disconnection failed:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error disconnecting device:', error);
    }
  });

  await Promise.all(disconnectPromises);
  devices.value = [];
  ElMessage.info("All devices disconnected");
}

function exportToCSV() {
  if (imuDataArray.value.count === 0) {
    ElMessage.warning("No data to export");
    return;
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Preparing CSV data...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  try {
    const headers = [
      'Timestamp', 'Device ID', 'Device Name',
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
    console.error('CSV export failed:', error);
    ElMessage.error('CSV export failed');
  } finally {
    loading.close();
  }
}

async function sendCsvToBackend() {
  if (imuDataArray.value.count === 0) {
    ElMessage.warning("No data to send");
    return;
  }

  if (!patientId.value) {
    ElMessage.error("Failed to get patient ID, cannot send data");
    return;
  }

  isSending.value = true;
  const loading = ElLoading.service({
    lock: true,
    text: "Sending data to backend...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    const headers = [
      "Timestamp",
      "Device ID",
      "Device Name",
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
    console.log("Sending request to:", uploadUrl);
    console.log("FormData to be sent:");
    for (const pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      ElMessage.success("Data sent to backend successfully");
      console.log("Backend response:", responseData);
    } else {
      throw new Error(`${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    ElMessage.error(`Error sending data to backend: ${error.message}`);
    console.error("Error sending data to backend:", error);
  } finally {
    isSending.value = false;
    loading.close();
  }
}

function clearData() {
  rawImuData.value = [];
  imuDataArray.value.data = [];
  imuDataArray.value.currentPage = 0;
  ElMessage.success("All data cleared");
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