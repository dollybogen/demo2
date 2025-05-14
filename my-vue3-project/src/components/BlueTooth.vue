<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-left">
        <el-button
          type="text"
          @click="goBackToPatientManage"
          class="back-button"
        >
          <el-icon><ArrowLeft /></el-icon> <span>返回患者列表</span>
        </el-button>
        <h1>多设备IMU数据采集系统</h1>
      </div>

      <div class="header-actions">
        <el-button
          type="primary"
          @click="connectSingleDevice"
          :disabled="isConnecting"
        >
          {{ isConnecting ? "正在连接..." : `连接设备 (${devices.length})` }}
        </el-button>

        <el-button-group>
          <el-button
            type="success"
            @click="startDataCollection"
            :disabled="devices.length === 0 || isCollecting"
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
            :disabled="imuDataArray.count === 0 && collectedDataSets.length === 0 && !reportData"
          >
            清空数据
          </el-button>
        </el-button-group>

        <el-button
          type="success"
          @click="sendCsvToBackend"
          :disabled="!canUpload || isSending"
        >
          {{ isSending ? '上传中...' : '上传数据' }}
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
          <el-card class="main-data-card">
            <template #header>
              <div class="card-header">
                <span>IMU数据 ({{ isCollecting ? '实时采集中...' : '已停止采集' }})</span>
                <span class="data-count">共 {{ imuDataArray.count }} 条数据</span>
              </div>
            </template>

            <el-table
              :data="imuDataArray.visibleData"
              border
              height="270" style="width: 100%"
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

            <div class="analysis-report-container">
              <el-card class="analysis-card">
                <template #header>
                  <div class="card-header">
                    <span>幅度分析</span>
                    <el-button
                      v-if="reportData"
                      type="text"
                      @click="toggleDataView"
                      style="float: right; padding: 3px 0"
                    >
                      {{ showRawData ? '显示分析' : '显示原始数据' }}
                    </el-button>
                  </div>
                </template>

                <div v-if="reportData">
                  <div v-if="showRawData" style="max-height: 300px; overflow-y: auto;">
                    <el-table :data="rawDataTable" border style="width: 100%">
                      <el-table-column prop="timestamp" label="时间" width="180" />
                      <el-table-column prop="deviceName" label="设备" width="120" />
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
                      <el-table-column prop="index" label="序号" width="80"></el-table-column>
                      <el-table-column prop="normal" label="标准幅度"></el-table-column>
                      <el-table-column prop="motion" label="运动幅度"></el-table-column>
                      <el-table-column prop="difference" label="差值"></el-table-column>
                    </el-table>

                    <div style="margin-top: 20px;">
                      <h4>评分总结</h4>
                      <el-progress
                        :percentage="scorePercentage"
                        :status="scoreStatus"
                        :text-inside="true"
                        :stroke-width="24"
                      />
                      <p style="margin-top: 10px; color: #666;">
                        {{ scoreEvaluation }}
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else style="text-align: center; padding: 20px;">
                  <el-empty description="暂无分析数据" />
                  <p style="color: #999; margin-top: 10px;">
                    上传数据后可查看分析结果
                  </p>
                </div>
              </el-card>

              <el-card class="report-card">
                <template #header>
                  <div class="card-header">
                    <span>医生评估</span>
                    <el-button
                      v-if="reportId"
                      type="text"
                      @click="updateReport"
                      style="float: right; padding: 3px 0"
                      :loading="isUpdatingReport"
                    >
                      保存修改
                    </el-button>
                  </div>
                </template>

                <el-form label-position="top">
                  <el-form-item label="报告类型">
                    <el-select v-model="reportType" placeholder="选择报告类型" style="width: 100%">
                      <el-option label="初始评估" value="Initial Assessment" />
                      <el-option label="进展报告" value="Progress Report" />
                      <el-option label="最终评估" value="Final Evaluation" />
                      <el-option label="自定义" value="Custom" />
                    </el-select>
                    <el-input
                      v-if="reportType === 'Custom'"
                      v-model="customReportTypeName"
                      placeholder="请输入自定义报告类型"
                      style="margin-top: 10px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="医生评语">
                    <el-input
                      type="textarea"
                      v-model="doctorComment"
                      placeholder="输入您的评估和建议"
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
                      上传完整报告
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
// Import axios for backend communication
import axios from "axios";
// Import router and route for navigation and params
import { useRouter, useRoute } from "vue-router";
// Import Element Plus components
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
// Import Element Plus icon
import { ArrowLeft } from '@element-plus/icons-vue';
// Import throttle utility
import { throttle } from 'lodash-es';

const SERVICE_UUID = "0000ffe5-0000-1000-8000-00805f9a34fb";
const READ_CHAR_UUID = "0000ffe4-0000-1000-8000-00805f9a34fb";
const WRITE_CHAR_UUID = "0000ffe9-0000-1000-8000-00805f9a34fb";

// Get router and route instances
const route = useRoute();
const router = useRouter();

// State variables (combined from Code 1 and Code 2)
const devices = ref([]);
const isConnecting = ref(false);
const isCollecting = ref(false);
const isSending = ref(false); // For data upload status
const patientId = ref(null); // From route query
const doctorIdFromQuery = ref(null); // From route query

// Data storage (rawImuData from Code 1, datasets from Code 2)
const rawImuData = ref([]); // Stores all data for the *current* collection session
const collectionCount = ref(0); // Number of completed collection sets
const collectedDataSets = ref([]); // Stores snapshots of rawImuData after each 'Stop'

// Display data structure (from Code 1, used for table and export)
const imuDataArray = ref({
  data: [], // This holds data for the table display (throttled recent or full stopped data)
  pageSize: 100,
  currentPage: 0,
  get count() {
    return this.data.length;
  },
  get visibleData() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    // Display recent data first, apply pagination
    return [...this.data].reverse().slice(start, end);
  }
});

// Throttled UI update function (from Code 1)
const throttledUpdateDisplay = throttle(() => {
  // During collection, show only the last N data points (adjust N as needed for table height)
  // After stopping, show all collected data from rawImuData
  imuDataArray.value.data = isCollecting.value
    ? rawImuData.value.slice(-500) // Showing more data points now
    : [...rawImuData.value]; // Spread to ensure reactivity updates

  // Optional: Reset pagination when data changes
  // imuDataArray.value.currentPage = 0; // Can be jarring during live updates
}, 200); // Update display data at most every 200ms


// Report and Analysis state (from Code 2)
const reportId = ref(null); // ID of the created report on the backend
const reportData = ref(null); // Stores analysis results from backend
const reportType = ref('Initial Assessment'); // Doctor evaluation type
const customReportTypeName = ref(''); // Custom type input
const doctorComment = ref(''); // Doctor's comment/summary
const isUpdatingReport = ref(false); // Loading state for saving doctor input
const isUploadingReport = ref(false); // Loading state for the '上传完整报告' button
const showRawData = ref(false); // Toggle view in analysis card


// Watcher for report type (from Code 2)
watch(reportType, (newValue) => {
  if (newValue !== 'Custom') {
    customReportTypeName.value = '';
  }
});

// Computed properties (from Code 2)
const canUpload = computed(() => {
  // Can upload if at least 2 collection sets are stored
  return collectedDataSets.value.length >= 2;
});

const rawDataTable = computed(() => {
  // Display the latest 50 data points from the currently displayed data array for the analysis card sample
  return imuDataArray.value.data.slice(-50).reverse(); // Get last 50, then reverse for newest first
});

const analysisTable = computed(() => {
  if (!reportData.value || !reportData.value.reportData) return [];
   // Ensure these properties exist and are arrays before mapping
  const standardAmplitudes = reportData.value.reportData.标准幅度 || [];
  const motionAmplitudes = reportData.value.reportData.运动幅度 || [];
  const differences = reportData.value.reportData.差值 || [];

  const maxLength = Math.max(standardAmplitudes.length, motionAmplitudes.length, differences.length);

  return Array.from({ length: maxLength }).map((_, index) => ({
    index: index + 1,
    normal: standardAmplitudes[index] !== undefined ? standardAmplitudes[index] : '-',
    motion: motionAmplitudes[index] !== undefined ? motionAmplitudes[index] : '-',
    difference: differences[index] !== undefined ? differences[index] : '-',
  }));
});

const scorePercentage = computed(() => {
  if (!reportData.value || !reportData.value.reportData || !reportData.value.reportData.差值) return 0;
  const differences = reportData.value.reportData.差值;
    if (differences.length === 0) return 0;
  const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
  const score = Math.max(0, 100 - Math.abs(avgDiff) * 10); // Example scoring
  return Math.min(100, parseFloat(score.toFixed(2)));
});

const scoreStatus = computed(() => {
  const score = scorePercentage.value;
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'exception';
});

const scoreEvaluation = computed(() => {
  const score = scorePercentage.value;
  if (score >= 90) return '状态优秀，与正常范围偏差极小';
  if (score >= 75) return '状态良好，有轻微偏差，建议观察';
  if (score >= 60) return '状态一般，有明显偏差，建议干预';
  return '状态较差，偏差显著，建议立即干预';
});


// Lifecycle hooks (from Code 1, modified for route params and cleanup)
onMounted(() => {
  // Get patientId and doctorId from route query
  if (route.query.patientId) {
    patientId.value = route.query.patientId;
    console.log('蓝牙页面接收到患者 ID:', patientId.value);
  } else {
    console.warn('蓝牙页面未接收到患者 ID');
    ElMessage.error('未获取到患者 ID，无法进行数据关联');
  }
   if (route.query.doctorId) {
     doctorIdFromQuery.value = route.query.doctorId;
     console.log('蓝牙页面接收到医生 ID:', doctorIdFromQuery.value);
   }

});

onBeforeUnmount(() => {
  // Disconnect devices and cancel throttled updates on component unmount
  stopAllDevices();
  throttledUpdateDisplay.cancel();
});


// Bluetooth connection function (from Code 1)
async function connectSingleDevice() {
  let loadingInstance;
  try {
    isConnecting.value = true;
    loadingInstance = ElLoading.service({
      lock: true,
      text: '正在搜索并连接蓝牙设备...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "WT" }], // Filter by name prefix
      optionalServices: [SERVICE_UUID], // Specify optional service UUID
    });

    // Add disconnect listener
    device.addEventListener('gattserverdisconnected', () => handleDisconnect(device.id));

    const server = await device.gatt.connect(); // Connect to GATT server
    const service = await server.getPrimaryService(SERVICE_UUID); // Get primary service

    // Get characteristics
    const [notifyChar, writeChar] = await Promise.all([
      service.getCharacteristic(READ_CHAR_UUID), // Characteristic for notifications
      service.getCharacteristic(WRITE_CHAR_UUID) // Characteristic for writing (if needed)
    ]);

    // Store device details and characteristics in a device object
    const deviceObj = {
      id: device.id,
      name: device.name || `设备${devices.value.length + 1}`,
      device, // Store the Web Bluetooth Device object
      server, // Store the GATT server object
      notifyChar, // Store the notification characteristic
      writeChar, // Store the write characteristic
      connected: true, // Connection status flag
      lastData: null, // Stores the last received data for display
      tempBytes: [], // Buffer for fragmented incoming bytes
      handler: (event) => { // Event handler for characteristic value changes
        handleData(event, device.id);
      }
    };

    // Add the new device object to the reactive devices list
    devices.value.push(deviceObj);

    // Start receiving notifications from the characteristic
    await notifyChar.startNotifications();
    // Add the event listener to the characteristic
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

// Handles incoming BLE data notifications (Core fast processing logic from Code 1)
function handleData(event, deviceId) {
  // Only process data if collection is active
  if (!isCollecting.value) return;

  const value = event.target.value; // DataView containing the received bytes
  const bytes = new Uint8Array(value.buffer); // Convert DataView buffer to Uint8Array
  const device = devices.value.find(d => d.id === deviceId); // Find the corresponding device object
  if (!device) return;

  // Process all bytes received in this notification event
  for (const byte of bytes) {
    device.tempBytes.push(byte); // Add the current byte to the device's buffer

    // Packet start validation (0x55 header) - logic from Code 1
    // If buffer has only one byte and it's not 0x55, discard it.
    if (device.tempBytes.length === 1 && device.tempBytes[0] !== 0x55) {
      device.tempBytes.shift();
      continue;
    }

    // Packet type validation (0x61 for data) - logic from Code 1 (slightly simplified)
    // If buffer has two bytes and the second is not 0x61, discard the first byte (0x55) and the second.
    // This assumes 0x55 is only followed by 0x61 for data packets we care about here.
    // The logic here is slightly less robust than Code 2's enhanced check but matches Code 1's original.
    if (device.tempBytes.length === 2 && device.tempBytes[1] !== 0x61) {
       // If 0x55 is not followed by 0x61, discard 0x55 and the next byte
       device.tempBytes.shift(); // Discard 0x55
       device.tempBytes.shift(); // Discard the byte that wasn't 0x61
       continue;
    }


    // If the buffer has accumulated enough bytes for a full packet (20 bytes)
    if (device.tempBytes.length === 20) {
      // Process the complete 20-byte packet
      const data = processDataPacket(device.tempBytes, device);
      if (data) { // Ensure data was successfully processed
         rawImuData.value.push(data); // Add processed data to the main raw data array
         device.lastData = data; // Update last data for display in device list

         // *** CRITICAL FOR SPEED (from Code 1): Trigger throttled UI update ***
         // This function limits how often the main data table and related computed props update,
         // preventing the UI from blocking the BLE notification handler.
         throttledUpdateDisplay();
      }

      // Clear the buffer after processing a packet (logic from Code 1)
      device.tempBytes = [];
      // Note: Code 1's buffer clearing is simple. Code 2 had more robust slicing
      // which might be better if packets can be concatenated in a single notification.
      // Sticking to Code 1's original clear for maximum compatibility with its speed.
    }
     // Note: Code 1 did not have explicit buffer overflow check > 20 bytes within the loop
     // This might be a slight risk if malformed packets arrive, but keeping it simple like Code 1 for speed.
  }
}

// Processes a single 20-byte IMU data packet (from Code 1)
function processDataPacket(bytes, device) {
  if (bytes.length < 20) {
    // This case should ideally not be hit if handleData logic is correct
    console.error(`尝试处理不完整的数据包 (${bytes.length} bytes)`);
    return null;
  }

  // Use DataView to read values from the byte array
  const buffer = new ArrayBuffer(20);
  const view = new DataView(buffer);
  for (let i = 0; i < 20; i++) {
    view.setUint8(i, bytes[i]);
  }

  // Helper to read Int16 (Signed 16-bit integer) from DataView, handling little-endian
  const getInt16 = (offset) => {
    try {
      const val = view.getInt16(offset, true); // Use true for little-endian
      // Code 1 included manual conversion for negative numbers > 32767
      // but DataView.getInt16 should handle two's complement correctly.
      // Let's stick to the simpler DataView output unless issues arise.
      // val >= 32768 ? val - 65536 : val; <-- Removed this part from Code 1's original snippet here
      return val;
    } catch (e) {
      console.error(`读取int16错误 (offset ${offset}):`, e);
      return 0;
    }
  };

  // Sensor data scaling factors (based on common WT sensor protocols)
  const accScale = 16; // ±16g
  const gyroScale = 2000; // ±2000°/s
  const angleScale = 180; // ±180°

  // Extract and scale data points
  return {
    timestamp: new Date().toISOString(), // Add current timestamp
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

// Starts the data collection process (from Code 1)
function startDataCollection() {
  if (devices.value.length === 0) {
    ElMessage.warning("请先连接至少1个设备！");
    return;
  }
   if (isCollecting.value) { // Prevent starting if already collecting
     ElMessage.warning("已经在采集中!");
     return;
   }

  isCollecting.value = true;
  rawImuData.value = []; // Clear raw data for the new session
  // imuDataArray.value.data will be updated by the throttled function during collection
  imuDataArray.value.data = []; // Clear displayed data initially
  imuDataArray.value.currentPage = 0; // Reset pagination

  ElMessage.success("开始采集数据...");
}

// Stops the data collection process (from Code 1, modified to save dataset)
function stopDataCollection() {
  if (!isCollecting.value) {
    ElMessage.info("当前未在采集数据");
    return;
  }
  isCollecting.value = false; // Set collecting state to false

  // *** Added from Code 2: Save a snapshot of collected data and increment count ***
  if (rawImuData.value.length > 0) {
     collectedDataSets.value.push([...rawImuData.value]); // Store a copy of the current raw data
     collectionCount.value += 1; // Increment collection count
     ElMessage.success(`第 ${collectionCount.value} 次采集完成，共采集 ${rawImuData.value.length} 条数据`);
      if (collectionCount.value >= 2) {
        ElMessage.info(`已完成${collectionCount.value}次采集，可以上传数据`);
      }
  } else {
      ElMessage.warning("停止采集，本次未采集到数据。");
  }
  // *** End added from Code 2 ***


  // Update the displayed data array with ALL collected data after stopping (from Code 1)
  // This makes the full dataset available for pagination and export via imuDataArray
  imuDataArray.value.data = [...rawImuData.value];
  imuDataArray.value.currentPage = 0; // Reset pagination to the first page

  // Cancel any pending throttled display updates
  throttledUpdateDisplay.cancel();
}

// Handles device disconnection event (using logic similar to Code 2 for UI update)
function handleDisconnect(deviceId) {
  // Find the device by ID
  const deviceIndex = devices.value.findIndex(d => d.id === deviceId);
  if (deviceIndex !== -1) {
    const device = devices.value[deviceIndex];
    // Remove the device from the reactive list to update UI (from Code 2)
    devices.value.splice(deviceIndex, 1);

    // Clean up event listener (good practice, though browser might do it)
    if (device.notifyChar && device.handler) {
        try {
           device.notifyChar.removeEventListener('characteristicvaluechanged', device.handler);
        } catch(e) {
           console.warn("Failed to remove event listener on disconnect:", e);
        }
    }

    // Check if all devices are disconnected
    if (devices.value.length === 0) {
      ElMessage.info("所有设备已断开");
      // If collection was ongoing and all devices are gone, stop it
      if (isCollecting.value) {
          stopDataCollection(); // This will save any partial data
      }
    } else {
       // Notify which specific device disconnected
       ElMessage.warning(`${device.name || '设备'} 已断开连接`);
    }
  }
}

// Disconnects all connected devices (using logic from Code 2 for robustness)
async function stopAllDevices() {
    if (devices.value.length === 0) {
        ElMessage.info("没有设备需要断开");
        return;
    }

    // Stop data collection first
    if (isCollecting.value) {
        stopDataCollection();
    }

    const loading = ElLoading.service({ // Show loading indicator
        lock: true,
        text: '正在断开所有设备...',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    // Attempt to disconnect each device
    const disconnectPromises = devices.value.map(async (dev) => {
        try {
            // Check if server and connection state is available
            if (dev.server && dev.server.connected) {
                // Attempt to remove event listener
                if (dev.notifyChar && dev.handler) {
                    try {
                      dev.notifyChar.removeEventListener('characteristicvaluechanged', dev.handler);
                    } catch(e) {
                      console.warn('Failed to remove event listener during stopAllDevices:', e);
                    }
                }
                 // Attempt to stop notifications
                if (dev.notifyChar && dev.notifyChar.properties.notify) {
                     try {
                         await dev.notifyChar.stopNotifications();
                     } catch(e) {
                         console.warn('Failed to stop notifications during stopAllDevices:', e);
                     }
                 }
                // Disconnect the GATT server
                await dev.server.disconnect();
                // handleDisconnect listener will update the device list
            }
        } catch (error) {
            console.error('断开设备错误:', error);
             // Log error but continue with other devices
        }
         // Return something to satisfy Promise.all
        return dev;
    });

    // Wait for all disconnection attempts to complete
    await Promise.all(disconnectPromises);

    // Final clear of the devices array to ensure UI is empty (handles edge cases)
    devices.value = [];

    ElMessage.info("所有设备已断开");
    loading.close();
}

// Exports collected data (currently in imuDataArray.data) to a CSV file (from Code 1)
function exportToCSV() {
  // imuDataArray.value.data contains all data after collection stops,
  // or the recent subset during live collection. Exporting from here matches Code 1.
  const dataToExport = imuDataArray.value.data;

  if (dataToExport.length === 0) {
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

    let csvString = "\uFEFF" + headers; // Add BOM for UTF-8
    csvString += dataToExport.map(row =>
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
    link.download = `imu_data_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    ElMessage.success("CSV文件导出成功");

  } catch (error) {
    console.error('导出CSV失败:', error);
    ElMessage.error('导出CSV失败');
  } finally {
    loading.close();
  }
}

// Sends collected data sets (requires >= 2 sets) to the backend for analysis (from Code 2)
async function sendCsvToBackend() {
  // Check if upload conditions are met (at least 2 collected sets)
  if (!canUpload.value) {
    ElMessage.warning(`请先完成至少两次数据采集 (已完成 ${collectedDataSets.value.length} 次)`);
    return;
  }

  // Check if patientId is available
  if (!patientId.value) {
    ElMessage.error("未获取到患者ID，无法上传数据");
    return;
  }

  isSending.value = true; // Set sending state
  const loading = ElLoading.service({ // Show loading indicator
    lock: true,
    text: "正在上传数据到服务器...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    // Define CSV headers
    const headers = [
      "时间戳", "设备ID", "设备名称",
      "AccX(g)", "AccY(g)", "AccZ(g)",
      "GyroX(°/s)", "GyroY(°/s)", "GyroZ(°/s)",
      "Roll(°)", "Pitch(°)", "Yaw(°)"
    ].join(",") + "\n";

    const formData = new FormData(); // Create FormData object for file upload
    formData.append("patientId", patientId.value); // Append patient ID

    // Ensure we have at least two datasets (already checked by canUpload, but double check)
    if (collectedDataSets.value.length < 2) {
        // This case should ideally not be reached if canUpload check works
        throw new Error("没有足够的采集数据 (需要至少两次)");
    }

    // Process the first two collected data sets and append as files
    // Assuming the backend expects files named 'file1' and 'file2'
    for (let i = 0; i < 2; i++) {
        let csvString = "\uFEFF" + headers; // Start CSV string with BOM and headers
        csvString += collectedDataSets.value[i] // Add data rows
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

        const csvFile = new Blob([csvString], { type: "text/csv;charset=utf-8;" }); // Create Blob from CSV string
        // Create a unique filename for each file
        const filename = `imu_data_${patientId.value}_set${i + 1}_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-")}.csv`;
        formData.append(`file${i + 1}`, csvFile, filename); // Append Blob as a file named 'file1' or 'file2'
    }

    // Send POST request to backend upload endpoint using axios
    const response = await axios.post("/api/upload/csv", formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Important header for file uploads
      }
    });

    // Check backend response status
    if (response.data && response.data.status === 200) {
      reportId.value = response.data.data.reportId; // Store returned report ID
      reportData.value = response.data.data; // Store returned analysis data
      ElMessage.success("数据上传成功，分析结果已更新");
      console.log("服务器响应:", response.data);
      // Clear collected datasets after successful upload to prevent re-uploading the same data
      collectedDataSets.value = [];
      collectionCount.value = 0; // Reset count
    } else {
      // Throw error if backend indicates failure
      throw new Error(response.data?.message || `上传数据失败，状态码: ${response.status}`);
    }
  } catch (error) {
    // Handle network or backend errors
    ElMessage.error(`上传数据失败: ${error.message}`);
    console.error("上传数据失败:", error);
  } finally {
    isSending.value = false; // Reset sending state
    loading.close(); // Hide loading indicator
  }
}

// Updates the doctor's assessment details (type, comment) for an existing report (from Code 2)
async function updateReport() {
  // Check if a report ID exists
  if (!reportId.value) {
    ElMessage.warning("无报告ID可用，请先上传数据以创建报告");
    return;
  }

  isUpdatingReport.value = true; // Set updating state
  const loading = ElLoading.service({ // Show loading indicator
        lock: true,
        text: '正在保存报告修改...',
        background: 'rgba(0, 0, 0, 0.7)'
    });

  try {
    // Determine the report type to send (custom or standard)
    const reportTypeToSend = reportType.value === 'Custom' ? customReportTypeName.value : reportType.value;

    // Validate custom type if selected
    if (reportType.value === 'Custom' && reportTypeToSend.trim() === '') {
        ElMessage.warning("请填写自定义报告类型");
        loading.close();
        isUpdatingReport.value = false;
        return;
    }

    // Send PUT request to backend to update report details
    const response = await axios.put(`/api/report/${reportId.value}`, {
      type: reportTypeToSend, // Use selected or custom type
      summary: doctorComment.value // Send doctor's comment
    });

    // Check backend response status
    if (response.data && response.data.status === 200) {
      ElMessage.success("报告更新成功");
        // Optional: Update local reportData if backend returns updated data
        // reportData.value.type = reportTypeToSend;
        // reportData.value.summary = doctorComment.value;
    } else {
      // Throw error if backend indicates failure
      throw new Error(response.data?.message || `更新报告失败，状态码: ${response.status}`);
    }
  } catch (error) {
    // Handle network or backend errors
    ElMessage.error(`更新报告失败: ${error.message}`);
    console.error("更新报告失败:", error);
  } finally {
    isUpdatingReport.value = false; // Reset updating state
    loading.close(); // Hide loading indicator
  }
}

// Handles the action for the '上传完整报告' button (from Code 2)
// This function calls updateReport to save doctor comments and report type.
async function handleReportUpload() {
    // Check if a report ID exists
    if (!reportId.value) {
    ElMessage.warning("请先上传数据以创建报告");
    return;
    }

    // Check if custom type is selected but empty
    if (reportType.value === 'Custom' && customReportTypeName.value.trim() === '') {
        ElMessage.warning("请填写自定义报告类型");
        return;
    }

    // Set state and show loading
    isUploadingReport.value = true;
     const loading = ElLoading.service({
        lock: true,
        text: '正在处理报告...',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    try {
      await updateReport(); // Call the update logic to save comments/type
       // If updateReport was successful, show a final confirmation
       ElMessageBox.alert('报告信息已保存!', '成功', {
            confirmButtonText: '确定',
            type: 'success',
        });
    } catch (error) {
        // Error handling is mostly in updateReport, but catch here to reset state
         console.error("处理报告上传/保存失败:", error);
         // ElMessage is shown by updateReport
    } finally {
        isUploadingReport.value = false;
        loading.close();
    }
}


// Toggles between showing raw data sample and analysis table in the card (from Code 2)
function toggleDataView() {
  showRawData.value = !showRawData.value;
}

// Clears all collected data, stored datasets, and report information (modified from Code 1)
function clearData() {
    // Show confirmation dialog (from Code 2)
    ElMessageBox.confirm(
      '这将清空所有采集到的IMU数据、已保存的采集次数和报告分析结果，确定要继续吗？',
      '警告',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    .then(() => { // User confirmed
      // Reset all relevant state variables (from Code 1 and Code 2)
      rawImuData.value = []; // Clear current raw data
      imuDataArray.value.data = []; // Clear displayed data
      imuDataArray.value.currentPage = 0; // Reset pagination
      collectedDataSets.value = []; // Clear stored datasets
      collectionCount.value = 0; // Reset collection count
      reportData.value = null; // Clear analysis data
      reportId.value = null; // Clear report ID
      reportType.value = 'Initial Assessment'; // Reset report type
      customReportTypeName.value = ''; // Clear custom type
      doctorComment.value = ''; // Clear doctor comment
      showRawData.value = false; // Reset analysis view toggle

      // Cancel any pending throttled update calls
      throttledUpdateDisplay.cancel();

      ElMessage.success("所有数据和报告信息已清空");
    })
    .catch(() => {
        // User cancelled, do nothing
    });
}

// Handles pagination change for the main data table (from Code 1)
function changePage(newPage) {
  // newPage is 1-based from Element Plus, convert to 0-based for array index
  imuDataArray.value.currentPage = newPage - 1;
}

// Added navigation function from Code 2
function goBackToPatientManage() {
  if (doctorIdFromQuery.value) {
    router.push({
      name: 'PatientManage', // Assuming 'PatientManage' is the route name
      params: { doctorId: doctorIdFromQuery.value }
    });
  } else {
    console.warn("Doctor ID not available in route query, cannot navigate back to specific patient list.");
    ElMessage.warning("无法确定医生信息，无法返回患者列表页面。");
    // Fallback navigation if doctorId is missing
    // router.push('/');
  }
}
</script>

<style scoped>
/* Basic Layout (from Code 1, enhanced by Code 2 styles) */
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
  height: 60px; /* Fixed height */
  flex-shrink: 0; /* Prevent shrinking */
}

.header-left { /* Added for back button */
  display: flex;
  align-items: center;
}

.back-button { /* Added back button styles */
  color: white;
  margin-right: 20px;
  font-size: 16px;
}

.back-button .el-icon {
  margin-right: 5px;
}


.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.app-main {
  padding: 20px;
  background-color: #f5f7fa;
  flex-grow: 1; /* Allow main content to grow */
  overflow: hidden; /* Manage overflow within the main section */
  display: flex;
  flex-direction: column;
}

/* Ensure the row takes up available space and contains scrolling */
.app-main > .el-row {
  flex-grow: 1;
  display: flex; /* Use flex on row to manage columns */
  flex-wrap: nowrap; /* Prevent columns from wrapping */
  overflow: hidden; /* Hide overflow on the row itself */
}

/* Column styling - main data table column takes more space */
.app-main .el-col:first-child { /* Device list column */
    height: 100%; /* Match parent row height */
    display: flex; /* Use flex to make card fill height */
    flex-direction: column;
}
.app-main .el-col:last-child { /* Main data + Analysis/Report column */
    height: 100%; /* Match parent row height */
    display: flex; /* Use flex to make card fill height */
    flex-direction: column;
}


/* Card styling within columns */
.device-list {
  height: 100%; /* Fill the flex column */
  display: flex;
  flex-direction: column;
}
/* Allow device list body to scroll */
.device-list .el-card__body {
    flex-grow: 1;
    overflow-y: auto;
    padding-bottom: 0; /* Adjust padding if needed */
}


.main-data-card {
    height: 100%; /* Fill the flex column */
    display: flex;
    flex-direction: column;
}

/* Main data card body layout */
.main-data-card .el-card__body {
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Allow the body to grow */
    overflow: hidden; /* Hide overflow to manage internal scrolling */
}

/* Ensure table and pagination fit within the main card body */
.main-data-card .el-table {
    flex-shrink: 0; /* Prevent table from shrinking if height is set */
    margin-bottom: 15px; /* Space below table */
}

.main-data-card .pagination {
    flex-shrink: 0; /* Prevent pagination from shrinking */
    margin-top: auto; /* Push pagination to the bottom if body grows */
    margin-bottom: 15px;
}


/* Container for Analysis and Report cards (from Code 2 styles) */
.analysis-report-container {
    display: flex;
    flex-grow: 1; /* Allow this container to fill remaining space */
    gap: 20px; /* Space between analysis and report cards */
    margin-top: 20px; /* Space above this section */
    overflow: hidden; /* Hide overflow */
}

/* Individual Analysis and Report card styling (from Code 2 styles) */
.analysis-card,
.report-card {
    flex: 1; /* Make them take equal width */
    display: flex;
    flex-direction: column;
    height: 100%; /* Fill the flex container height */
}

/* Allow analysis/report card bodies to scroll */
.analysis-card .el-card__body,
.report-card .el-card__body {
    flex-grow: 1;
    overflow-y: auto;
    padding-top: 0; /* Adjust padding if needed */
}


/* Specific styles for data/report display (from Code 1/2) */
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
</style>