// src/mock/mockServer.js
import Mock from 'mockjs';

// 模拟患者列表数据
Mock.mock('/api/patients', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: [
      {
        id: 1,
        name: '张三',
        age: 30,
        gender: '男',
        history: [],
      },
      {
        id: 2,
        name: '李四',
        age: 25,
        gender: '女',
        history: [],
      },
      {
        id: 3,
        name: '王五',
        age: 40,
        gender: '男',
        history: [],
      },
    ],
  };
});

// 模拟 CSV 数据
Mock.mock('/sentiment_data.csv', 'get', () => {
  return `
date,type,summary,运动幅度,得分
2023-01-01,步行,"步态分析", "[1,2,3,4,5]", "[85,90,78,88]"
2023-02-01,跑步,"跑步分析", "[2,3,4,5,6]", "[80,85,90,87]"
2023-03-01,站立,"站立平衡", "[3,4,5,6,7]", "[75,80,85,90]"
  `;
});