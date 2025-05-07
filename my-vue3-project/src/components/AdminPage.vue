<template>
  <div class="admin-container">
    <el-card class="admin-card" shadow="always">
      <template #header>
        <div class="card-header">
          <h2>Doctor patient relationship management</h2>
        </div>
      </template>

      <!-- Register Doctor -->
      <el-divider content-position="left">Register Doctor</el-divider>
      <el-form :inline="true" :model="registerForm" class="form">
        <el-form-item label="Password">
          <el-input v-model="registerForm.password" type="password" placeholder="Doctor password" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="registerForm.name" placeholder="Doctor name" />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="registerForm.phone" placeholder="Doctor phone" />
        </el-form-item>
        <el-form-item label="Hospital">
          <el-input v-model="registerForm.hospital" placeholder="Affiliated hospital" />
        </el-form-item>
        <el-form-item label="Department">
          <el-input v-model="registerForm.department" placeholder="Department" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="registerLoading" @click="registerDoctor">Register</el-button>
        </el-form-item>
      </el-form>

      <!-- Add Doctor-Patient Relationship -->
      <el-divider content-position="left">Add Doctor-Patient Relationship</el-divider>
      <el-form :inline="true" :model="relationForm" class="form">
        <el-form-item label="Doctor">
          <el-select v-model="relationForm.doctorId" placeholder="Select doctor" @change="handleDoctorChange">
            <el-option v-for="item in doctors" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <div v-if="relationForm.doctorName" style="margin-top: 5px; color: #67c23a;">Selected doctor: {{ relationForm.doctorName }}</div>
        </el-form-item>
        <el-form-item label="Patient">
          <el-select v-model="relationForm.patientId" placeholder="Select patient" @change="handlePatientChange">
            <el-option v-for="item in patients" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <div v-if="relationForm.patientName" style="margin-top: 5px; color: #67c23a;">Selected patient: {{ relationForm.patientName }}</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="addRelationLoading" @click="addRelation">Add</el-button>
        </el-form-item>
      </el-form>

      <!-- Doctor-Patient Relationship List -->
      <el-divider content-position="left">Doctor-Patient Relationship List</el-divider>
      <el-table :data="relations" style="width: 100%" :loading="relationsLoading" key="relationsTable">
        <el-table-column prop="doctorName" label="Doctor">
          <template #default="scope">
            <el-select v-model="scope.row.doctorId" placeholder="Select doctor">
              <el-option v-for="item in doctors" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="patientName" label="Patient">
          <template #default="scope">
            <el-select v-model="scope.row.patientId" placeholder="Select patient">
              <el-option v-for="item in patients" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" :loading="updateLoading[scope.$index]" @click="updateRelation(scope.$index, scope.row)">Save</el-button>
            <el-button size="small" type="danger" :loading="deleteLoading[scope.$index]" @click="deleteRelation(scope.$index)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Registered Doctors List -->
      <el-divider content-position="left" style="margin-top: 30px;">Registered Doctors</el-divider>
      <el-table :data="doctors" style="width: 100%" :loading="doctorsLoading" key="doctorsTable">
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="hospital" label="Hospital" />
        <el-table-column prop="department" label="Department" />
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
  name: "",
  password: "",
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

// Register doctor
const registerDoctor = async () => {
  if (!registerForm.password || !registerForm.name || !registerForm.phone || !registerForm.hospital || !registerForm.department) {
    ElMessage.warning("All fields are required!");
    return;
  }
  registerLoading.value = true;
  try {
    const response = await axios.post('/api/admin/doctors', registerForm);
    if (response.data && response.data.status === 201) {
      ElMessage.success("Doctor registered successfully!");
      await fetchDoctors();
      Object.assign(registerForm, { password: "", name: "", phone: "", hospital: "", department: "" });
    } else if (response.data && response.data.status === 409) {
      ElMessage.warning(response.data.message || "Username already exists!");
    } else {
      ElMessage.error("Failed to register doctor!");
    }
  } catch (error) {
    console.error("Failed to register doctor:", error);
    ElMessage.error("Failed to register doctor, please check network or server!");
  } finally {
    registerLoading.value = false;
  }
};

// Add doctor-patient relationship
const addRelation = async () => {
  if (!relationForm.doctorId || !relationForm.patientId) {
    ElMessage.warning("Please select both doctor and patient!");
    return;
  }
  addRelationLoading.value = true;
  try {
    const response = await axios.post('/api/admin/relations', { doctorId: relationForm.doctorId, patientId: relationForm.patientId });
    if (response.data && response.data.status === 201) {
      ElMessage.success("Relationship added successfully!");
      await fetchRelations();
      Object.assign(relationForm, { doctorId: null, patientId: null, doctorName: '', patientName: '' });
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

// Update relationship
const updateRelation = async (index, row) => {
  if (!row.doctorId || !row.patientId) {
    ElMessage.warning("Please select both doctor and patient!");
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
        doctorName: updatedDoctor ? updatedDoctor.name : 'Unknown doctor',
        patientName: updatedPatient ? updatedPatient.name : 'Unknown patient'
      };
      ElMessage.success("Updated successfully!");
    } else {
      ElMessage.error("Failed to update!");
    }
  } catch (error) {
    console.error("Failed to update relationship:", error);
    ElMessage.error("Failed to update, please check network or server!");
    } finally {
    updateLoading.value = { ...updateLoading.value, [index]: false };
  }
};

// Delete relationship
const deleteRelation = async (index) => {
  const relationToDelete = relations.value[index];
  ElMessageBox.confirm(`Are you sure to delete the relationship between doctor "${relationToDelete.doctorName}" and patient "${relationToDelete.patientName}"?`, 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(async () => {
    deleteLoading.value = { ...deleteLoading.value, [index]: true };
    try {
      const response = await axios.delete(`/api/admin/relations/${relationToDelete.id}`);
      if (response.data && response.data.status === 204) {
        relations.value.splice(index, 1);
        ElMessage.success("Deleted successfully!");
      } else {
        ElMessage.error("Failed to delete!");
      }
    } catch (error) {
      console.error("Failed to delete relationship:", error);
      ElMessage.error("Failed to delete, please check network or server!");
    } finally {
      deleteLoading.value = { ...deleteLoading.value, [index]: false };
    }
  }).catch(() => {});
};

// Helper methods
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
      ElMessage.error("Failed to load relationships!");
    }
  } catch (error) {
    ElMessage.error("Failed to load relationships, please check network or server!");
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
      ElMessage.error("Failed to load doctors!");
    }
  } catch (error) {
    ElMessage.error("Failed to load doctors, please check network or server!");
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
      ElMessage.error("Failed to load patients!");
    }
  } catch (error) {
    ElMessage.error("Failed to load patients, please check network or server!");
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