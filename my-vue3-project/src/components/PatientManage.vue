<template>
  <div class="patient-manage">
    <el-container class="content-container">
      <el-header class="header">
        <h2>Patient Management</h2>
      </el-header>
      <el-divider content-position="left">Add Doctor-Patient Relationship</el-divider>
      <el-form :inline="true" :model="relationForm" class="form">
        <el-form-item label="Patient">
          <el-select v-model="relationForm.patientId" placeholder="Select patient" style="width: 200px;">
            <el-option v-for="item in patients" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <div v-if="relationForm.patientName" style="margin-top: 5px; color: #67c23a;">
            Selected patient: {{ relationForm.patientName }}
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="addRelationLoading" @click="addRelation">Add</el-button>
        </el-form-item>
      </el-form>

      <el-main class="main-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-input
              v-model="searchQuery"
              placeholder="Search patient name..."
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
                    {{ expandedPatients.includes(patient.id) ? 'Collapse' : 'Details' }}
                  </el-button>
                  <el-button
                    type="text"
                    @click="measureDataAction(patient.id)"
                  >
                    Measurement Data
                  </el-button>
                </div>
              </div>

              <div v-if="expandedPatients.includes(patient.id)">
                <el-collapse v-model="activePanel">
                  <el-collapse-item name="measurement">
                    <template #title>
                      <span class="collapse-title">Measurement Data</span>
                    </template>
                    <el-button @click="showMeasurementData(patient.id)">View 3D Data</el-button>
                  </el-collapse-item>

                  <el-collapse-item name="history">
                    <template #title>
                      <span class="collapse-title">History Data</span>
                    </template>
                    <el-button @click="showHistoryData(patient.id)">View History Records</el-button>
                  </el-collapse-item>
                </el-collapse>

                <div v-if="currentPatientId === patient.id">
                  <div v-if="show3DData">
                    <h4>3D Measurement Data</h4>
                    <el-image
                      style="width: 100%"
                      src="@/assets/3d-measurement.gif"
                      fit="contain"
                    />
                  </div>

                  <div v-if="historyData.length">
                    <h4>History Records</h4>
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
                              prop="Range of Motion"
                              label="Range of Motion"
                            />
                            <el-table-column
                              prop="Score"
                              label="Score"
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
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

// Router and data initialization
const router = useRouter();
const route = useRoute();

// Get doctorId from route params
const doctorId = ref(route.params.doctorId);

// Reactive data
const searchQuery = ref('');
const patients = ref([]);
const expandedPatients = ref([]);
const show3DData = ref(false);
const historyData = ref([]);
const currentPatientId = ref(null);
const progress = ref(0);
const expandedReports = ref([]);
const activePanel = ref([]);

// Computed properties
const filteredPatients = computed(() => {
  if (!Array.isArray(patients.value)) {
    console.error('patients.value is not an array:', patients.value);
    return [];
  }
  return patients.value.filter(patient =>
    patient.name.includes(searchQuery.value)
  );
});

const relationForm = ref({
  doctorId: doctorId.value,
  patientId: null,
  patientName: ''
});
const addRelationLoading = ref(false);

watch(() => relationForm.value.patientId, (newVal) => {
  const selected = patients.value.find(p => p.id === newVal);
  relationForm.value.patientName = selected ? selected.name : '';
});

const addRelation = async () => {
  if (!relationForm.value.doctorId || !relationForm.value.patientId) {
    ElMessage.warning("Please select a patient!");
    return;
  }
  addRelationLoading.value = true;
  try {
    const response = await axios.post('/api/admin/relations', {
      doctorId: relationForm.value.doctorId,
      patientId: relationForm.value.patientId
    });
    if (response.data && response.data.status === 201) {
      ElMessage.success("Relationship added successfully!");
      Object.assign(relationForm.value, {
        patientId: null,
        patientName: ''
      });
    } else {
      ElMessage.error("Failed to add relationship!");
    }
  } catch (error) {
    console.error("Failed to add relationship:", error);
    ElMessage.error("Failed to add relationship, please check network or server!");
  } finally {
    addRelationLoading.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchPatients();
  handleMeasureResult();
});

// Method definitions
async function fetchPatients() {
  try {
    const res = await axios.get(`/api/doctors/${doctorId.value}/patients`);
    if (res.data.code === 200) {
      patients.value = Array.isArray(res.data.data) ? res.data.data : [];
    } else {
      ElMessage.error('Failed to get patient list');
    }
  } catch (err) {
    ElMessage.error('Failed to get patient list');
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
    name: 'PatientPage',
    params: { id: patientId },
  });
}

function measureDataAction(patientId) {
  router.push({
    name: 'BlueTooth',
    query: { patientId },
  });
}
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