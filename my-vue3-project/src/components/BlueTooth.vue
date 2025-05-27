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
const isUploadingReport = ref(false); // Loading state for the 'Upload Complete Report' button
const showRawData = ref(false); // Toggle view in analysis card


// Watcher for report type (from Code 2)
watch(reportType, (newValue) => {
  if (newValue !== 'Custom') {
    customReportTypeName.value = '';
  }
});

// Computed properties (from Code 2)
const canUpload = computed(() => {
  return collectedDataSets.value.length >= 4;
});

const rawDataTable = computed(() => {
  // Display the latest 50 data points from the currently displayed data array for the analysis card sample
  return imuDataArray.value.data.slice(-50).reverse(); // Get last 50, then reverse for newest first
});

const analysisTable = computed(() => {
  if (!reportData.value || !reportData.value.reportData) return [];
   // Ensure these properties exist and are arrays before mapping
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


// Lifecycle hooks (from Code 1, modified for route params and cleanup)
onMounted(() => {
  // Get patientId and doctorId from route query
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
      text: 'Searching and connecting to Bluetooth devices...',
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
      name: device.name || `Device${devices.value.length + 1}`,
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
    console.error(`Attempt to process incomplete data packet (${bytes.length} bytes)`);
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
      console.error(`Read int16 error (offset ${offset}):`, e);
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
    ElMessage.warning("Please connect at least 1 device!");
    return;
  }
   if (isCollecting.value) { // Prevent starting if already collecting
     ElMessage.warning("Already collecting!");
     return;
   }

  isCollecting.value = true;
  rawImuData.value = []; // Clear raw data for the new session
  // imuDataArray.value.data will be updated by the throttled function during collection
  imuDataArray.value.data = []; // Clear displayed data initially
  imuDataArray.value.currentPage = 0; // Reset pagination

  ElMessage.success("Started data collection...");
}

// Stops the data collection process (from Code 1, modified to save dataset)
function stopDataCollection() {
  if (!isCollecting.value) {
    ElMessage.info("Not currently collecting data");
    return;
  }
  isCollecting.value = false; // Set collecting state to false

  // *** Added from Code 2: Save a snapshot of collected data and increment count ***
  if (rawImuData.value.length > 0) {
     collectedDataSets.value.push([...rawImuData.value]); // Store a copy of the current raw data
     collectionCount.value += 1; // Increment collection count
     ElMessage.success(`Collection ${collectionCount.value} completed, collected ${rawImuData.value.length} records`);
      if (collectionCount.value >= 2) {
        ElMessage.info(`Completed ${collectionCount.value} collections, data can be uploaded`);
      }
  } else {
      ElMessage.warning("Collection stopped, no data collected this time.");
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
      ElMessage.info("All devices disconnected");
      // If collection was ongoing and all devices are gone, stop it
      if (isCollecting.value) {
          stopDataCollection(); // This will save any partial data
      }
    } else {
       // Notify which specific device disconnected
       ElMessage.warning(`${device.name || 'Device'} disconnected`);
    }
  }
}

// Disconnects all connected devices (using logic from Code 2 for robustness)
async function stopAllDevices() {
    if (devices.value.length === 0) {
        ElMessage.info("No devices to disconnect");
        return;
    }

    // Stop data collection first
    if (isCollecting.value) {
        stopDataCollection();
    }

    const loading = ElLoading.service({ // Show loading indicator
        lock: true,
        text: 'Disconnecting all devices...',
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
            console.error('Disconnect device error:', error);
             // Log error but continue with other devices
        }
         // Return something to satisfy Promise.all
        return dev;
    });

    // Wait for all disconnection attempts to complete
    await Promise.all(disconnectPromises);

    // Final clear of the devices array to ensure UI is empty (handles edge cases)
    devices.value = [];

    ElMessage.info("All devices disconnected");
    loading.close();
}

// Exports collected data (currently in imuDataArray.data) to a CSV file (from Code 1)
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

    // 为每个采集的数据集创建一个CSV文件
    collectedDataSets.value.forEach((dataset, index) => {
      let csvString = "\uFEFF" + headers; // Add BOM for UTF-8
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

// Sends collected data sets (requires >= 2 sets) to the backend for analysis (from Code 2)
async function sendCsvToBackend() {
  // 检查是否有足够的数据集
  if (collectedDataSets.value.length < 4) {
    ElMessage.warning(`需要完成4次数据采集 (当前已完成 ${collectedDataSets.value.length} 次)`);
    return;
  }

  // 检查是否有patientId
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

    // 处理前4个数据集
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

    const response = await axios.post("/api/upload/csv", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data && response.data.status === 200) {
      reportId.value = response.data.data.reportId;
      reportData.value = response.data.data;
      ElMessage.success("数据上传成功，分析结果已更新");
      console.log("服务器响应:", response.data);
      // 清空已上传的数据集
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
    ElMessage.warning("Unable to determine doctor information, cannot return to patient list page.");
    // Fallback navigation if doctorId is missing
    // router.push('/');
  }
}
</script>

<style scoped>
/* 基础布局 */
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部样式 */
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

/* 主内容区域 */
.app-main {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
  height: calc(100vh - 60px); /* 减去头部高度 */
}

/* 行布局 */
.el-row {
  height: auto;
  margin-bottom: 20px;
}

/* 左侧设备列表 */
.device-list {
  height: auto;
  margin-bottom: 20px;
}

.device-list .el-card__body {
  max-height: 300px;
  overflow-y: auto;
}

/* 右侧主数据卡片 */
.main-data-card {
  display: flex;
  flex-direction: column;
}

.main-data-card .el-card__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 数据表格区域 */
.el-table {
  width: 100%;
  margin-bottom: 20px;
}

.el-table__body-wrapper {
  max-height: 300px;
}

/* 分析报告区域 */
.analysis-report-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

/* 分析卡片 */
.analysis-card {
  flex: 1;
  min-width: 45%;
  margin-bottom: 20px;
}

/* 报告卡片 */
.report-card {
  flex: 1;
  min-width: 45%;
  margin-bottom: 20px;
}

/* 分析表格容器 */
.analysis-table-container {
  width: 100%;
  overflow-x: auto;
}

/* 设备项样式 */
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

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .analysis-report-container {
    flex-direction: column;
  }
  
  .analysis-card,
  .report-card {
    min-width: 100%;
  }
}

/* 卡片头部样式 */
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

/* 按钮组样式 */
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

/* 确保内容不会被截断 */
.el-card__body {
  height: auto !important;
  overflow: visible !important;
}
</style>