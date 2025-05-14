<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>{{ isRegistering ? '用户注册' : '用户登录' }}</h2>
        </div>
      </template>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="100px">

        <template v-if="!isRegistering">
          <el-form-item label="手机号" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入手机号" />
          </el-form-item>
        </template>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>

        <template v-if="isRegistering">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="loginForm.name" placeholder="请输入姓名" />
          </el-form-item>

          <el-form-item label="电话" prop="phone">
            <el-input v-model="loginForm.phone" placeholder="请输入电话" />
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="loginForm.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="出生日期" prop="birthdate">
            <el-date-picker v-model="loginForm.birthdate" type="date" placeholder="请选择出生日期" style="width: 100%;" />
          </el-form-item>

          <el-form-item label="证件类型" prop="idType">
            <el-radio-group v-model="loginForm.idType">
              <el-radio label="身份证">身份证</el-radio>
              <el-radio label="护照">护照</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="证件号码" prop="idNumber">
            <el-input v-model="loginForm.idNumber" placeholder="请输入证件号码" />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">{{ isRegistering ? '注册' : '登录' }}</el-button>
          <el-button @click="toggleRegister">{{ isRegistering ? '跳转登录' : '跳转注册' }}</el-button>
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
    { required: computed(() => !isRegistering.value), message: '请输入用户名', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: computed(() => isRegistering.value), message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: computed(() => isRegistering.value), message: '请输入电话', trigger: 'blur' }],
  gender: [{ required: computed(() => isRegistering.value), message: '请选择性别', trigger: 'change' }],
  birthdate: [{ required: computed(() => isRegistering.value), message: '请选择出生日期', trigger: 'change' }],
  idType: [{ required: computed(() => isRegistering.value), message: '请选择证件类型', trigger: 'change' }],
  idNumber: [{ required: computed(() => isRegistering.value), message: '请输入证件号码', trigger: 'blur' }],
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
              ElMessage.success('注册成功！请登录');
              toggleRegister();
            } else {
              const userData = response.data;
              ElMessage.success(`登录成功！欢迎您，${userData.data.name || userData.data.username}！`);
              if (userData.data.isAdmin) {
                router.push({ name: 'AdminPage' });
              } else if (userData.data.isDoctor) {
                router.push({ name: 'PatientManage', params: { doctorId: userData.data.id } });
              } else if (userData.data.isPatient) {
                router.push({ name: 'PatientPage', params: { id: userData.data.id } });
              } else {
                ElMessage.warning('登录成功，但无法确定跳转页面。');
              }
            }
          }
        } catch (error) {
          console.error(error);
          let errorMessage = '操作失败，请稍后重试';
          if (error.response) {
            if (error.response.status === 401) {
              errorMessage = isRegistering.value ? '注册信息有误' : '用户名或密码错误';
            } else if (error.response.status === 409 && isRegistering.value) {
              errorMessage = '证件号已存在';
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            } else {
              errorMessage = `服务器错误 (${error.response.status})`;
            }
          } else if (error.request) {
            errorMessage = '网络错误，请检查连接';
          }
          ElMessage.error(errorMessage);
        } finally {
          loading.value = false;
        }
      } else {
        ElMessage.error('请填写完整的信息！');
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