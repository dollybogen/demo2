import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './mock/mock.js';

// 在你的 main.js (或你的入口文件) 中

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const [url, options] = args;

  if (url === '/api/upload/csv' && options?.method === 'POST') {
    console.log('Fetch 拦截器命中!');
    // 模拟成功响应
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({
        code: 200,
        message: '模拟：CSV 文件上传成功 (Fetch Interceptor)',
        data: { receivedAt: new Date().toISOString() }
      }),
      text: async () => JSON.stringify({
        code: 200,
        message: '模拟：CSV 文件上传成功 (Fetch Interceptor)',
        data: { receivedAt: new Date().toISOString() }
      })
    });

    // 你可以根据 options.body 等信息返回不同的模拟响应
  }

  // 如果不是需要拦截的请求，调用原始的 fetch
  return originalFetch(...args);
};



const app = createApp(App)

app.use(router)
app.use(ElementPlus);

app.mount('#app')