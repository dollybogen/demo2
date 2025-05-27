<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-left">
        <el-button
          type="text"
          @click="goBackToPatientManage"
          class="back-button"
        >
          <el-icon><ArrowLeft /></el-icon> <span>Back to Patient List</span>
        </el-button>
        <h1>Multi-Device IMU Data Collection System</h1>
      </div>

      <div class="header-actions">
        <el-button
          type="primary"
          @click="connectSingleDevice"
          :disabled="isConnecting"
        >
          {{ isConnecting ? "Connecting..." : `Connect Device (${devices.length})` }}
        </el-button>

        <el-button-group>
          <el-button
            type="success"
            @click="startDataCollection"
            :disabled="devices.length === 0 || isCollecting"
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
            :disabled="imuDataArray.count === 0 && collectedDataSets.length === 0 && !reportData"
          >
            Clear Data
          </el-button>
        </el-button-group>

        <el-button
          type="success"
          @click="sendCsvToBackend"
          :disabled="!canUpload || isSending"
        >
          {{ isSending ? 'Uploading...' : 'Upload Data' }}
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
          <el-card class="main-data-card">
            <template #header>
              <div class="card-header">
                <span>IMU Data ({{ isCollecting ? 'Collecting...' : 'Collection Stopped' }})</span>
                <span class="data-count">Total {{ imuDataArray.count }} records</span>
              </div>
            </template>

            <div class="data-table-section">
              <el-table
                :data="imuDataArray.visibleData"
                border
                height="300"
                v-loading="isCollecting"
              >
                <el-table-column prop="timestamp" label="Time" width="180" />
                <el-table-column prop="deviceName" label="Device Name" width="120" />

                <el-table-column label="Acceleration (g)">
                  <el-table-column prop="AccX" label="X" width="90" />
                  <el-table-column prop="AccY" label="Y" width="90" />
                  <el-table-column prop="AccZ" label="Z" width="90" />
                </el-table-column>

                <el-table-column label="Angular Velocity (°/s)">
                  <el-table-column prop="GyroX" label="X" width="90" />
                  <el-table-column prop="GyroY" label="Y" width="90" />
                  <el-table-column prop="GyroZ" label="Z" width="90" />
                </el-table-column>

                <el-table-column label="Angle (°)">
                  <el-table-column prop="Roll" label="Roll" width="90" />
                  <el-table-column prop="Pitch" label="Pitch" width="90" />
                  <el-table-column prop="Yaw" label="Yaw" width="90" />
                </el-table-column>
              </el-table>

              <div class="pagination" v-if="imuDataArray.count > imuDataArray.pageSize">
                <el-pagination
                  @current-change="changePage"
                  :current-page="imuDataArray.currentPage + 1"
                  :page-size="imuDataArray.pageSize"
                  layout="prev, pager, next"
                  :total="imuDataArray.count"
                />
              </div>
            </div>

            <div class="analysis-report-container">
              <el-card class="analysis-card">
                <template #header>
                  <div class="card-header">
                    <span>Amplitude Analysis</span>
                    <el-button
                      v-if="reportData"
                      type="text"
                      @click="toggleDataView"
                      style="float: right; padding: 3px 0"
                    >
                      {{ showRawData ? 'Show Analysis' : 'Show Raw Data' }}
                    </el-button>
                  </div>
                </template>

                <div v-if="reportData">
                  <div v-if="showRawData" style="max-height: 300px; overflow-y: auto;">
                    <el-table :data="rawDataTable" border style="width: 100%">
                      <el-table-column prop="timestamp" label="Time" width="180" />
                      <el-table-column prop="deviceName" label="Device" width="120" />
                      <el-table-column prop="AccX" label="AccX" width="80" />
                      <el-table-column prop="AccY" label="AccY" width="80" />
                      <el-table-column prop="AccZ" label="AccZ" width="80" />
                      <el-table-column prop="GyroX" label="GyroX" width="80" />
                      <el-table-column prop="GyroY" label="GyroY" width="80" />
                      <el-table-column prop="GyroZ" label="GyroZ" width="80" />
                    </el-table>
                  </div>
                  <div v-else>
                    <el-table :data="analysisTable" border style="width: 100%">
                      <el-table-column prop="index" label="Index" width="80"></el-table-column>
                      <el-table-column prop="normal" label="Standard Amplitude"></el-table-column>
                      <el-table-column prop="motion" label="Motion Amplitude"></el-table-column>
                      <el-table-column prop="difference" label="Difference"></el-table-column>
                    </el-table>
                  </div>
                </div>
                <div v-else style="text-align: center; padding: 20px;">
                  <el-empty description="No analysis data" />
                  <p style="color: #999; margin-top: 10px;">
                    Upload data to view analysis results
                  </p>
                </div>
              </el-card>

              <el-card class="report-card">
                <template #header>
                  <div class="card-header">
                    <span>Doctor Assessment</span>
                    <el-button
                      v-if="reportId"
                      type="text"
                      @click="updateReport"
                      style="float: right; padding: 3px 0"
                      :loading="isUpdatingReport"
                    >
                      Save Changes
                    </el-button>
                  </div>
                </template>

                <el-form label-position="top">
                  <el-form-item label="Report Type">
                    <el-select v-model="reportType" placeholder="Select report type" style="width: 100%">
                      <el-option label="Initial Assessment" value="Initial Assessment" />
                      <el-option label="Progress Report" value="Progress Report" />
                      <el-option label="Final Evaluation" value="Final Evaluation" />
                      <el-option label="Custom" value="Custom" />
                    </el-select>
                    <el-input
                      v-if="reportType === 'Custom'"
                      v-model="customReportTypeName"
                      placeholder="Enter custom report type"
                      style="margin-top: 10px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Doctor Comments">
                    <el-input
                      type="textarea"
                      v-model="doctorComment"
                      placeholder="Enter your assessment and suggestions"
                      :rows="4"
                      resize="none"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="success"
                      @click="handleReportUpload"
                      :loading="isUploadingReport"
                      style="width: 100%"
                    >
                      Upload Complete Report
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import axios from '../utils/axios';  // 使用自定义的 axios 实例
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import { ArrowLeft } from '@element-plus/icons-vue';
import { throttle } from 'lodash-es';

const SERVICE_UUID = "0000ffe5-0000-1000-8000-00805f9a34fb";
const READ_CHAR_UUID = "0000ffe4-0000-1000-8000-00805f9a34fb";
const WRITE_CHAR_UUID = "0000ffe9-0000-1000-8000-00805f9a34fb";

const route = useRoute();
const router = useRouter();

const devices = ref([]);
const isConnecting = ref(false);
const isCollecting = ref(false);
const isSending = ref(false);
const patientId = ref(null);
const doctorIdFromQuery = ref(null);

const rawImuData = ref([]);
const collectionCount = ref(0);
const collectedDataSets = ref([]);

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

const throttledUpdateDisplay = throttle(() => {
  imuDataArray.value.data = isCollecting.value
    ? rawImuData.value.slice(-500)
    : [...rawImuData.value];
}, 200);

const reportId = ref(null);
const reportData = ref(null);
const reportType = ref('Initial Assessment');
const customReportTypeName = ref('');
const doctorComment = ref('');
const isUpdatingReport = ref(false);
const isUploadingReport = ref(false);
const showRawData = ref(false);

watch(reportType, (newValue) => {
  if (newValue !== 'Custom') {
    customReportTypeName.value = '';
  }
});

const canUpload = computed(() => {
  return collectedDataSets.value.length >= 4;
});

const rawDataTable = computed(() => {
  return imuDataArray.value.data.slice(-50).reverse();
});

const analysisTable = computed(() => {
  if (!reportData.value || !reportData.value.reportData) return [];
  const standardAmplitudes = reportData.value.reportData.standardAmplitude || [];
  const motionAmplitudes = reportData.value.reportData.motionAmplitude || [];
  const differences = reportData.value.reportData.difference || [];

  const maxLength = Math.max(standardAmplitudes.length, motionAmplitudes.length, differences.length);

  return Array.from({ length: maxLength }).map((_, index) => ({
    index: index + 1,
    normal: standardAmplitudes[index] !== undefined ? standardAmplitudes[index] : '-',
    motion: motionAmplitudes[index] !== undefined ? motionAmplitudes[index] : '-',
    difference: differences[index] !== undefined ? differences[index] : '-',
  }));
});

onMounted(() => {
  if (route.query.patientId) {
    patientId.value = route.query.patientId;
    console.log('Bluetooth page received patient ID:', patientId.value);
  } else {
    console.warn('Bluetooth page did not receive patient ID');
    ElMessage.error('Patient ID not received, cannot associate data');
  }
  if (route.query.doctorId) {
    doctorIdFromQuery.value = route.query.doctorId;
    console.log('Bluetooth page received doctor ID:', doctorIdFromQuery.value);
  }
});

onBeforeUnmount(() => {
  stopAllDevices();
  throttledUpdateDisplay.cancel();
});

async function connectSingleDevice() {
  let loadingInstance;
  try {
    isConnecting.value = true;
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Searching and connecting to Bluetooth devices...',
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
      name: device.name || `Device${devices.value.length + 1}`,
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

    ElMessage.success(`${device.name || 'Device'} connected!`);

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
       device.tempBytes.shift();
       continue;
    }

    if (device.tempBytes.length === 20) {
      const data = processDataPacket(device.tempBytes, device);
      if (data) {
         rawImuData.value.push(data);
         device.lastData = data;

         throttledUpdateDisplay();
      }

      device.tempBytes = [];
    }
  }
}

function processDataPacket(bytes, device) {
  if (bytes.length < 20) {
    console.error(`Attempt to process incomplete data packet (${bytes.length} bytes)`);
    return null;
  }

  const buffer = new ArrayBuffer(20);
  const view = new DataView(buffer);
  for (let i = 0; i < 20; i++) {
    view.setUint8(i, bytes[i]);
  }

  const getInt16 = (offset) => {
    try {
      const val = view.getInt16(offset, true);
      return val;
    } catch (e) {
      console.error(`Read int16 error (offset ${offset}):`, e);
      return 0;
    }
  };

  const accScale = 16;
  const gyroScale = 2000;
  const angleScale = 180;

  return {
    timestamp: new Date().toISOString(),
    deviceName: device.name,
    deviceId: device.id,
    AccX: (getInt16(2) / 32768 * accScale).toFixed(4),
    AccY: (getInt16(4) / 32768 * accScale).toFixed(4),
    AccZ: (getInt16(6) / 32768 * accScale).toFixed(4),
    GyroX: (getInt16(8) / 32768 * gyroScale).toFixed(2),
    GyroY: (getInt16(10) / 32768 * gyroScale).toFixed(2),
    GyroZ: (getInt16(12) / 32768 * gyroScale).toFixed(2),
    Roll: (getInt16(14) / 32768 * angleScale).toFixed(2),
    Pitch: (getInt16(16) / 32768 * angleScale).toFixed(2),
    Yaw: (getInt16(18) / 32768 * angleScale).toFixed(2)
  };
}

function startDataCollection() {
  if (devices.value.length === 0) {
    ElMessage.warning("Please connect at least 1 device!");
    return;
  }
   if (isCollecting.value) {
     ElMessage.warning("Already collecting!");
     return;
   }

  isCollecting.value = true;
  rawImuData.value = [];
  imuDataArray.value.data = [];
  imuDataArray.value.currentPage = 0;

  ElMessage.success("Started data collection...");
}

function stopDataCollection() {
  if (!isCollecting.value) {
    ElMessage.info("Not currently collecting data");
    return;
  }
  isCollecting.value = false;

  if (rawImuData.value.length > 0) {
     collectedDataSets.value.push([...rawImuData.value]);
     collectionCount.value += 1;
     ElMessage.success(`Collection ${collectionCount.value} completed, collected ${rawImuData.value.length} records`);
      if (collectionCount.value >= 2) {
        ElMessage.info(`Completed ${collectionCount.value} collections, data can be uploaded`);
      }
  } else {
      ElMessage.warning("Collection stopped, no data collected this time.");
  }

  imuDataArray.value.data = [...rawImuData.value];
  imuDataArray.value.currentPage = 0;

  throttledUpdateDisplay.cancel();
}

function handleDisconnect(deviceId) {
  const deviceIndex = devices.value.findIndex(d => d.id === deviceId);
  if (deviceIndex !== -1) {
    const device = devices.value[deviceIndex];
    devices.value.splice(deviceIndex, 1);

    if (device.notifyChar && device.handler) {
        try {
           device.notifyChar.removeEventListener('characteristicvaluechanged', device.handler);
        } catch(e) {
           console.warn("Failed to remove event listener on disconnect:", e);
        }
    }

    if (devices.value.length === 0) {
      ElMessage.info("All devices disconnected");
      if (isCollecting.value) {
          stopDataCollection();
      }
    } else {
       ElMessage.warning(`${device.name || 'Device'} disconnected`);
    }
  }
}

async function stopAllDevices() {
    if (devices.value.length === 0) {
        ElMessage.info("No devices to disconnect");
        return;
    }

    if (isCollecting.value) {
        stopDataCollection();
    }

    const loading = ElLoading.service({
        lock: true,
        text: 'Disconnecting all devices...',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    const disconnectPromises = devices.value.map(async (dev) => {
        try {
            if (dev.server && dev.server.connected) {
                if (dev.notifyChar && dev.handler) {
                    try {
                      dev.notifyChar.removeEventListener('characteristicvaluechanged', dev.handler);
                    } catch(e) {
                      console.warn('Failed to remove event listener during stopAllDevices:', e);
                    }
                }
                 if (dev.notifyChar && dev.notifyChar.properties.notify) {
                     try {
                         await dev.notifyChar.stopNotifications();
                     } catch(e) {
                         console.warn('Failed to stop notifications during stopAllDevices:', e);
                     }
                 }
                await dev.server.disconnect();
            }
        } catch (error) {
            console.error('Disconnect device error:', error);
        }
        return dev;
    });

    await Promise.all(disconnectPromises);

    devices.value = [];

    ElMessage.info("All devices disconnected");
    loading.close();
}

function exportToCSV() {
  if (collectedDataSets.value.length === 0) {
    ElMessage.warning("No data to export");
    return;
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Preparing CSV file...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  try {
    const headers = [
      'Timestamp', 'Device ID', 'Device Name',
      'AccX(g)', 'AccY(g)', 'AccZ(g)',
      'GyroX(°/s)', 'GyroY(°/s)', 'GyroZ(°/s)',
      'Roll(°)', 'Pitch(°)', 'Yaw(°)'
    ].join(',') + '\n';

    collectedDataSets.value.forEach((dataset, index) => {
      let csvString = "\uFEFF" + headers;
      csvString += dataset.map(row =>
        [
          `"${row.timestamp}"`,
          row.deviceId,
          `"${row.deviceName}"`,
          row.AccX, row.AccY, row.AccZ,
          row.GyroX, row.GyroY, row.GyroZ,
          row.Roll, row.Pitch, row.Yaw
        ].join(',')
      ).join('\n');

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      link.download = `${timestamp}-${index + 1}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });

    ElMessage.success(`Successfully exported ${collectedDataSets.value.length} CSV files`);

  } catch (error) {
    console.error('CSV export failed:', error);
    ElMessage.error('CSV export failed');
  } finally {
    loading.close();
  }
}

async function sendCsvToBackend() {
  if (collectedDataSets.value.length < 4) {
    ElMessage.warning(`需要完成4次数据采集 (当前已完成 ${collectedDataSets.value.length} 次)`);
    return;
  }

  if (!patientId.value) {
    ElMessage.error("未获取到患者ID，无法上传数据");
    return;
  }

  isSending.value = true;
  const loading = ElLoading.service({
    lock: true,
    text: "Uploading data to server...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    const headers = [
      "时间戳", "设备ID", "设备名称",
      "AccX(g)", "AccY(g)", "AccZ(g)",
      "GyroX(°/s)", "GyroY(°/s)", "GyroZ(°/s)",
      "Roll(°)", "Pitch(°)", "Yaw(°)"
    ].join(",") + "\n";

    const formData = new FormData();
    formData.append("patientId", patientId.value);

    for (let i = 0; i < 4; i++) {
      let csvString = "\uFEFF" + headers;
      csvString += collectedDataSets.value[i]
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

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const filename = `${timestamp}-${i + 1}.csv`;
      const csvFile = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      formData.append(`file${i + 1}`, csvFile, filename);
    }

    const response = await axios.post("/api/patients/data", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data && response.data.status === 200) {
      reportId.value = response.data.data.reportId;
      reportData.value = response.data.data;
      ElMessage.success("数据上传成功，分析结果已更新");
      console.log("服务器响应:", response.data);
      collectedDataSets.value = [];
      collectionCount.value = 0;
    } else {
      throw new Error(response.data?.message || `上传数据失败，状态码: ${response.status}`);
    }
  } catch (error) {
    ElMessage.error(`上传数据失败: ${error.message}`);
    console.error("上传数据失败:", error);
  } finally {
    isSending.value = false;
    loading.close();
  }
}

async function updateReport() {
  if (!reportId.value) {
    ElMessage.warning("无报告ID可用，请先上传数据以创建报告");
    return;
  }

  isUpdatingReport.value = true;
  const loading = ElLoading.service({
        lock: true,
        text: '正在保存报告修改...',
        background: 'rgba(0, 0, 0, 0.7)'
    });

  try {
    const reportTypeToSend = reportType.value === 'Custom' ? customReportTypeName.value : reportType.value;

    if (reportType.value === 'Custom' && reportTypeToSend.trim() === '') {
        ElMessage.warning("请填写自定义报告类型");
        loading.close();
        isUpdatingReport.value = false;
        return;
    }

    const response = await axios.put(`/api/patients/${patientId.value}/reports/${reportId.value}`, {
      type: reportTypeToSend,
      summary: doctorComment.value
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data && response.data.status === 200) {
      ElMessage.success("报告更新成功");
    } else {
      throw new Error(response.data?.message || `更新报告失败，状态码: ${response.status}`);
    }
  } catch (error) {
    ElMessage.error(`更新报告失败: ${error.message}`);
    console.error("更新报告失败:", error);
  } finally {
    isUpdatingReport.value = false;
    loading.close();
  }
}

async function handleReportUpload() {
    if (!reportId.value) {
    ElMessage.warning("请先上传数据以创建报告");
    return;
    }

    if (reportType.value === 'Custom' && customReportTypeName.value.trim() === '') {
        ElMessage.warning("请填写自定义报告类型");
        return;
    }

    isUploadingReport.value = true;
     const loading = ElLoading.service({
        lock: true,
        text: '正在处理报告...',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    try {
      await updateReport();
       ElMessageBox.alert('报告信息已保存!', '成功', {
            confirmButtonText: '确定',
            type: 'success',
        });
    } catch (error) {
         console.error("处理报告上传/保存失败:", error);
    } finally {
        isUploadingReport.value = false;
        loading.close();
    }
}

function toggleDataView() {
  showRawData.value = !showRawData.value;
}

function clearData() {
    ElMessageBox.confirm(
      '这将清空所有采集到的IMU数据、已保存的采集次数和报告分析结果，确定要继续吗？',
      '警告',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    .then(() => {
      rawImuData.value = [];
      imuDataArray.value.data = [];
      imuDataArray.value.currentPage = 0;
      collectedDataSets.value = [];
      collectionCount.value = 0;
      reportData.value = null;
      reportId.value = null;
      reportType.value = 'Initial Assessment';
      customReportTypeName.value = '';
      doctorComment.value = '';
      showRawData.value = false;

      throttledUpdateDisplay.cancel();

      ElMessage.success("所有数据和报告信息已清空");
    })
    .catch(() => {
        // User cancelled, do nothing
    });
}

function changePage(newPage) {
  imuDataArray.value.currentPage = newPage - 1;
}

function goBackToPatientManage() {
  if (doctorIdFromQuery.value) {
    router.push({
      name: 'PatientManage',
      params: { doctorId: doctorIdFromQuery.value }
    });
  } else {
    console.warn("Doctor ID not available in route query, cannot navigate back to specific patient list.");
    ElMessage.warning("Unable to determine doctor information, cannot return to patient list page.");
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409EFF;
  color: white;
  padding: 0 20px;
  height: 60px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.app-main {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.el-row {
  height: auto;
  margin-bottom: 20px;
}

.device-list {
  height: auto;
  margin-bottom: 20px;
}

.device-list .el-card__body {
  max-height: 300px;
  overflow-y: auto;
}

.main-data-card {
  display: flex;
  flex-direction: column;
}

.main-data-card .el-card__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.el-table {
  width: 100%;
  margin-bottom: 20px;
}

.el-table__body-wrapper {
  max-height: 300px;
}

.analysis-report-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.analysis-card {
  flex: 1;
  min-width: 45%;
  margin-bottom: 20px;
}

.report-card {
  flex: 1;
  min-width: 45%;
  margin-bottom: 20px;
}

.analysis-table-container {
  width: 100%;
  overflow-x: auto;
}

.device-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.device-data {
  font-size: 12px;
  color: #666;
}

@media screen and (max-width: 1200px) {
  .analysis-report-container {
    flex-direction: column;
  }
  
  .analysis-card,
  .report-card {
    min-width: 100%;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.data-count {
  font-size: 14px;
  color: #666;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.back-button {
  color: white;
  margin-right: 20px;
}

.el-card__body {
  height: auto !important;
  overflow: visible !important;
}
</style>