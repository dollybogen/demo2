<template>
  <div class="patient-management-page">
    <div class="header">
      <el-button
        v-if="doctorId"
        type="text"
        @click="goBackToPatientManage"
        class="back-button"
      >
        <el-icon><ArrowLeft /></el-icon> <span>返回患者列表</span>
      </el-button>
      <h2>患者步态分析报告</h2>
    </div>

    <div class="content">
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索历史记录 (日期/类型/摘要)"
          clearable
          style="width: 300px;"
        />
      </div>

      <div class="report-list-container">
        <el-table :data="filteredRecords" border stripe style="width: 100%" @row-click="showReportDetails">
          <el-table-column prop="date" label="日期" sortable width="150" />
          <el-table-column prop="type" label="报告类型" sortable width="180" />
          <el-table-column prop="summary" label="摘要" min-width="200" />
        </el-table>
      </div>

      <div v-if="selectedReportData" class="report-details">
        <h3>{{ selectedReportData.date }} - {{ selectedReportData.type }} 步态分析数据</h3>
        <el-table :data="gaitDataTable" border stripe style="width: 100%">
          <el-table-column prop="name" label="指标" width="180" />
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
        请点击表格中的报告查看详细数据。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router'; // 导入 useRouter
import { ArrowLeft } from '@element-plus/icons-vue'; // 导入箭头图标组件
// 如果你需要在无法返回时给用户提示，可以导入 ElMessage
// import { ElMessage } from 'element-plus';


const route = useRoute();
const router = useRouter(); // 获取路由实例

// 数据模型
const searchQuery = ref('');
// 从路由参数中获取 patientId (id)
const patientId = ref(route.params.id);
// <-- 重点修改：从 route.query 中获取 doctorId
const doctorId = ref(route.query.doctorId || null);
const reports = ref([]);
const selectedReportData = ref(null);

// 假设的步态分析指标列名，根据你的实际数据来调整
const gaitColumns = ref(['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6']);
// 假设的步态分析数据行名
const gaitDataRows = ref([
  { name: '标准幅度' },
  { name: '运动幅度' },
  { name: '差值' },
]);


// 计算属性：根据搜索框内容过滤报告列表
const filteredRecords = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return reports.value.filter((record) => {
    // 确保 record 和其属性存在，避免因数据结构问题导致 includes 报错
    const dateMatch = record.date && record.date.toLowerCase().includes(query);
    const typeMatch = record.type && record.type.toLowerCase().includes(query);
    const summaryMatch = record.summary && record.summary.toLowerCase().includes(query);
    return dateMatch || typeMatch || summaryMatch;
  });
});


// 计算属性：格式化选中的报告详情数据为表格所需格式
const gaitDataTable = computed(() => {
  if (!selectedReportData.value || !selectedReportData.value.data) {
    return [];
  }

  const data = [];
  const reportDataValues = selectedReportData.value.data; // 获取报告数据对象

  gaitDataRows.value.forEach((rowInfo) => {
    const rowData = { name: rowInfo.name };
    const values = reportDataValues[rowInfo.name] || []; // 根据行名获取对应的数值数组

    gaitColumns.value.forEach((col, index) => {
      // 将数值数组中的值按顺序填充到对应的列
      rowData[col] = values[index] ?? ''; // 如果值不存在，显示为空字符串
    });
    data.push(rowData);
  });
  return data;
});


// 方法定义：点击报告列表行时显示报告详情
const showReportDetails = (row) => {
  selectedReportData.value = row;
};


// 方法定义：获取患者的历史报告列表
const fetchPatientReports = async () => {
  try {
    // 确保 patientId 存在再发起请求
    if (!patientId.value) {
        console.warn('Patient ID is missing, cannot fetch reports.');
        reports.value = [];
        selectedReportData.value = null;
        // 如果需要，给用户一个提示
        // ElMessage.error('无法获取患者信息，请从医生管理页面进入');
        return; // 中断执行
    }

    const response = await axios.get(`/api/patient/${patientId.value}/reports`);

    if (response.data && response.data.status === 200) {
         reports.value = response.data.data || []; // 如果 data 是 null/undefined，使用空数组

         // 默认选中第一条报告，如果存在的话
         if (reports.value.length > 0) {
             // 可以选择按日期排序，确保最新或最早的报告被选中
             // reports.value.sort((a, b) => new Date(b.date) - new Date(a.date)); // 按日期降序排序
             selectedReportData.value = reports.value[0];
         } else {
             selectedReportData.value = null; // 没有报告时，清空详情显示
         }
    } else {
         console.error('获取患者报告失败:', response.data?.message);
         reports.value = [];
         selectedReportData.value = null;
         // 可以根据需要显示错误消息
         // ElMessage.error(response.data?.message || '获取患者报告失败');
    }

  } catch (error) {
    console.error('获取患者报告失败:', error);
    reports.value = [];
    selectedReportData.value = null;
     // 统一处理 API 错误，例如未授权、找不到等
     // handleApiError(error); // 如果有统一的错误处理函数
  }
};


// 方法定义：返回患者管理页面
const goBackToPatientManage = () => {
    // 只有当 doctorId 存在时才执行跳转
    if (doctorId.value) {
        router.push({
            name: 'PatientManage', // 目标路由名称
            params: { doctorId: doctorId.value } // 使用从路由参数获取的 doctorId
        });
    } else {
        // 理论上如果按钮显示了，doctorId 就应该存在，
        // 但作为备用处理，如果 doctorId 不存在，可以导航到其他页面或给出提示
        console.warn("Doctor ID is missing, cannot navigate back to Patient Manage.");
        // ElMessage.warning("医生信息丢失，无法返回患者列表页面。");
        // router.push('/'); // 例如：回首页
    }
};


// 生命周期钩子：组件挂载后执行
onMounted(() => {
  fetchPatientReports(); // 调用获取报告的方法
});
</script>

<style scoped>
.patient-management-page {
  padding: 20px;
  background-color: #f4f5f7; /* Light grey background */
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  background-color: #007bff; /* Primary blue color */
  color: white;
  padding: 15px; /* Adjust padding */
  border-radius: 5px;
  margin-bottom: 20px;
  /* text-align: center; */ /* Remove default center alignment */
  display: flex; /* Use flexbox for layout */
  align-items: center; /* Vertically center items */
  justify-content: center; /* Center content horizontally */
  position: relative; /* Needed for absolute positioning of the back button */
}

/* Style for the back button */
.back-button {
    position: absolute; /* Position absolutely within the header */
    left: 15px; /* Distance from the left edge */
    top: 50%; /* Align vertically to the middle */
    transform: translateY(-50%); /* Adjust up by half of its height for perfect centering */

    padding: 0 8px; /* Add some padding */
    height: auto; /* Auto height based on content */
    font-size: 16px; /* Font size similar to header text */
    color: white; /* Ensure visibility on blue background */
    /* Optional: add hover/active styles */
}

/* Spacing between the icon and text within the back button */
.back-button .el-icon {
    margin-right: 5px;
     vertical-align: middle; /* Align icon nicely with text */
}
 .back-button span {
     vertical-align: middle; /* Align text nicely with icon */
 }


/* Adjust h2 margin and alignment */
.header h2 {
  margin: 0; /* Remove default margin */
  font-size: 24px;
  font-weight: 500;
  /* text-align: center; */ /* H2 content itself can be centered */
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
  background-color: #e9ecef; /* Light grey background for details */
  border-radius: 5px;
}

.report-details h3 { /* More specific selector for details header */
  text-align: left;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
  font-weight: 400;
}

.no-report-selected {
  text-align: center;
  padding: 20px;
  color: #6c757d; /* Muted grey color */
  background-color: #f8f9fa; /* Very light grey */
  border: 1px solid #dee2e6;
  border-radius: 5px;
}

/* Element Plus specific styles (optional, adjust as needed) */
.el-input {
  --el-input-focus-border-color: #007bff;
}

.el-table th.el-table__cell {
  background-color: #f0f2f5 !important; /* Light background for table headers */
  color: #333;
  font-weight: 500;
}

.el-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>