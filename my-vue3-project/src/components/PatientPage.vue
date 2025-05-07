<template>
  <div class="patient-management-page">
    <div class="header">
      <h2>Patient Gait Analysis Report</h2>
    </div>

    <div class="content">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="Search history (Date/Type/Summary)"
          clearable
          style="width: 300px;"
        />
      </div>

      <div class="report-list-container">
        <el-table :data="filteredRecords" border stripe style="width: 100%" @row-click="showReportDetails">
          <el-table-column prop="date" label="Date" sortable width="150" />
          <el-table-column prop="type" label="Report Type" sortable width="180" />
          <el-table-column prop="summary" label="Summary" min-width="200" />
        </el-table>
      </div>

      <div v-if="selectedReportData" class="report-details">
        <h3>{{ selectedReportData.date }} - {{ selectedReportData.type }} Gait Analysis Data</h3>
        <el-table :data="gaitDataTable" border stripe style="width: 100%">
          <el-table-column prop="name" label="Metric" width="180" />
          <el-table-column
            v-for="(col, index) in gaitColumns"
            :key="index"
            :prop="col"
            :label="col"
            width="120"
          />
        </el-table>
      </div>
      <div v-else class="no-report-selected">
        Please click on a report in the table to view detailed data.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();

// Data models
const searchQuery = ref('');
const patientId = ref(route.params.id);
const reports = ref([]);
const selectedReportData = ref(null);
const gaitColumns = ref(['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6']);
const gaitDataRows = ref([
  { name: 'Range of Motion', values: [] },
  { name: 'Score', values: [] },
]);

// Computed properties
const filteredRecords = computed(() => {
  return reports.value.filter((record) => {
    return (
      record.date.includes(searchQuery.value) ||
      record.type.includes(searchQuery.value) ||
      record.summary.includes(searchQuery.value)
    );
  });
});

// Table data formatting
const gaitDataTable = computed(() => {
  if (!selectedReportData.value) {
    return [];
  }
  const data = [];
  gaitDataRows.value.forEach((row) => {
    const rowData = { name: row.name };
    gaitColumns.value.forEach((col, index) => {
      rowData[col] = selectedReportData.value.data[row.name]?.[index] ?? '';
    });
    data.push(rowData);
  });
  return data;
});

// Methods
const showReportDetails = (row) => {
  selectedReportData.value = row;
};

const fetchPatientReports = async () => {
  try {
    const response = await axios.get(`/api/patient/${patientId.value}/reports`);
    reports.value = response.data;
    if (reports.value.length > 0) {
      selectedReportData.value = reports.value[0];
    }
  } catch (error) {
    console.error('Failed to fetch patient reports:', error);
  }
};

onMounted(() => {
  fetchPatientReports();
});
</script>

<style scoped>
.patient-management-page {
  padding: 20px;
  background-color: #f4f5f7;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  background-color: #007bff;
  color: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
}

.content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.report-list-container {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;
}

.report-details {
  margin-top: 20px;
  padding: 15px;
  background-color: #e9ecef;
  border-radius: 5px;
}

h3 {
  text-align: left;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
  font-weight: 400;
}

.no-report-selected {
  text-align: center;
  padding: 20px;
  color: #6c757d;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
}

/* Element Plus specific styles */
.el-input {
  --el-input-focus-border-color: #007bff;
}

.el-table th.el-table__cell {
  background-color: #f0f2f5 !important;
  color: #333;
  font-weight: 500;
}

.el-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>