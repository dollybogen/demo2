import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
/*
// 导入 Mock
import Mock from 'mockjs'
// 导入 mock 配置
import './mock/mock.js';

// 设置拦截 Ajax 请求的响应时间
Mock.setup({
  timeout: '200-600'
});
*/
const app = createApp(App)

app.use(router)
app.use(ElementPlus);

app.mount('#app')