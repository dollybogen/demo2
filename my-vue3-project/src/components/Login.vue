<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>{{ isRegistering ? 'User Registration' : 'User Login' }}</h2>
        </div>
      </template>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="100px">

        <template v-if="!isRegistering">
          <el-form-item label="Phone/Username" prop="username">
            <el-input v-model="loginForm.username" placeholder="Please enter phone/username" />
          </el-form-item>
        </template>

        <el-form-item label="Password" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="Please enter password" />
        </el-form-item>

        <template v-if="isRegistering">
          <el-form-item label="Full Name" prop="name">
            <el-input v-model="loginForm.name" placeholder="Please enter full name" />
          </el-form-item>

          <el-form-item label="Phone" prop="phone">
            <el-input v-model="loginForm.phone" placeholder="Please enter phone number" />
          </el-form-item>

          <el-form-item label="Gender" prop="gender">
            <el-radio-group v-model="loginForm.gender">
              <el-radio label="Male">Male</el-radio>
              <el-radio label="Female">Female</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Birthdate" prop="birthdate">
            <el-date-picker v-model="loginForm.birthdate" type="date" placeholder="Please select birthdate" style="width: 100%;" />
          </el-form-item>

          <el-form-item label="ID Type" prop="idType">
            <el-radio-group v-model="loginForm.idType">
              <el-radio label="ID Card">ID Card</el-radio>
              <el-radio label="Passport">Passport</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="ID Number" prop="idNumber">
            <el-input v-model="loginForm.idNumber" placeholder="Please enter ID number" />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">{{ isRegistering ? 'Register' : 'Login' }}</el-button>
          <el-button @click="toggleRegister">{{ isRegistering ? 'Go to Login' : 'Go to Register' }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const loginForm = reactive({
  username: '',
  password: '',
  name: '',
  phone: '',
  gender: '',
  birthdate: '',
  idType: '',
  idNumber: '',
});

const isRegistering = ref(false);

const loginRules = reactive({
  username: [
    { required: computed(() => !isRegistering.value), message: 'Please enter username', trigger: 'blur' }
  ],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
  name: [{ required: computed(() => isRegistering.value), message: 'Please enter full name', trigger: 'blur' }],
  phone: [{ required: computed(() => isRegistering.value), message: 'Please enter phone number', trigger: 'blur' }],
  gender: [{ required: computed(() => isRegistering.value), message: 'Please select gender', trigger: 'change' }],
  birthdate: [{ required: computed(() => isRegistering.value), message: 'Please select birthdate', trigger: 'change' }],
  idType: [{ required: computed(() => isRegistering.value), message: 'Please select ID type', trigger: 'change' }],
  idNumber: [{ required: computed(() => isRegistering.value), message: 'Please enter ID number', trigger: 'blur' }],
});

const loading = ref(false);
const loginFormRef = ref(null);
const router = useRouter();

const handleSubmit = async () => {
  if (loginFormRef.value) {
    loginFormRef.value.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        try {
          const apiEndpoint = isRegistering.value ? '/api/users' : '/api/session';
          const method = 'post';
          const payload = isRegistering.value
            ? {
                name: loginForm.name,
                phone: loginForm.phone,
                gender: loginForm.gender,
                birthdate: loginForm.birthdate,
                idType: loginForm.idType,
                idNumber: loginForm.idNumber,
                password: loginForm.password
              }
            : { username: loginForm.username, password: loginForm.password };

          const response = await axios({
            method,
            url: apiEndpoint,
            data: payload,
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.status === 200 || response.status === 201) {
            if (isRegistering.value) {
              ElMessage.success('Registration successful! Please login');
              toggleRegister();
            } else {
              const userData = response.data;
              ElMessage.success(`Login successful! Welcome, ${userData.data.name || userData.data.username}!`);
              if (userData.data.isAdmin) {
                router.push({ name: 'AdminPage' });
              } else if (userData.data.isDoctor) {
                router.push({ name: 'PatientManage', params: { doctorId: userData.data.id } });
              } else if (userData.data.isPatient) {
                router.push({ name: 'PatientPage', params: { id: userData.data.id } });
              } else {
                ElMessage.warning('Login successful, but unable to determine redirect page.');
              }
            }
          }
        } catch (error) {
          console.error(error);
          let errorMessage = 'Operation failed, please try again later';
          if (error.response) {
            if (error.response.status === 401) {
              errorMessage = isRegistering.value ? 'Invalid registration information' : 'Invalid username or password';
            } else if (error.response.status === 409 && isRegistering.value) {
              errorMessage = 'ID number already exists';
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            } else {
              errorMessage = `Server error (${error.response.status})`;
            }
          } else if (error.request) {
            errorMessage = 'Network error, please check your connection';
          }
          ElMessage.error(errorMessage);
        } finally {
          loading.value = false;
        }
      } else {
        ElMessage.error('Please complete all required information!');
      }
    });
  }
};

const toggleRegister = () => {
  isRegistering.value = !isRegistering.value;
  resetForm();
};

const resetForm = () => {
  if (loginFormRef.value) {
    loginFormRef.value.resetFields();
  }
  Object.assign(loginForm, {
    username: '',
    password: '',
    name: '',
    phone: '',
    gender: '',
    birthdate: '',
    idType: '',
    idNumber: '',
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f2f6fc;
}

.login-card {
  width: 400px;
  max-width: 90%;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
}

.el-form {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 10px;
}
</style>