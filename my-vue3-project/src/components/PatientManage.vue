<template>
  <div class="patient-manage">
    <el-container class="content-container">
      <el-header class="header">
        <h2>患者管理 </h2>

      </el-header>

      <el-main class="main-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-input
              v-model="searchQuery"
              placeholder="搜索患者姓名..."
              prefix-icon="Search"
              class="search-input"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20" class="patient-list">
          <el-col
            v-for="patient in filteredPatients"
            :key="patient.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <el-card class="patient-card">
              <div class="patient-header">
                <h3>{{ patient.name }}</h3>
                <div class="button-group">
                  <el-button
                    type="text"
                    @click="toggleDetails(patient.id)"
                  >
                    {{ expandedPatients.includes(patient.id) ? '收起' : '详情' }}
                  </el-button>
                  <el-button
                    type="text"
                    @click="measureDataAction(patient.id)"
                  >
                    测量数据
                  </el-button>
                </div>
              </div>

              <div v-if="expandedPatients.includes(patient.id)">
                <el-collapse v-model="activePanel">
                  <el-collapse-item name="measurement">
                    <template #title>
                      <span class="collapse-title">测量数据</span>
                    </template>
                    <el-button @click="showMeasurementData(patient.id)">查看3D数据</el-button>
                  </el-collapse-item>

                  <el-collapse-item name="history">
                    <template #title>
                      <span class="collapse-title">历史数据</span>
                    </template>
                    <el-button @click="showHistoryData(patient.id)">查看历史记录</el-button>
                  </el-collapse-item>
                </el-collapse>

                <div v-if="currentPatientId === patient.id">
                  <div v-if="show3DData">
                    <h4>3D测量数据</h4>
                    <el-image
                      style="width: 100%"
                      src="@/assets/3d-measurement.gif"
                      fit="contain"
                    />
                  </div>

                  <div v-if="historyData.length">
                    <h4>历史记录</h4>
                    <el-timeline>
                      <el-timeline-item
                        v-for="(record, index) in historyData"
                        :key="index"
                        :timestamp="record.date"
                        placement="top"
                      >
                        <el-card>
                          <h5>{{ record.type }} | {{ record.summary }}</h5>
                          <el-table
                            v-if="expandedReports.includes(index)"
                            :data="[record.data]"
                            border
                          >
                            <el-table-column
                              prop="运动幅度"
                              label="运动幅度"
                            />
                            <el-table-column
                              prop="得分"
                              label="得分"
                            />
                          </el-table>
                        </el-card>
                      </el-timeline-item>
                    </el-timeline>
                  </div>

                  <el-progress
                    v-if="progress > 0 && progress < 100"
                    :percentage="progress"
                    :text-inside="true"
                    :stroke-width="24"
                  />
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
//import Papa from 'papaparse';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

// 路由和数据初始化
const router = useRouter();
const route = useRoute();

// 获取 doctorId 路由参数
const doctorId = ref(route.params.doctorId);

// 响应式数据
const searchQuery = ref('');
const patients = ref([]);
const expandedPatients = ref([]);
const show3DData = ref(false);
const historyData = ref([]);
const currentPatientId = ref(null);
const progress = ref(0);
//const allReports = ref([]);
const expandedReports = ref([]);
const activePanel = ref([]);

// 计算属性
const filteredPatients = computed(() => {
  if (!Array.isArray(patients.value)) {
    console.error('patients.value 不是数组:', patients.value);
    return [];
  }
  return patients.value.filter(patient =>
    patient.name.includes(searchQuery.value)
  );
});

// 生命周期钩子
onMounted(() => {
  fetchPatients();
  //fetchCSVData();
  handleMeasureResult();
});

// 方法定义
async function fetchPatients() {
  try {
    // 使用 doctorId.value 从路由参数中获取医生 ID
    const res = await axios.get(`/api/doctors/${doctorId.value}/patients`);
    if (res.data.code === 200) {
      patients.value = Array.isArray(res.data.data) ? res.data.data : [];
    } else {
      ElMessage.error('获取患者列表失败');
    }
  } catch (err) {
    ElMessage.error('获取患者列表失败');
  }
}

function handleMeasureResult() {
  const { measureResult, patientId } = route.query;
  if (measureResult && patientId) {
    const result = JSON.parse(measureResult);
    const patient = patients.value.find(p => p.id === parseInt(patientId));
    if (patient) {
      patient.history = patient.history || [];
      patient.history.unshift({
        date: new Date().toLocaleDateString(),
        data: result,
      });
    }
  }
}

/*function goBack() {
  router.push({ name: 'user' });
}
*/

function toggleDetails(patientId) {
  const index = expandedPatients.value.indexOf(patientId);
  if (index > -1) {
    expandedPatients.value.splice(index, 1);
  } else {
    expandedPatients.value.push(patientId);
  }
  resetView();
}

function resetView() {
  show3DData.value = false;
  historyData.value = [];
  currentPatientId.value = null;
  activePanel.value = [];
}

function showMeasurementData(patientId) {
  currentPatientId.value = patientId;
  show3DData.value = true;
  historyData.value = [];
}

function showHistoryData(patientId) {
  router.push({
    name: 'PatientPage', // 跳转到 PatientPage
    params: { id: patientId }, // 通过动态路由参数传递患者 ID
  });
}

function measureDataAction(patientId) {
  router.push({
    name: 'BlueTooth',
    query: { patientId },
  });
}

/*async function fetchCSVData() {
  try {
    const res = await axios.get('/sentiment_data.csv');
    Papa.parse(res.data, {
      header: true,
      complete: (result) => {
        allReports.value = result.data.map(item => ({
          date: item.date,
          type: item.type,
          summary: item.summary,
          data: {
            '运动幅度': JSON.parse(item.运动幅度 || '[]'),
            '得分': JSON.parse(item.得分 || '[]'),
          },
        }));
      },
      error: () => {
        ElMessage.error('CSV解析失败');
      },
    });
  } catch (err) {
    ElMessage.error('CSV加载失败');
  }
}
*/
</script>

<style scoped>
.patient-manage {
  height: 100vh;
  background: linear-gradient(rgba(173, 216, 230, 0.8), rgba(135, 206, 235, 0.6));
}

.content-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.patient-list {
  margin-top: 20px;
}

.patient-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}
.patient-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.patient-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px;
}

.collapse-title {
  font-weight: bold;
  color: #409eff;
}

.search-input {
  margin-bottom: 20px;
}

.el-timeline {
  margin-top: 20px;
}

.el-timeline-item__timestamp {
  color: #909399;
}
</style>