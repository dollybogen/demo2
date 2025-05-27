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
          <el-form-item label="Username" prop="username">
            <el-input v-model="loginForm.username" placeholder="Enter username" />
          </el-form-item>
        </template>

        <el-form-item label="Password" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="Enter password" />
        </el-form-item>

        <template v-if="isRegistering">
          <el-form-item label="Name" prop="name">
            <el-input v-model="loginForm.name" placeholder="Enter name" />
          </el-form-item>

          <el-form-item label="Phone" prop="phone">
            <el-input v-model="loginForm.phone" placeholder="Enter phone number" />
          </el-form-item>

          <el-form-item label="Gender" prop="gender">
            <el-radio-group v-model="loginForm.gender">
              <el-radio label="Male">男</el-radio>
              <el-radio label="Female">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Birth Date" prop="birthDate">
            <el-date-picker v-model="loginForm.birthDate" type="date" placeholder="Select birth date" style="width: 100%;" />
          </el-form-item>

          <el-form-item label="ID Type" prop="idType">
            <el-radio-group v-model="loginForm.idType">
              <el-radio label="ID Card">身份证</el-radio>
              <el-radio label="Passport">护照</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="ID Number" prop="idNumber">
            <el-input v-model="loginForm.idNumber" placeholder="Enter ID number" />
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
import axios from '../utils/axios';
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const loginForm = reactive({
  username: '',
  password: '',
  name: '',
  phone: '',
  gender: '',
  birthDate: '',
  idType: '',
  idNumber: '',
});

const isRegistering = ref(false);

const loginRules = reactive({
  username: [
    { required: computed(() => !isRegistering.value), message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  name: [
    { required: computed(() => isRegistering.value), message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: computed(() => isRegistering.value), message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  gender: [
    { required: computed(() => isRegistering.value), message: '请选择性别', trigger: 'change' }
  ],
  birthDate: [
    { required: computed(() => isRegistering.value), message: '请选择出生日期', trigger: 'change' }
  ],
  idType: [
    { required: computed(() => isRegistering.value), message: '请选择证件类型', trigger: 'change' }
  ],
  idNumber: [
    { required: computed(() => isRegistering.value), message: '请输入证件号码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!isRegistering.value) {
          callback();
          return;
        }
        const idType = loginForm.idType;
        if (idType === 'ID Card' && !/^\d{17}[\dX]$/.test(value)) {
          callback(new Error('请输入有效的身份证号'));
        } else if (idType === 'Passport' && !/^[A-Z]\d{8}$/.test(value)) {
          callback(new Error('请输入有效的护照号'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
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
                gender: loginForm.gender === 'Male' ? '男' : '女',
                birthDate: loginForm.birthDate ? new Date(loginForm.birthDate).toISOString().split('T')[0] : '',
                idType: loginForm.idType === 'ID Card' ? '身份证' : '护照',
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
              ElMessage.success('注册成功！请登录');
              toggleRegister();
            } else {
              const userData = response.data;
              if (userData.data.token) {
                localStorage.setItem('token', userData.data.token);
              }
              ElMessage.success(`登录成功！欢迎，${userData.data.name || userData.data.username}！`);
              if (userData.data.isAdmin) {
                router.push({ name: 'AdminPage' });
              } else if (userData.data.isDoctor) {
                router.push({ name: 'PatientManage', params: { doctorId: userData.data.id } });
              } else if (userData.data.isPatient) {
                router.push({ name: 'PatientPage', params: { id: userData.data.id } });
              } else {
                ElMessage.warning('登录成功，但无法确定重定向页面。');
              }
            }
          }
        } catch (error) {
          console.error(error);
          let errorMessage = '操作失败，请稍后重试';
          if (error.response) {
            if (error.response.status === 401) {
              errorMessage = isRegistering.value ? '注册信息无效' : '用户名或密码错误';
            } else if (error.response.status === 409 && isRegistering.value) {
              errorMessage = '身份证号已存在';
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            } else {
              errorMessage = `服务器错误 (${error.response.status})`;
            }
          } else if (error.request) {
            errorMessage = '网络错误，请检查网络连接';
          }
          ElMessage.error(errorMessage);
        } finally {
          loading.value = false;
        }
      } else {
        ElMessage.error('请填写所有必填信息！');
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
    birthDate: '',
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