import { createRouter, createWebHistory } from 'vue-router';

import 'element-plus/dist/index.css';
// 导入组件
import LoginPage from '../components/Login.vue';

import PatientManage from '../components/PatientManage.vue';
import PatientPage from '../components/PatientPage.vue'; // 确保这里是正确的文件名
import AdminPage from '../components/AdminPage.vue'; // 确保这里是正确的文件名

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
  },

  {
    path: '/doctor/:doctorId/patients', // 修改为动态路由，根据医生 ID 展示患者
    name: 'PatientManage',
    component: PatientManage,
  },
  {
    path: '/patient/:id', // 患者详情页面保持不变
    name: 'PatientPage',
    component: PatientPage,
    props: true,
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage,
  },
  {
    path: '/bluetooth',
    name: 'BlueTooth',
    component: () => import('@/components/BlueTooth.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;