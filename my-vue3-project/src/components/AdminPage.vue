<template>
  <div class="admin-container">
    <el-card class="admin-card" shadow="always">
      <template #header>
        <div class="card-header">
          <h2>医生与患者关系管理</h2>
        </div>
      </template>

      <!-- 注册医生 -->
      <el-divider content-position="left">注册医生</el-divider>
      <el-form :inline="true" :model="registerForm" class="form">
        <el-form-item label="用户名">
          <el-input v-model="registerForm.username" placeholder="医生用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="registerForm.password" type="password" placeholder="医生密码" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="registerForm.name" placeholder="医生姓名" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="registerForm.phone" placeholder="医生电话" />
        </el-form-item>
        <el-form-item label="医院">
          <el-input v-model="registerForm.hospital" placeholder="所属医院" />
        </el-form-item>
        <el-form-item label="科室">
          <el-input v-model="registerForm.department" placeholder="所属科室" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="registerLoading" @click="registerDoctor">注册</el-button>
        </el-form-item>
      </el-form>

      <!-- 添加医生患者关系 -->
      <el-divider content-position="left">添加医生-患者关系</el-divider>
      <el-form :inline="true" :model="relationForm" class="form">
        <el-form-item label="医生">
          <el-select v-model="relationForm.doctorId" placeholder="选择医生" @change="handleDoctorChange">
            <el-option v-for="item in doctors" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <div v-if="relationForm.doctorName" style="margin-top: 5px; color: #67c23a;">已选择医生：{{ relationForm.doctorName }}</div>
        </el-form-item>
        <el-form-item label="患者">
          <el-select v-model="relationForm.patientId" placeholder="选择患者" @change="handlePatientChange">
            <el-option v-for="item in patients" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <div v-if="relationForm.patientName" style="margin-top: 5px; color: #67c23a;">已选择患者：{{ relationForm.patientName }}</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="addRelationLoading" @click="addRelation">添加</el-button>
        </el-form-item>
      </el-form>

      <!-- 医生患者关系列表 -->
      <el-divider content-position="left">医生-患者关系列表</el-divider>
      <el-table :data="relations" style="width: 100%" :loading="relationsLoading" key="relationsTable">
        <el-table-column prop="doctorName" label="医生">
          <template #default="scope">
            <el-select v-model="scope.row.doctorId" placeholder="选择医生">
              <el-option v-for="item in doctors" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="patientName" label="患者">
          <template #default="scope">
            <el-select v-model="scope.row.patientId" placeholder="选择患者">
              <el-option v-for="item in patients" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" :loading="updateLoading[scope.$index]" @click="updateRelation(scope.$index, scope.row)">保存</el-button>
            <el-button size="small" type="danger" :loading="deleteLoading[scope.$index]" @click="deleteRelation(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 已注册医生列表 -->
      <el-divider content-position="left" style="margin-top: 30px;">已注册医生账户</el-divider>
      <el-table :data="doctors" style="width: 100%" :loading="doctorsLoading" key="doctorsTable">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="hospital" label="医院" />
        <el-table-column prop="department" label="科室" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

const relations = ref([]);
const doctors = ref([]);
const patients = ref([]);
const relationForm = reactive({ doctorId: null, patientId: null, doctorName: '', patientName: '' });

const registerForm = reactive({
  username: "",
  password: "",
  name: "",
  phone: "",
  hospital: "",
  department: ""
});

const registerLoading = ref(false);
const addRelationLoading = ref(false);
const relationsLoading = ref(false);
const doctorsLoading = ref(false);
const updateLoading = ref({});
const deleteLoading = ref({});

// 注册医生
const registerDoctor = async () => {
  if (!registerForm.username || !registerForm.password || !registerForm.name || !registerForm.phone || !registerForm.hospital || !registerForm.department) {
    ElMessage.warning("所有字段均不能为空！");
    return;
  }
  registerLoading.value = true;
  try {
    const response = await axios.post('/api/admin/doctors', registerForm);
    if (response.data && response.data.status === 201) {
      ElMessage.success("医生注册成功！");
      await fetchDoctors();
      Object.assign(registerForm, { username: "", password: "", name: "", phone: "", hospital: "", department: "" });
    } else if (response.data && response.data.status === 409) {
      ElMessage.warning(response.data.message || "用户名已存在！");
    } else {
      ElMessage.error("医生注册失败！");
    }
  } catch (error) {
    console.error("医生注册失败:", error);
    ElMessage.error("医生注册失败，请检查网络或服务器！");
  } finally {
    registerLoading.value = false;
  }
};

// 添加医生患者关系
const addRelation = async () => {
  if (!relationForm.doctorId || !relationForm.patientId) {
    ElMessage.warning("请选择医生和患者！");
    return;
  }
  addRelationLoading.value = true;
  try {
    const response = await axios.post('/api/admin/relations', { doctorId: relationForm.doctorId, patientId: relationForm.patientId });
    if (response.data && response.data.status === 201) {
      ElMessage.success("关系添加成功！");
      await fetchRelations();
      Object.assign(relationForm, { doctorId: null, patientId: null, doctorName: '', patientName: '' });
    } else {
      ElMessage.error("添加关系失败！");
    }
  } catch (error) {
    console.error("添加关系失败:", error);
    ElMessage.error("添加关系失败，请检查网络或服务器！");
  } finally {
    addRelationLoading.value = false;
  }
};

// 更新关系
const updateRelation = async (index, row) => {
  if (!row.doctorId || !row.patientId) {
    ElMessage.warning("请选择医生和患者！");
    return;
  }
  updateLoading.value = { ...updateLoading.value, [index]: true };
  try {
    const response = await axios.put(`/api/admin/relations/${row.id}`, { doctorId: row.doctorId, patientId: row.patientId });
    if (response.data && response.data.status === 200) {
      const updatedDoctor = doctors.value.find(d => d.id === row.doctorId);
      const updatedPatient = patients.value.find(p => p.id === row.patientId);
      relations.value[index] = {
        ...relations.value[index],
        doctorName: updatedDoctor ? updatedDoctor.name : '未知医生',
        patientName: updatedPatient ? updatedPatient.name : '未知患者'
      };
      ElMessage.success("修改成功！");
    } else {
      ElMessage.error("修改失败！");
    }
  } catch (error) {
    console.error("修改关系失败:", error);
    ElMessage.error("修改失败，请检查网络或服务器！");
  } finally {
    updateLoading.value = { ...updateLoading.value, [index]: false };
  }
};

// 删除关系
const deleteRelation = async (index) => {
  const relationToDelete = relations.value[index];
  ElMessageBox.confirm(`确定要删除医生 "${relationToDelete.doctorName}" 和患者 "${relationToDelete.patientName}" 的关系吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    deleteLoading.value = { ...deleteLoading.value, [index]: true };
    try {
      const response = await axios.delete(`/api/admin/relations/${relationToDelete.id}`);
      if (response.data && response.data.status === 204) {
        relations.value.splice(index, 1);
        ElMessage.success("删除成功！");
      } else {
        ElMessage.error("删除失败！");
      }
    } catch (error) {
      console.error("删除关系失败:", error);
      ElMessage.error("删除失败，请检查网络或服务器！");
    } finally {
      deleteLoading.value = { ...deleteLoading.value, [index]: false };
    }
  }).catch(() => {});
};

// 辅助方法
const handleDoctorChange = (doctorId) => {
  const selectedDoctor = doctors.value.find(doctor => doctor.id === doctorId);
  relationForm.doctorName = selectedDoctor ? selectedDoctor.name : '';
};

const handlePatientChange = (patientId) => {
  const selectedPatient = patients.value.find(patient => patient.id === patientId);
  relationForm.patientName = selectedPatient ? selectedPatient.name : '';
};

const fetchRelations = async () => {
  relationsLoading.value = true;
  try {
    const response = await axios.get('/api/admin/relations');
    if (response.data && response.data.status === 200) {
      relations.value = response.data.data;
    } else {
      ElMessage.error("加载关系失败！");
    }
  } catch (error) {
    ElMessage.error("加载关系失败，请检查网络或服务器！");
  } finally {
    relationsLoading.value = false;
  }
};

const fetchDoctors = async () => {
  doctorsLoading.value = true;
  try {
    const response = await axios.get('/api/admin/doctors');
    if (response.data && response.data.status === 200) {
      doctors.value = response.data.data;
    } else {
      ElMessage.error("加载医生失败！");
    }
  } catch (error) {
    ElMessage.error("加载医生失败，请检查网络或服务器！");
  } finally {
    doctorsLoading.value = false;
  }
};

const fetchPatients = async () => {
  try {
    const response = await axios.get('/api/admin/patients');
    if (response.data && response.data.status === 200) {
      patients.value = response.data.data.map(patient => ({ id: patient.id, name: patient.name }));
    } else {
      ElMessage.error("加载患者失败！");
    }
  } catch (error) {
    ElMessage.error("加载患者失败，请检查网络或服务器！");
  }
};

onMounted(async () => {
  await Promise.all([fetchRelations(), fetchDoctors(), fetchPatients()]);
});
</script>

<style scoped>
.admin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f2f6fc;
}
.admin-card {
  width: 800px;
  max-width: 90%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form {
  margin-bottom: 20px;
}
.el-divider {
  margin: 20px 0;
}
</style>
