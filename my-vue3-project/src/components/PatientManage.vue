<template>
  <div class="patient-manage">
    <el-container class="content-container">
      <el-header class="header">
        <h2>患者管理</h2>
        <div class="search-controls">
          <el-input
            v-model="searchParams.name"
            placeholder="患者姓名"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
          <el-input
            v-model="searchParams.phone"
            placeholder="手机号"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
          <el-select
            v-model="searchParams.gender"
            placeholder="性别"
            clearable
            @change="handleSearch"
          >
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
          <el-input
            v-model="searchParams.idNumber"
            placeholder="身份证号"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          />
        </div>
      </el-header>

      <el-main class="main-content">
        <el-row v-loading="isLoading" :gutter="20" class="patient-list">
           <template v-if="!isLoading">
              <template v-if="paginatedPatients.length > 0">
                 <el-col
                   v-for="patient in paginatedPatients"
                   :key="patient.id"
                   :span="12"
                 >
                   <el-card class="patient-card">
                     <div class="patient-header">
                       <h3>{{ patient.name }}</h3>
                       <div class="patient-meta">
                         <span>{{ patient.gender }} | {{ patient.phone }}</span>
                         <span v-if="patient.birthDate"> | {{ calculateAge(patient.birthDate) }}岁</span>
                       </div>
                       <div class="button-group">
                         <el-button
                           type="text"
                           @click="showHistoryData(patient.id)"
                         >
                           查看历史数据
                         </el-button>
                         <el-button
                           type="text"
                           @click="measureDataAction(patient.id)"
                         >
                           测量数据
                         </el-button>
                       </div>
                     </div>
                   </el-card>
                 </el-col>
               </template>

               <template v-else>
                 <el-col :span="24">
                   <div class="no-data">
                     <el-empty :description="emptyDescription" image-size="200">
                       <template v-if="hasSearchCondition">
                         <el-button type="primary" @click="resetSearch">
                           重置搜索条件
                         </el-button>
                         <p class="no-data-tip">或尝试调整搜索条件</p>
                       </template>
                       <template v-else>
                         <p class="no-data-tip">当前医生暂无关联患者</p>
                       </template>
                     </el-empty>
                   </div>
                 </el-col>
               </template>
           </template>
           <template v-if="isLoading">
              <el-col :span="24" class="loading-container">
                <el-skeleton :rows="6" animated />
              </el-col>
           </template>
        </el-row>


        <el-pagination
          v-if="totalPatients > 0 && !isLoading" :current-page="currentPage"
          :page-size="pageSize"
          :total="totalPatients"
          :page-sizes="[8, 16, 24, 32]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'; // Keep ElMessage here

const router = useRouter();
const route = useRoute();

// 使用路由参数中的doctorId
const doctorId = ref(route.params.doctorId);

// 响应式数据
const patients = ref([]);
const currentPage = ref(1);
const pageSize = ref(8);
const totalPatients = ref(0);
const isLoading = ref(false);

// 搜索参数
const searchParams = ref({
  name: '',
  phone: '',
  gender: '',
  idNumber: ''
});

// 计算属性
const paginatedPatients = computed(() => {
  // If fetching is handled by backend pagination, this local filtering is less critical,
  // but can serve as a fallback or for minor local adjustments if needed.
  // Based on fetchPatients, backend handles pagination and filtering, so this computed
  // property mainly provides the `patients.value` data to the v-for loop.
  // Let's keep the filtering logic here in case the backend doesn't do exact matching,
  // but be aware it's applied *after* fetching the current page's data.
  return patients.value.filter(patient => {
    const nameMatch = searchParams.value.name === '' ||
                     (patient.name && patient.name.includes(searchParams.value.name));
    const phoneMatch = searchParams.value.phone === '' ||
                      (patient.phone && patient.phone.includes(searchParams.value.phone));
    const genderMatch = searchParams.value.gender === '' ||
                       patient.gender === searchParams.value.gender;
    const idNumberMatch = searchParams.value.idNumber === '' ||
                         (patient.idNumber && patient.idNumber.includes(searchParams.value.idNumber));
    return nameMatch && phoneMatch && genderMatch && idNumberMatch;
  });
});

const hasSearchCondition = computed(() => {
  return Object.values(searchParams.value).some(val => val !== '');
});

const emptyDescription = computed(() => {
  return hasSearchCondition.value ? '未找到匹配患者' : '暂无患者数据';
});

// 生命周期钩子
onMounted(() => {
  // Ensure doctorId is available before fetching
  if (doctorId.value) {
    fetchPatients();
  } else {
    ElMessage.error('未获取到医生ID，无法加载患者列表');
    // Optionally redirect to a login or error page
    // router.push('/login');
  }
});

// 获取患者列表
async function fetchPatients() {
  // Prevent fetching if doctorId is missing
  if (!doctorId.value) return;

  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();

    // 添加分页参数
    params.append('page', currentPage.value);
    params.append('pageSize', pageSize.value);

    // 添加搜索参数（只添加非空值）
    if (searchParams.value.name) params.append('name', searchParams.value.name);
    if (searchParams.value.phone) params.append('phone', searchParams.value.phone);
    if (searchParams.value.gender) params.append('gender', searchParams.value.gender);
    if (searchParams.value.idNumber) params.append('idNumber', searchParams.value.idNumber);

    // Include doctorId in the request URL
    const res = await axios.get(`/api/doctors/${doctorId.value}/patients?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.data.status === 200) {
      // Assuming backend returns { status: 200, data: [...patients], total: N }
      patients.value = res.data.data || [];
      totalPatients.value = res.data.total || 0;

      // If current page is empty and it's not the first page, go back to the previous page
      // This is needed if deleting the last item on a page or filtering results in no data
      if (patients.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
        // Refetch after changing page
        await fetchPatients();
      }
    } else {
      // Handle backend errors with non-200 status
      ElMessage.error(res.data.message || '获取患者列表失败');
      patients.value = [];
      totalPatients.value = 0;
    }
  } catch (err) {
    // Handle network or other request errors
    handleApiError(err);
    patients.value = [];
    totalPatients.value = 0;
  } finally {
    isLoading.value = false;
  }
}

// 处理API错误
function handleApiError(err) {
  console.error("API Error:", err); // Log the full error for debugging
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    switch (err.response.status) {
      case 401:
        ElMessage.error('未授权访问，请重新登录');
        // router.push('/login'); // Redirect to login if 401
        break;
      case 403:
        ElMessage.error('权限不足，无法查看该资源');
        break;
      case 404:
         // This might happen if the doctorId is invalid or the endpoint changes
        ElMessage.error('未找到指定资源或医生');
        break;
      case 500:
         ElMessage.error('服务器内部错误，请稍后重试');
         break;
      default:
        ElMessage.error(`请求失败: ${err.response.status} - ${err.response.statusText}`);
    }
  } else if (err.request) {
    // The request was made but no response was received
    ElMessage.error('无法连接到服务器，请检查网络');
  } else {
    // Something happened in setting up the request that triggered an Error
    ElMessage.error('请求设置错误: ' + err.message);
  }
}


// 计算年龄
function calculateAge(birthDate) {
  if (!birthDate) return '未知';
  try {
     const birth = new Date(birthDate);
     if (isNaN(birth.getTime())) { // Check if date is valid
         return '无效日期';
     }
     const today = new Date();
     let age = today.getFullYear() - birth.getFullYear();
     const monthDiff = today.getMonth() - birth.getMonth();
     // Adjust age if the birth month/day hasn't occurred yet this year
     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
         age--;
     }
     return age < 0 ? 0 : age; // Age should not be negative
  } catch (e) {
     console.error("Error calculating age:", e);
     return '计算失败';
  }
}

// 搜索处理
function handleSearch() {
  currentPage.value = 1; // Reset to first page on search
  fetchPatients(); // Fetch data with current search params
}

// 重置搜索
function resetSearch() {
  searchParams.value = {
    name: '',
    phone: '',
    gender: '',
    idNumber: ''
  };
  currentPage.value = 1; // Reset to first page
  fetchPatients(); // Fetch data after resetting params
}

// 分页处理 - 改变当前页
function handlePageChange(page) {
  currentPage.value = page;
  fetchPatients(); // Fetch data for the new page
}

// 分页处理 - 改变每页条数
function handleSizeChange(size) {
  pageSize.value = size;
  currentPage.value = 1; // Reset to first page when page size changes
  fetchPatients(); // Fetch data with new page size
}

// 查看患者历史数据 - 跳转到患者详情页面
function showHistoryData(patientId) {
  router.push({
    name: 'PatientPage', // Make sure you have a route named 'PatientPage'
    params: { id: patientId }, // Pass patientId as a route parameter
    query: { doctorId: doctorId.value }, // Pass doctorId as a query parameter
  });
}

// 跳转到测量数据页面 (蓝牙采集页面)
function measureDataAction(patientId) {
  router.push({
    name: 'BlueTooth', // Make sure you have a route named 'BlueTooth'
    query: { patientId: patientId, doctorId: doctorId.value }, // Pass both IDs as query parameters
  });
}
</script>

<style scoped>
/* Overall page container */
.patient-manage {
  min-height: 100vh;
  background: linear-gradient(rgba(173, 216, 230, 0.8), rgba(135, 206, 235, 0.6));
  padding: 20px;
  display: flex; /* Added flex to center container vertically if needed */
  justify-content: center; /* Center container horizontally */
  align-items: flex-start; /* Align container to the top */
}

/* Main content container (el-container) */
.content-container {
  max-width: 1200px;
  width: 100%; /* Added to respect max-width */
  margin: 0 auto; /* Ensure horizontal centering */
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  /* --- FIX: Make el-container a flex column --- */
  display: flex;
  flex-direction: column;
  /* --- End FIX --- */
  height: 100%; /* Added: If you want the container to take full available height */
                 /* Adjust based on whether you want the background gradient to fill the screen */
                 /* or just wrap content */
}

/* Header (el-header) */
.header {
  padding: 20px;
  background-color: #409eff;
  color: white;
  /* --- FIX: Prevent header from shrinking and let it define its height --- */
  flex-shrink: 0;
  height: auto; /* Allow height to be determined by content */
  /* --- End FIX --- */
}

.header h2 {
  margin: 0;
  font-size: 24px;
}

.search-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.search-controls > * {
  flex: 1;
  min-width: 150px;
}

/* Main content area (el-main) */
.main-content {
  padding: 20px;
  /* --- FIX: Make main content grow and be scrollable --- */
  flex-grow: 1; /* Take all available space */
  overflow: auto; /* Add scrolling if content overflows */
  /* --- End FIX --- */
  display: flex; /* Added flex to layout patient list and pagination */
  flex-direction: column; /* Stack list and pagination vertically */
}

/* Patient list row */
.patient-list {
  margin-top: 0; /* Removed margin-top as main-content padding provides space */
  margin-left: -10px !important; /* Adjust gutter compensation */
  margin-right: -10px !important; /* Adjust gutter compensation */
  flex-grow: 1; /* Allow patient list area to grow */
  /* The loading skeleton and empty state are now inside this row,
     so they will also take up space */
}
.patient-list > .el-col {
    padding-left: 10px !important; /* Adjust gutter compensation */
    padding-right: 10px !important; /* Adjust gutter compensation */
}


.patient-card {
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.patient-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.patient-header {
  padding: 0; /* Removed padding as card body has padding */
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.patient-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.patient-meta {
  font-size: 14px;
  color: #666;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

/* Pagination styling */
.el-pagination {
  margin-top: 20px;
  justify-content: center;
  flex-shrink: 0; /* Prevent pagination from shrinking */
}

/* Empty state and Loading skeleton containers */
.no-data,
.loading-container {
  margin: 0; /* Removed vertical margins */
  padding: 20px; /* Adjusted padding */
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  /* Adjusted height/display to fit within the flex main-content */
  min-height: 200px; /* Reduced min-height */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1; /* Allow these to grow if needed */
}

.no-data .el-empty {
  padding: 0; /* Removed inner padding */
}

.no-data .el-empty__description {
  margin-top: 10px;
  font-size: 16px;
  color: #909399;
}

.no-data .el-button {
  margin-top: 20px;
}

.no-data-tip {
  margin-top: 15px;
  color: #909399;
  font-size: 14px;
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .search-controls > * {
    min-width: 100%;
    flex: none; /* Prevent flex-grow on small screens */
    width: 100%;
  }

  .patient-list .el-col {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
  }

  .patient-card {
    margin-bottom: 15px;
  }
}
</style>