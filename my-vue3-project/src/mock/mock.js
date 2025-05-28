// mock.js
import Mock from 'mockjs';

// Set global delay to simulate network requests
Mock.setup({
  timeout: '200-600' // Set request delay time in milliseconds
});

// --- Hardcoded mock data ---

// Mock user data (including names and all fields)
const initialUsers = [
  { id: '1', name: 'admin', password: 'password', isAdmin: true, isDoctor: false, isPatient: false },

  // 10 doctors data
  { id: '101', name: 'doctor1', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13810001011', hospital: 'Beijing Union Hospital', department: 'Internal Medicine' },
  { id: '102', name: 'doctor2', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13920002022', hospital: 'Shanghai Huashan Hospital', department: 'Surgery' },
  { id: '103', name: 'Zhao Qiang', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13030003033', hospital: 'Guangzhou Zhongshan Hospital', department: 'Pediatrics' },
  { id: '104', name: 'Qian Lili', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13140004044', hospital: 'Shenzhen People Hospital', department: 'Obstetrics' },
  { id: '105', name: 'Sun Haitao', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13250005055', hospital: 'Wuhan Tongji Hospital', department: 'Orthopedics' },
  { id: '106', name: 'Zhou Wenjing', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13360006066', hospital: 'Chengdu West China Hospital', department: 'Ophthalmology' },
  { id: '107', name: '吴宇飞', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13470007077', hospital: '杭州第一医院', department: '耳鼻喉科' },
  { id: '108', name: '郑秀丽', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13580008088', hospital: '南京鼓楼医院', department: '皮肤科' },
  { id: '109', name: '冯建国', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13690009099', hospital: '天津医科大学总医院', department: '心血管内科' },
  { id: '110', name: '陈丽萍', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13700000000', hospital: '重庆医科大学附属第一医院', department: '神经内科' },

  // 20 个患者数据
  { id: '1001', name: '张一', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15011111111', gender: '男', birthDate: '1995-03-10', idType: '身份证', idNumber: '110101199503101111' },
  { id: '1002', name: '李二', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15022222222', gender: '女', birthDate: '1988-07-25', idType: '身份证', idNumber: '110101198807252222' },
  { id: '1003', name: '王三', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15033333333', gender: '男', birthDate: '2001-11-05', idType: '身份证', idNumber: '110101200111053333' },
  { id: '1004', name: '赵四', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15044444444', gender: '女', birthDate: '1970-04-18', idType: '身份证', idNumber: '110101197004184444' },
  { id: '1005', name: '钱五', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '15055555555', gender: '男', birthDate: '1965-09-01', idType: '身份证', idNumber: '110101196509015555' },
  { id: '1006', name: '孙六', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15066666666', gender: '女', birthDate: '2005-12-30', idType: '身份证', idNumber: '110101200512306666' },
  { id: '1007', name: '周七', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15077777777', gender: '男', birthDate: '1998-02-14', idType: '身份证', idNumber: '110101199802147777' },
  { id: '1008', name: '吴八', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15088888888', gender: '女', birthDate: '1975-08-22', idType: '身份证', idNumber: '110101197508228888' },
  { id: '1009', name: '郑九', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15099999999', gender: '男', birthDate: '1980-01-09', idType: '身份证', idNumber: '110101198001099999' },
  { id: '1010', name: '冯十', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15100000000', gender: '女', birthDate: '1992-05-17', idType: '身份证', idNumber: '110101199205170000' },
  { id: '1011', name: '陈十一', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15111111111', gender: '男', birthDate: '1978-10-03', idType: '身份证', idNumber: '110101197810031111' },
  { id: '1012', name: '褚十二', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15122222222', gender: '女', birthDate: '2003-06-28', idType: '身份证', idNumber: '110101200306282222' },
  { id: '1013', name: '卫十三', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15133333333', gender: '男', birthDate: '1960-01-01', idType: '身份证', idNumber: '110101196001013333' },
  { id: '1014', name: '蒋十四', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15144444444', gender: '女', birthDate: '1982-04-04', idType: '身份证', idNumber: '110101198204044444' },
  { id: '1015', name: '沈十五', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15155555555', gender: '男', birthDate: '1990-10-10', idType: '身份证', idNumber: '110101199010105555' },
  { id: '1016', name: '韩十六', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15166666666', gender: '女', birthDate: '1973-07-07', idType: '身份证', idNumber: '110101197307076666' },
  { id: '1017', name: '杨十七', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15177777777', gender: '男', birthDate: '2000-02-29', idType: '身份证', idNumber: '110101200002297777' },
  { id: '1018', name: '朱十八', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15188888888', gender: '女', birthDate: '1968-11-11', idType: '身份证', idNumber: '110101196811118888' },
  { id: '1019', name: '秦十九', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15199999999', gender: '男', birthDate: '1993-09-03', idType: '身份证', idNumber: '110101199309039999' },
  { id: '1020', name: '尤二十', password: 'password', isAdmin: false, isDoctor: false, isPatient: true, phone: '15200000000', gender: '女', birthDate: '1981-05-20', idType: '身份证', idNumber: '110101198105200000' },
];

// 派生医生和患者数据
let doctors = initialUsers.filter(user => user.isDoctor);
let patientsData = initialUsers.filter(user => user.isPatient);


// 模拟医生-患者关系列表数据 (硬编码, 移除 id 字段)
let relations = [
  { doctorId: '101', patientId: '1001', doctorName: '王晓东', patientName: '张一' },
  { doctorId: '102', patientId: '1002', doctorName: '李美华', patientName: '李二' },
  { doctorId: '103', patientId: '1003', doctorName: '赵强', patientName: '王三' },
  { doctorId: '104', patientId: '1004', doctorName: '钱莉莉', patientName: '赵四' },
  { doctorId: '105', patientId: '1005', doctorName: '孙海涛', patientName: '钱五' },
  { doctorId: '106', patientId: '1006', doctorName: '周文静', patientName: '孙六' },
  { doctorId: '107', patientId: '1007', doctorName: '吴宇飞', patientName: '周七' },
  { doctorId: '108', patientId: '1008', doctorName: '郑秀丽', patientName: '吴八' },
  { doctorId: '109', patientId: '1009', doctorName: '冯建国', patientName: '郑九' },
  { doctorId: '110', patientId: '1010', doctorName: '陈丽萍', patientName: '冯十' },
  // 增加更多关系，确保数量足够用于分页测试
  { doctorId: '101', patientId: '1002', doctorName: '王晓东', patientName: '李二' },
  { doctorId: '101', patientId: '1003', doctorName: '王晓东', patientName: '王三' },
  { doctorId: '102', patientId: '1001', doctorName: '李美华', patientName: '张一' },
  { doctorId: '103', patientId: '1001', doctorName: '赵强', patientName: '张一' },
  { doctorId: '104', patientId: '1005', doctorName: '钱莉莉', patientName: '钱五' },
  // ... 继续添加更多关系直到达到或超过分页数量 (每页20条，至少需要21条才能有第二页)
  { doctorId: '105', patientId: '1007', doctorName: '孙海涛', patientName: '周七' },
  { doctorId: '106', patientId: '1008', doctorName: '周文静', patientName: '吴八' },
  { doctorId: '107', patientId: '1009', doctorName: '吴宇飞', patientName: '郑九' },
  { doctorId: '108', patientId: '1010', doctorName: '郑秀丽', patientName: '冯十' },
  { doctorId: '109', patientId: '1011', doctorName: '冯建国', patientName: '陈十一' },
  { doctorId: '110', patientId: '1012', doctorName: '陈丽萍', patientName: '褚十二' },
  { doctorId: '101', patientId: '1013', doctorName: '王晓东', patientName: '卫十三' },
  { doctorId: '102', patientId: '1014', doctorName: '李美华', patientName: '蒋十四' },
  { doctorId: '103', patientId: '1015', doctorName: '赵强', patientName: '沈十五' },
  { doctorId: '104', patientId: '1016', doctorName: '钱莉莉', patientName: '韩十六' },
  { doctorId: '105', patientId: '1017', doctorName: '孙海涛', patientName: '杨十七' },
  { doctorId: '106', patientId: '1018', doctorName: '周文静', patientName: '朱十八' },
  { doctorId: '107', patientId: '1019', doctorName: '吴宇飞', patientName: '秦十九' },
  { doctorId: '108', patientId: '1020', doctorName: '郑秀丽', patientName: '尤二十' },
   // 再补充更多关系，简单组合
   { doctorId: '101', patientId: '1004', doctorName: '王晓东', patientName: '赵四' },
   { doctorId: '102', patientId: '1005', doctorName: '李美华', patientName: '钱五' },
   { doctorId: '103', patientId: '1006', doctorName: '赵强', patientName: '孙六' },
   { doctorId: '104', patientId: '1007', doctorName: '钱莉莉', patientName: '周七' },
   { doctorId: '105', patientId: '1008', doctorName: '孙海涛', patientName: '吴八' },
   { doctorId: '106', patientId: '1009', doctorName: '周文静', patientName: '郑九' },
   { doctorId: '107', patientId: '1010', doctorName: '吴宇飞', patientName: '冯十' },
   { doctorId: '108', patientId: '1011', doctorName: '郑秀丽', patientName: '陈十一' },
   { doctorId: '109', patientId: '1012', doctorName: '冯建国', patientName: '褚十二' },
   { doctorId: '110', patientId: '1013', doctorName: '陈丽萍', patientName: '卫十三' },
   { doctorId: '101', patientId: '1014', doctorName: '王晓东', patientName: '蒋十四' },
   { doctorId: '102', patientId: '1015', doctorName: '李美华', patientName: '沈十五' },
   { doctorId: '103', patientId: '1016', doctorName: '赵强', patientName: '韩十六' },
   { doctorId: '104', patientId: '1017', doctorName: '钱莉莉', patientName: '杨十七' },
   { doctorId: '105', patientId: '1018', doctorName: '孙海涛', patientName: '朱十八' },
   { doctorId: '106', patientId: '1019', doctorName: '周文静', patientName: '秦十九' },
   { doctorId: '107', patientId: '1020', doctorName: '吴宇飞', patientName: '尤二十' },
    // 补充更多关系，简单组合
   { doctorId: '101', patientId: '1005', doctorName: '王晓东', patientName: '钱五' },
   { doctorId: '101', patientId: '1006', doctorName: '王晓东', patientName: '孙六' },
   { doctorId: '101', patientId: '1007', doctorName: '王晓东', patientName: '周七' },
   { doctorId: '102', patientId: '1003', doctorName: '李美华', patientName: '王三' },
   { doctorId: '102', patientId: '1004', doctorName: '李美华', patientName: '赵四' },
   { doctorId: '103', patientId: '1005', doctorName: '赵强', patientName: '钱五' },
   { doctorId: '103', patientId: '1007', doctorName: '赵强', patientName: '周七' },
   { doctorId: '104', patientId: '1001', doctorName: '钱莉莉', patientName: '张一' },
   { doctorId: '104', patientId: '1008', doctorName: '钱莉莉', patientName: '吴八' },
    // ... 继续组合，直到达到或超过100条
    // 例如，每位医生随机关联几位患者，并确保总数
    // 手动补充到 100条+
    { doctorId: '105', patientId: '1001', doctorName: '孙海涛', patientName: '张一' },
    { doctorId: '105', patientId: '1002', doctorName: '孙海涛', patientName: '李二' },
    { doctorId: '106', patientId: '1003', doctorName: '周文静', patientName: '王三' },
    { doctorId: '106', patientId: '1004', doctorName: '周文静', patientName: '赵四' },
    { doctorId: '107', patientId: '1005', doctorName: '吴宇飞', patientName: '钱五' },
    { doctorId: '107', patientId: '1006', doctorName: '吴宇飞', patientName: '孙六' },
    { doctorId: '108', patientId: '1007', doctorName: '郑秀丽', patientName: '周七' },
    { doctorId: '108', patientId: '1008', doctorName: '郑秀丽', patientName: '吴八' },
    { doctorId: '109', patientId: '1009', doctorName: '冯建国', patientName: '郑九' },
    { doctorId: '109', patientId: '1010', doctorName: '冯建国', patientName: '冯十' },
    { doctorId: '110', patientId: '1011', doctorName: '陈丽萍', patientName: '陈十一' },
    { doctorId: '110', patientId: '1012', doctorName: '陈丽萍', patientName: '褚十二' },
    { doctorId: '101', patientId: '1015', doctorName: '王晓东', patientName: '沈十五' },
    { doctorId: '102', patientId: '1016', doctorName: '李美华', patientName: '韩十六' },
    { doctorId: '103', patientId: '1017', doctorName: '赵强', patientName: '杨十七' },
    { doctorId: '104', patientId: '1018', doctorName: '钱莉莉', patientName: '朱十八' },
    { doctorId: '105', patientId: '1019', doctorName: '孙海涛', patientName: '秦十九' },
    { doctorId: '106', patientId: '1020', doctorName: '周文静', patientName: '尤二十' },
     // 再加一些，确保超过100
    { doctorId: '107', patientId: '1001', doctorName: '吴宇飞', patientName: '张一' },
    { doctorId: '107', patientId: '1002', doctorName: '吴宇飞', patientName: '李二' },
    { doctorId: '108', patientId: '1003', doctorName: '郑秀丽', patientName: '王三' },
    { doctorId: '108', patientId: '1004', doctorName: '郑秀丽', patientName: '赵四' },
    { doctorId: '109', patientId: '1005', doctorName: '冯建国', patientName: '钱五' },
    { doctorId: '109', patientId: '1006', doctorName: '冯建国', patientName: '孙六' },
    { doctorId: '110', patientId: '1007', doctorName: '陈丽萍', patientName: '周七' },
    { doctorId: '110', patientId: '1008', doctorName: '陈丽萍', patientName: '吴八' },
    { doctorId: '101', patientId: '1009', doctorName: '王晓东', patientName: '郑九' },
    { doctorId: '102', patientId: '1010', doctorName: '李美华', patientName: '冯十' },
    { doctorId: '103', patientId: '1011', doctorName: '赵强', patientName: '陈十一' },
    { doctorId: '104', patientId: '1012', doctorName: '钱莉莉', patientName: '褚十二' },
    { doctorId: '105', patientId: '1013', doctorName: '孙海涛', patientName: '卫十三' },
    { doctorId: '106', patientId: '1014', doctorName: '周文静', patientName: '蒋十四' },
    { doctorId: '107', patientId: '1015', doctorName: '吴宇飞', patientName: '沈十五' },
    { doctorId: '108', patientId: '1016', doctorName: '郑秀丽', patientName: '韩十六' },
    { doctorId: '109', patientId: '1017', doctorName: '冯建国', patientName: '杨十七' },
    { doctorId: '110', patientId: '1018', doctorName: '陈丽萍', patientName: '朱十八' },
    { doctorId: '101', patientId: '1019', doctorName: '秦十九', patientName: '秦十九' },
    { doctorId: '102', patientId: '1020', doctorName: '李美华', patientName: '尤二十' },
     // 再加一些，确保数量超过100
     { doctorId: '103', patientId: '1001', doctorName: '赵强', patientName: '张一' },
     { doctorId: '104', patientId: '1002', doctorName: '钱莉莉', patientName: '李二' },
     { doctorId: '105', patientId: '1003', doctorName: '孙海涛', patientName: '王三' },
     { doctorId: '106', patientId: '1004', doctorName: '周文静', patientName: '赵四' },
     { doctorId: '107', patientId: '1005', doctorName: '吴宇飞', patientName: '钱五' },
     { doctorId: '108', patientId: '1006', doctorName: '郑秀丽', patientName: '孙六' },
     { doctorId: '109', patientId: '1007', doctorName: '冯建国', patientName: '周七' },
     { doctorId: '110', patientId: '1008', doctorName: '陈丽萍', patientName: '吴八' },
     { doctorId: '101', patientId: '1010', doctorName: '王晓东', patientName: '冯十' },
];


// 患者报告对象 (硬编码)
const patientReports = {
  '1001': [ // 张一的报告
    { date: '2025-05-10', type: '最新评估', summary: '张一患者最新评估报告，步态稳定。', data: { '标准幅度': [10,9,10,10,9,10,10,9,10,10,9,10], '运动幅度': [9,8,9,9,8,9,9,8,9,9,8,9], '差值': [1,1,1,1,1,1,1,1,1,1,1,1] } },
    { date: '2025-05-01', type: '中期复查', summary: '张一患者中期复查，左腿活动度有所改善。', data: { '标准幅度': [10,9,1,2,3,4,5,6,7,8,9,10], '운동幅度': [9,8,9,9,8,9,9,8,9,9,8,9], '차值': [1,1,8,7,6,5,4,3,2,1,0,1] } },
     // 增加更多报告，至少 100 个报告分布在 20 个患者中
     // 平均每个患者需要 5 个报告
     { date: '2025-04-20', type: '初步评估', summary: '张一患者初步评估，活动受限。', data: { '표준幅度': [10,9,1,2,3,4,5,6,7,8,9,10], '運動幅度': [5,4,3,4,5,6,7,8,9,10,11,12], '차値': [5,5,8,6,6,6,6,5,4,2,2,2] } },
     { date: '2025-04-10', type: '康复计划', summary: '张一患者康复计划制定。', data: {} }, // 计划类报告可以没有具体数据
     { date: '2025-03-25', type: '门诊记录', summary: '张一患者初次门诊记录。', data: {} },
  ],
  '1002': [ // 李二的报告
     { date: '2025-05-12', type: '最新评估', summary: '李二患者最新步态评估，平衡感改善。', data: { '標準幅度': [12,11,12,12,11,12,12,11,12,12,11,12], '운동幅度': [11,10,11,11,10,11,11,10,11,11,10,11], '차值': [1,1,1,1,1,1,1,1,1,1,1,1] } },
     { date: '2025-05-05', type: '检查结果', summary: '李二患者血液检查结果。', data: {} },
     { date: '2025-04-28', type: '初步评估', summary: '李二患者初步评估，平衡感较差。', data: { '標準幅度': [12,11,12,12,11,12,12,11,12,12,11,12], '운동幅度': [8,7,8,8,7,8,8,7,8,8,7,8], '차値': [4,4,4,4,4,4,4,4,4,4,4,4] } },
     { date: '2025-04-15', type: '康复计划', summary: '李二患者康复计划制定。', data: {} },
     { date: '2025-04-01', type: '门诊记录', summary: '李二患者初次门诊记录。', data: {} },
  ],
   // 为剩余 18 位患者每人至少添加 5 个报告，确保总数达到 100 个以上
   // 示例如下，你需要补充完整其余患者的报告数据
   '1003': [
      { date: '2025-05-11', type: '最新评估', summary: '王三患者最新评估报告。', data: { '标准幅度': [10,10,10,10,10,10,10,10,10,10,10,10], '运动幅度': [9,9,9,9,9,9,9,9,9,9,9,9], '差值': [1,1,1,1,1,1,1,1,1,1,1,1] } },
      { date: '2025-05-02', type: '门诊记录', summary: '王三患者复诊。', data: {} },
      { date: '2025-04-25', type: '初步评估', summary: '王三患者初步评估报告。', data: { '标准幅度': [10,10,10,10,10,10,10,10,10,10,10,10], '运动幅度': [7,7,7,7,7,7,7,7,7,7,7,7], '差值': [3,3,3,3,3,3,3,3,3,3,3,3] } },
      { date: '2025-04-10', type: '康复计划', summary: '王三患者康复计划。', data: {} },
      { date: '2025-03-30', type: '检查结果', summary: '王三患者X光结果。', data: {} },
   ],
    '1004': [ { date: '2025-05-10', type: '评估', summary: '赵四评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '赵四门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '赵四评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '赵四计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '赵四记录。', data: {} }, ],
    '1005': [ { date: '2025-05-10', type: '评估', summary: '钱五评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '钱五门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '钱五评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '钱五计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '钱五记录。', data: {} }, ],
    '1006': [ { date: '2025-05-10', type: '评估', summary: '孙六评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '孙六门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '孙六评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '孙六计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '孙六记录。', data: {} }, ],
    '1007': [ { date: '2025-05-10', type: '评估', summary: '周七评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '周七门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '周七评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '周七计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '周七记录。', data: {} }, ],
    '1008': [ { date: '2025-05-10', type: '评估', summary: '吴八评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '吴八门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '吴八评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '吴八计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '吴八记录。', data: {} }, ],
    '1009': [ { date: '2025-05-10', type: '评估', summary: '郑九评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '郑九门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '郑九评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '郑九计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '郑九记录。', data: {} }, ],
    '1010': [ { date: '2025-05-10', type: '评估', summary: '冯十评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '冯十门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '冯十评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '冯十计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '冯十记录。', data: {} }, ],
    '1011': [ { date: '2025-05-10', type: '评估', summary: '陈十一评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '陈十一门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '陈十一评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '陈十一计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '陈十一记录。', data: {} }, ],
    '1012': [ { date: '2025-05-10', type: '评估', summary: '褚十二评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '褚十二门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '褚十二评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '褚十二计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '褚十二记录。', data: {} }, ],
    '1013': [ { date: '2025-05-10', type: '评估', summary: '卫十三评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '卫十三门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '卫十三评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '卫十三计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '卫十三记录。', data: {} }, ],
    '1014': [ { date: '2025-05-10', type: '评估', summary: '蒋十四评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '蒋十四门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '蒋十四评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '蒋十四计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '蒋十四记录。', data: {} }, ],
    '1015': [ { date: '2025-05-10', type: '评估', summary: '沈十五评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '沈十五门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '沈十五评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '沈十五计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '沈十五记录。', data: {} }, ],
    '1016': [ { date: '2025-05-10', type: '评估', summary: '韩十六评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '韩十六门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '韩十六评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '韩十六计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '韩十六记录。', data: {} }, ],
    '1017': [ { date: '2025-05-10', type: '评估', summary: '杨十七评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '杨十七门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '杨十七评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '杨十七计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '杨十七记录。', data: {} }, ],
    '1018': [ { date: '2025-05-10', type: '评估', summary: '朱十八评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '朱十八门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '朱十八评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '朱十八计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '朱十八记录。', data: {} }, ],
    '1019': [ { date: '2025-05-10', type: '评估', summary: '秦十九评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '秦十九门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '秦十九评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '秦十九计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '秦十九记录。', data: {} }, ],
    '1020': [ { date: '2025-05-10', type: '评估', summary: '尤二十评估。', data: {} },{ date: '2025-05-01', type: '门诊', summary: '尤二十门诊。', data: {} },{ date: '2025-04-20', type: '评估', summary: '尤二十评估。', data: {} },{ date: '2025-04-10', type: '计划', summary: '尤二十计划。', data: {} },{ date: '2025-03-25', type: '记录', summary: '尤二十记录。', data: {} }, ],
};


// --- Helper functions ---

// Find doctor by ID (this function is still used in the interface, so it's kept)
const findDoctorById = (id) => doctors.find(doctor => doctor.id === String(id));
// Find patient by ID (this function is still used in the interface, so it's kept)
const findPatientById = (id) => patientsData.find(patient => patient.id === String(id));


// ✅ Modified: Simulate permission check function, always pass, no parameters needed
const checkAdminOrRelatedDoctor = () => {
    // In the absence of actual authentication check, simulate a user with full permissions
    // Note: This is only for development and demonstration purposes, real backend should not do this!
    return {
        status: 200,
        user: { // Return a simulated user with admin and doctor flags
            id: 'mock_user_id', // A virtual ID
            name: 'Mock User',
            isAdmin: true,
            isDoctor: true,
            isPatient: true // Simulate user having all permissions
        }
    };
};


// --- Simulated API ---

// Simulated login API /api/session (POST) - This interface does not require authentication, kept as is
Mock.mock('/api/session', 'post', (req) => {
    const { username, password } = JSON.parse(req.body);
    const user = initialUsers.find(u => (u.name === username || u.phone === username) && u.password === password);

    if (user) {
      return {
        status: 200,
        data: {
          id: user.id, // Return user ID when login is successful
          name: user.name,
          isAdmin: user.isAdmin,
          isDoctor: user.isDoctor,
          isPatient: user.isPatient,
        },
        message: '登录成功',
      };
    } else {
      return {
        status: 401,
        message: '用户名或密码错误',
      };
    }
});

// Simulated registration API /api/users (POST) - Mainly used for patient registration, this interface does not require authentication, kept as is
Mock.mock('/api/users', 'post', (options) => {
    const body = JSON.parse(options.body);
    const { name, phone, gender, birthDate, idType, idNumber, password } = body;

    // Check for name, phone number, or ID number conflict during registration
    const existingUser = initialUsers.find(u =>
        u.name === name ||
        (phone && u.phone === phone) ||
        (idNumber && u.idNumber === idNumber)
    );

    if (existingUser) {
        return {
            status: 409, // Conflict
            message: '姓名、手机号或身份证号已存在',
        };
    } else {
        const newUser = {
            id: Mock.mock('@increment').toString(), // Use Mock.mock('@increment') to generate a number, then convert to string ID
            name, password,
            phone: phone || null, // Allow null
            gender: gender || null, // Allow null
            birthDate: birthDate || null, // Allow null
            idType: idType || null, // Allow null
            idNumber: idNumber || null, // Allow null
            isAdmin: false,
            isDoctor: false,
            isPatient: true, // Default patient
        };
        initialUsers.push(newUser);
        // After registering a new user, update the derived patient list and doctor list
        patientsData = initialUsers.filter(user => user.isPatient);
        doctors = initialUsers.filter(user => user.isDoctor);


        return {
            status: 201,
            data: {
                id: newUser.id, name: newUser.name,
            },
            message: '注册成功',
        };
    }
});


Mock.mock(/\/api\/doctors\/(\d+)\/patients(\?.*)?$/, 'get', (options) => {
    // 1. Permission check
    const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
        return authResult;
    }

    // 2. Parse URL parameters (corrected way)
    const queryString = options.url.split('?')[1] || '';
    const params = new URLSearchParams(queryString);
    const doctorId = options.url.match(/\/api\/doctors\/(\d+)\/patients/)[1];

    // 3. Get pagination parameters
    const page = parseInt(params.get('page') || 1);
    const pageSize = parseInt(params.get('pageSize') || 8);

    // 4. Get search parameters (add default values)
    const searchName = params.get('name') || '';
    const searchPhone = params.get('phone') || '';
    const searchGender = params.get('gender') || '';
    const searchIdNumber = params.get('idNumber') || '';

    // 5. Get all patient relationships of the doctor
    let doctorPatients = relations
        .filter(rel => rel.doctorId === String(doctorId))
        .map(rel => {
            const patient = findPatientById(rel.patientId);
            return patient ? {
                ...patient,
                relationInfo: {
                    doctorId: rel.doctorId,
                    patientId: rel.patientId,
                    doctorName: findDoctorById(rel.doctorId)?.name || '未知医生'
                }
            } : null;
        })
        .filter(patient => patient !== null);

    // 6. Apply search conditions (add existence check)
    if (searchName) {
        doctorPatients = doctorPatients.filter(p =>
            p.name && p.name.toLowerCase().includes(searchName.toLowerCase())
        );
    }
    if (searchPhone) {
        doctorPatients = doctorPatients.filter(p =>
            p.phone && p.phone.includes(searchPhone)
        );
    }
    if (searchGender) {
        doctorPatients = doctorPatients.filter(p =>
            p.gender && p.gender === searchGender
        );
    }
    if (searchIdNumber) {
        doctorPatients = doctorPatients.filter(p =>
            p.idNumber && p.idNumber.includes(searchIdNumber)
        );
    }

    // 7. Pagination handling
    const total = doctorPatients.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = doctorPatients.slice(startIndex, endIndex);

    // 8. Return response
    return {
        status: 200,
        data: paginatedData.map(p => ({
            id: p.id,
            name: p.name,
            phone: p.phone,
            gender: p.gender,
            birthDate: p.birthDate,
            idNumber: p.idNumber,
            age: calculateAge(p.birthDate),
            relationInfo: p.relationInfo
        })),
        total: total,
        page: page,
        pageSize: pageSize,
        message: '获取患者列表成功'
    };
});
// Helper function: Calculate age (consistent with relations interface style)
function calculateAge(birthDate) {
    if (!birthDate) return null;
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

// Simulated API for getting patient reports /api/patient/:patientId/reports (GET)
Mock.mock(/\/api\/patient\/(\d+)\/reports/, 'get', (options) => {
  const patientId = options.url.split('/').reverse()[1];
  // ✅ Call modified permission check function, no parameters needed
  const authResult = checkAdminOrRelatedDoctor();
  if (authResult.status !== 200) {
      return authResult; // Will not execute here
  }

  // Directly get data from patientReports object
  const reports = patientReports[patientId] || [];
   // No need to sort again here, as the data is hardcoded and can be kept in order
  return {
      status: 200,
      message: '获取报告成功',
      data: reports
  };
});


// Simulated GET /api/admin/doctors (paginated list with search conditions)
Mock.mock(/\/api\/admin\/doctors(\?.*)?$/, 'get', (options) => {
    // ✅ Call modified permission check function, no parameters needed
     const authResult = checkAdminOrRelatedDoctor();
     if (authResult.status !== 200) {
          return authResult; // Will not execute here
     }

    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);

    // Get pagination parameters
    const page = parseInt(params.get('page') || 1);
    const pageSize = parseInt(params.get('pageSize') || 20);

    // Get search parameters
    const searchName = params.get('name') || '';
    const searchPhone = params.get('phone') || '';
    const searchHospital = params.get('hospital') || '';
    const searchDepartment = params.get('department') || '';


    // Filter doctors array based on search conditions
    let filteredDoctors = doctors; // Start filtering from all doctors

    if (searchName) {
        const lowerCaseSearchName = searchName.toLowerCase();
        filteredDoctors = filteredDoctors.filter(doc =>
             typeof doc.name === 'string' && doc.name.toLowerCase().includes(lowerCaseSearchName)
        );
    }

    if (searchPhone) {
        filteredDoctors = filteredDoctors.filter(doc =>
             typeof doc.phone === 'string' && doc.phone.includes(searchPhone)
        );
    }

     if (searchHospital) {
        const lowerCaseSearchHospital = searchHospital.toLowerCase();
        filteredDoctors = filteredDoctors.filter(doc =>
             typeof doc.hospital === 'string' && doc.hospital.toLowerCase().includes(lowerCaseSearchHospital)
        );
    }

    if (searchDepartment) {
        const lowerCaseSearchDepartment = searchDepartment.toLowerCase(); // Fixed typo
        filteredDoctors = filteredDoctors.filter(doc =>
             typeof doc.department === 'string' && doc.department.toLowerCase().includes(lowerCaseSearchDepartment)
        );
    }


    // Get total count of filtered results
    const totalFiltered = filteredDoctors.length;

    // Slice filtered results into pages
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = filteredDoctors.slice(startIndex, endIndex).map(doc => ({
         // Fields needed for doctor list
         id: doc.id,
         name: doc.name,
         phone: doc.phone,
         hospital: doc.hospital,
         department: doc.department
    }));


    return {
        status: 200,
        data: list, // Return paginated data
        total: totalFiltered, // Return total count of filtered results
        message: '获取医生列表成功'
    };
});

// Simulated POST /api/admin/doctors (register doctor)
Mock.mock('/api/admin/doctors', 'post', (options) => {
    // ✅ Call modified permission check function, no parameters needed
    const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // Will not execute here
     }

    const body = JSON.parse(options.body);
    const { name, password, phone, hospital, department } = body;

     if (!name || !password || !phone || !hospital || !department) {
         return { status: 400, message: '缺少必需字段' };
     }


    const exists = initialUsers.some(user => user.name === name || (phone && user.phone === phone));

    if (exists) {
        return {
            status: 409, // Conflict
            message: '姓名或手机号已存在'
        };
    }

    const newDoctor = {
        id: Mock.mock('@increment').toString(), // Use Mock.mock('@increment') to generate a number, then convert to string ID
        name, password, phone, hospital, department,
        isAdmin: false, isDoctor: true, isPatient: false,
    };

    initialUsers.push(newDoctor);
    // After registering a new user, update the derived doctor and patient lists
    patientsData = initialUsers.filter(user => user.isPatient);
    doctors = initialUsers.filter(user => user.isDoctor);


    return {
        status: 201, // Created
        message: '医生注册成功',
        data: { id: newDoctor.id, name: newDoctor.name } // Can return some data when successful
    };
});

// Simulated PUT /api/admin/doctors/:id (update doctor)
Mock.mock(/\/api\/admin\/doctors\/(\d+)/, 'put', (options) => {
    // ✅ Call modified permission check function, no parameters needed
     const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // Will not execute here
     }

    const idMatch = options.url.match(/\/api\/admin\/doctors\/(\d+)/);
    const doctorId = idMatch ? String(idMatch[1]) : null;

    if (!doctorId) {
        return { status: 400, message: 'URL 中缺少医生ID' };
    }

    const body = JSON.parse(options.body);
    // Allow partial update, only take fields from body
    const { name, phone, hospital, department, password } = body;

     // Check if body is empty
     if (Object.keys(body).length === 0) {
         return { status: 400, message: '请求体缺少需要更新的字段' };
     }


    const doctorIndex = initialUsers.findIndex(user => user.id === doctorId && user.isDoctor); // Find doctor in initialUsers

    if (doctorIndex === -1) {
        return { status: 404, message: '未找到该医生' };
    }

     // Check if updated name or phone conflicts with other users (excluding current doctor)
    const conflictUser = initialUsers.find(user =>
        user.id !== doctorId &&
        ( (name !== undefined && user.name === name) || (phone !== undefined && user.phone === phone) ) // Check only fields provided in body
    );

    if (conflictUser) {
        return { status: 409, message: '更新的姓名或手机号已被其他用户使用' };
    }


    // Update doctor information in initialUsers
    const doctorToUpdate = initialUsers[doctorIndex];
    if (name !== undefined) doctorToUpdate.name = name;
    if (phone !== undefined) doctorToUpdate.phone = phone;
    if (hospital !== undefined) doctorToUpdate.hospital = hospital;
    if (department !== undefined) doctorToUpdate.department = department;
    if (password !== undefined) doctorToUpdate.password = password; // If frontend sent password field

    // Update derived doctor and patient lists
    doctors = initialUsers.filter(user => user.isDoctor);
    patientsData = initialUsers.filter(user => user.isPatient);

     // If doctor's name has changed, need to update related doctorName in relations array
     // The relations array doesn't have id, so directly modifying the found object is fine
     relations.forEach(rel => {
        if (rel.doctorId === doctorId) {
            rel.doctorName = doctorToUpdate.name;
        }
     });


    return { status: 200, message: '医生信息更新成功' };
});

// Simulated DELETE /api/admin/doctors/:id (delete doctor)
Mock.mock(/\/api\/admin\/doctors\/(\d+)/, 'delete', (options) => {
    // ✅ Call modified permission check function, no parameters needed
     const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // Will not execute here
     }


    const idMatch = options.url.match(/\/api\/admin\/doctors\/(\d+)/);
    const doctorId = idMatch ? String(idMatch[1]) : null;

    if (!doctorId) {
        return { status: 400, message: 'URL 中缺少医生ID' };
    }

    const doctorIndex = initialUsers.findIndex(user => user.id === doctorId && user.isDoctor);

    if (doctorIndex === -1) {
        return { status: 404, message: '未找到该医生' };
    }

     // 💡 Mock directly deletes related relationships and reports
     relations = relations.filter(rel => rel.doctorId !== doctorId); // ⬅️ Modify relations array

     // Delete the doctor's patients' reports (if the doctor is the only associated doctor for a patient and business allows deleting patients) - This logic is complex, so we'll skip it for now
     // Simple handling: Delete the relationship of the doctor


    // Delete doctor from initialUsers
    initialUsers.splice(doctorIndex, 1);

    // Update derived doctor and patient lists
    doctors = initialUsers.filter(user => user.isDoctor);
    patientsData = initialUsers.filter(user => user.isPatient);


    return { status: 204, message: '医生删除成功' }; // 204 No Content standard indicates successful deletion and no return body
});


// Simulated GET /api/admin/doctors/search (remote search for doctors)
Mock.mock(/\/api\/admin\/doctors\/search(\?.*)?$/, 'get', (options) => {
    // ✅ Call modified permission check function, no parameters needed
    const authResult = checkAdminOrRelatedDoctor(); // Allow doctors too
    if (authResult.status !== 200) {
         return authResult; // Will not execute here
    }


    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);
    const query = params.get('query') || '';

    const lowerCaseQuery = query.toLowerCase();

    const filteredDoctors = doctors.filter(doctor =>
        // Check if it's a string before calling toLowerCase
        (typeof doctor.name === 'string' && doctor.name.toLowerCase().includes(lowerCaseQuery)) ||
        (doctor.phone && String(doctor.phone).includes(query)) || // Ensure it's a string before including
        (typeof doctor.hospital === 'string' && doctor.hospital.toLowerCase().includes(lowerCaseQuery)) ||
        (typeof doctor.department === 'string' && doctor.department.toLowerCase().includes(lowerCaseQuery))
    );

    const result = filteredDoctors.slice(0, 50).map(doc => ({ // Limit search results to 50
         id: doc.id,
         name: doc.name
    }));

    return {
        status: 200,
        data: result,
        message: '搜索医生成功'
    };
});


// Simulated GET /api/admin/patients (paginated list with search conditions)
Mock.mock(/\/api\/admin\/patients(\?.*)?$/, 'get', (options) => {
    // ✅ Call modified permission check function, no parameters needed
    const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // Will not execute here
     }

    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);

    // Get pagination parameters
    const page = parseInt(params.get('page') || 1);
    const pageSize = parseInt(params.get('pageSize') || 20);

    // Get search parameters
    const searchName = params.get('name') || '';
    const searchPhone = params.get('phone') || '';
    const searchGender = params.get('gender') || '';
    const searchIdNumber = params.get('idNumber') || '';


    // Filter patientsData array based on search conditions
    let filteredPatients = patientsData; // Start filtering from all patients

    if (searchName) {
        const lowerCaseSearchName = searchName.toLowerCase();
        filteredPatients = filteredPatients.filter(pat =>
             typeof pat.name === 'string' && pat.name.toLowerCase().includes(lowerCaseSearchName)
        );
    }

    if (searchPhone) {
        filteredPatients = filteredPatients.filter(pat =>
             typeof pat.phone === 'string' && pat.phone.includes(searchPhone)
        );
    }

     if (searchGender) {
        const lowerCaseSearchGender = searchGender.toLowerCase();
        filteredPatients = filteredPatients.filter(pat =>
             typeof pat.gender === 'string' && pat.gender.toLowerCase().includes(lowerCaseSearchGender)
        );
    }

    if (searchIdNumber) {
        const lowerCaseSearchIdNumber = searchIdNumber.toLowerCase();
        filteredPatients = filteredPatients.filter(pat =>
             typeof pat.idNumber === 'string' && pat.idNumber.toLowerCase().includes(lowerCaseSearchIdNumber)
        );
    }


    // Get total count of filtered results
    const totalFiltered = filteredPatients.length;

    // Slice filtered results into pages
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = filteredPatients.slice(startIndex, endIndex).map(pat => ({
         // Fields needed for patient list
         id: pat.id,
         name: pat.name,
         phone: pat.phone,
         gender: pat.gender,
         birthDate: pat.birthDate, // Add birth date
         idNumber: pat.idNumber,   // Add ID number
    }));


    return {
        status: 200,
        data: list, // Return paginated data
        total: totalFiltered, // Return total count of filtered results
        message: '获取患者列表成功'
    };
});

// Simulated GET /api/admin/patients/search (remote search for patients)
Mock.mock(/\/api\/admin\/patients\/search(\?.*)?$/, 'get', (options) => {
    // ✅ Call modified permission check function, no parameters needed
    const authResult = checkAdminOrRelatedDoctor(); // Allow doctors too
    if (authResult.status !== 200) {
         return authResult; // Will not execute here
    }

    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);
    const query = params.get('query') || '';

    const lowerCaseQuery = query.toLowerCase();

    const filteredPatients = patientsData.filter(patient =>
        // Check if it's a string before calling toLowerCase
        (typeof patient.name === 'string' && patient.name.toLowerCase().includes(lowerCaseQuery)) ||
        (patient.phone && String(patient.phone).includes(query)) ||
        (typeof patient.gender === 'string' && patient.gender.toLowerCase().includes(lowerCaseQuery)) ||
        (typeof patient.idNumber === 'string' && patient.idNumber.toLowerCase().includes(lowerCaseQuery))
    );

    const result = filteredPatients.slice(0, 50).map(pat => ({ // Limit search results to 50
         id: pat.id,
         name: pat.name
    }));

    return {
        status: 200,
        data: result,
        message: '搜索患者成功'
    };
});

// Simulated PUT /api/admin/patients/:id (update patient)
Mock.mock(/\/api\/admin\/patients\/(\d+)/, 'put', (options) => {
    // ✅ Call modified permission check function, no parameters needed
     const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // Will not execute here
     }

    const idMatch = options.url.match(/\/api\/admin\/patients\/(\d+)/);
    const patientId = idMatch ? String(idMatch[1]) : null;

    if (!patientId) {
        return { status: 400, message: 'URL 中缺少患者ID' };
    }

    const body = JSON.parse(options.body);
    // Allow partial update, only take fields from body
    const { name, phone, gender, birthDate, idType, idNumber, password } = body;

     // Check if body is empty
     if (Object.keys(body).length === 0) {
         return { status: 400, message: '请求体缺少需要更新的字段' };
     }


    const patientIndex = initialUsers.findIndex(user => user.id === patientId && user.isPatient); // Find patient in initialUsers

    if (patientIndex === -1) {
        return { status: 404, message: '未找到该患者' };
    }

     // Check if updated name, phone, or ID number conflicts with other users (excluding current patient)
    const conflictUser = initialUsers.find(user =>
        user.id !== patientId &&
        ( (name !== undefined && user.name === name) || (phone !== undefined && user.phone === phone) || (idNumber !== undefined && user.idNumber === idNumber) ) // Check only fields provided in body
    );

    if (conflictUser) {
        return { status: 409, message: '更新的姓名、手机号或身份证号已被其他用户使用' };
    }


    // Update patient information in initialUsers
    const patientToUpdate = initialUsers[patientIndex];
    if (name !== undefined) patientToUpdate.name = name;
    if (phone !== undefined) patientToUpdate.phone = phone;
    if (gender !== undefined) patientToUpdate.gender = gender;
    if (birthDate !== undefined) patientToUpdate.birthDate = birthDate;
    if (idType !== undefined) patientToUpdate.idType = idType;
    if (idNumber !== undefined) patientToUpdate.idNumber = idNumber;
    if (password !== undefined) patientToUpdate.password = password; // If frontend sent password field

    // Update derived doctor and patient lists
    doctors = initialUsers.filter(user => user.isDoctor);
    patientsData = initialUsers.filter(user => user.isPatient);

     // If patient's name has changed, need to update related patientName in relations array
     // The relations array doesn't have id, so directly modifying the found object is fine
     relations.forEach(rel => {
        if (rel.patientId === patientId) {
            rel.patientName = patientToUpdate.name;
        }
     });


    return { status: 200, message: '患者信息更新成功' };
});

// Simulated DELETE /api/admin/patients/:id (delete patient)
Mock.mock(/\/api\/admin\/patients\/(\d+)/, 'delete', (options) => {
    // ✅ Call modified permission check function, no parameters needed
     const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // Will not execute here
     }

    const idMatch = options.url.match(/\/api\/admin\/patients\/(\d+)/);
    const patientId = idMatch ? String(idMatch[1]) : null;

    if (!patientId) {
        return { status: 400, message: 'URL 中缺少患者ID' };
    }

    const patientIndex = initialUsers.findIndex(user => user.id === patientId && user.isPatient);

    if (patientIndex === -1) {
        return { status: 404, message: '未找到该患者' };
    }

     // 💡 Mock directly deletes related relationships and reports
     relations = relations.filter(rel => rel.patientId !== patientId); // ⬅️ Modify relations array

     // Delete all reports for the patient
     if (patientReports[patientId]) {
         delete patientReports[patientId];
     }


    // Delete patient from initialUsers
    initialUsers.splice(patientIndex, 1);

    // Update derived doctor and patient lists
    doctors = initialUsers.filter(user => user.isDoctor);
    patientsData = initialUsers.filter(user => user.isPatient);


    return { status: 204, message: '患者删除成功' }; // 204 No Content standard indicates successful deletion and no return body
});


// Simulated GET /api/admin/relations (paginated list with search conditions)
Mock.mock(/\/api\/admin\/relations(\?.*)?$/, 'get', (options) => {
    // ✅ Call modified permission check function, no parameters needed
     const authResult = checkAdminOrRelatedDoctor();
     if (authResult.status !== 200) {
         return authResult; // Will not execute here
     }

    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);

    // Get pagination parameters
    const page = parseInt(params.get('page') || 1);
    const pageSize = parseInt(params.get('pageSize') || 20);

    // Get search parameters
    const searchDoctorName = params.get('doctorName') || '';
    const searchDoctorPhone = params.get('doctorPhone') || '';
    const searchPatientName = params.get('patientName') || '';
    const searchPatientPhone = params.get('patientPhone') || '';

    // Filter relationship list based on permissions: If doctor, only show their own relationships (the filtering logic is still retained here because it's part of the Mock data, but permission check is no longer valid)
    let accessibleRelations = relations;
    // ✅ Comment out actual permission filtering logic, allowing all users to see all relationships
    /*
    // Note: Since checkAdminOrRelatedDoctor no longer receives options and doctorIdInRelation,
    // the user object in checkAdminOrRelatedDoctor is actually the simulated user returned
    if (authResult.user.isDoctor && !authResult.user.isAdmin) { // If user is doctor AND NOT admin
        // authResult.user.id will be 'mock_user_id' here
        accessibleRelations = relations.filter(rel => rel.doctorId === authResult.user.id);
    }
    */


    // Filter accessibleRelations array based on search conditions
    let filteredRelations = accessibleRelations; // Start filtering from accessible relationships

    if (searchDoctorName) {
        const lowerCaseSearchDoctorName = searchDoctorName.toLowerCase();
        filteredRelations = filteredRelations.filter(rel =>
             // Ensure doctorName is a string before matching
            typeof rel.doctorName === 'string' && rel.doctorName.toLowerCase().includes(lowerCaseSearchDoctorName)
        );
    }

    if (searchDoctorPhone) {
        // Need to find the doctor in the relationship to match their phone number based on doctorID
        filteredRelations = filteredRelations.filter(rel => {
            const doctor = findDoctorById(rel.doctorId);
            return doctor && typeof doctor.phone === 'string' && doctor.phone.includes(searchDoctorPhone);
        });
    }

     if (searchPatientName) {
        const lowerCaseSearchPatientName = searchPatientName.toLowerCase();
        filteredRelations = filteredRelations.filter(rel =>
             // Ensure patientName is a string before matching
             typeof rel.patientName === 'string' && rel.patientName.toLowerCase().includes(lowerCaseSearchPatientName)
        );
    }

    if (searchPatientPhone) {
         // Need to find the patient in the relationship to match their phone number based on patientID
        filteredRelations = filteredRelations.filter(rel => {
            const patient = findPatientById(rel.patientId);
            return patient && typeof patient.phone === 'string' && patient.phone.includes(searchPatientPhone);
        });
    }

    // Get total count of filtered results
    const totalFiltered = filteredRelations.length;

    // Slice filtered results into pages
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    // Relationships no longer have id
    const list = filteredRelations.slice(startIndex, endIndex).map(relation => {
         // Associated data, find name (name is already included in hardcoded data, so we're just ensuring it's up-to-date here)
        // The map here can be simplified because the filtered relations already contain name field
        // To ensure name is synchronized with user data, we're still checking
        const doctor = findDoctorById(relation.doctorId); // Check again to ensure latest name (if doctor information has been modified)
        const patient = findPatientById(relation.patientId); // Check again to ensure latest name (if patient information has been modified)
         return {
            // id: relation.id, // Remove id
            doctorId: relation.doctorId,
            patientId: relation.patientId,
            // Use the latest name found, or fall back to the name stored in the relationship
            doctorName: doctor ? doctor.name : relation.doctorName || '未知医生',
            patientName: patient ? patient.name : relation.patientName || '未知患者',
         };
    });


    return {
        status: 200,
        data: list, // Return paginated data
        total: totalFiltered, // Return total count of filtered results
        message: '获取医患关系列表成功'
    };
});


// Simulated POST /api/admin/relations (add relationship)
Mock.mock('/api/admin/relations', 'post', (options) => {
    // ✅ Call modified permission check function, no parameters needed
     const authResult = checkAdminOrRelatedDoctor(); // doctorIdInRelation is determined by the request body
     if (authResult.status !== 200) {
         return authResult; // Will not execute here
     }


    const body = JSON.parse(options.body);
    const { doctorId, patientId } = body; // Still expect doctorId and patientId

    if (!doctorId || !patientId) {
         return {
            status: 400, message: '缺少医生ID或患者ID'
        };
    }

     // ✅ Comment out doctor's permission to only add their own relationships
     /*
     if (authResult.user.isDoctor && !authResult.user.isAdmin && authResult.user.id !== String(doctorId)) {
          return { status: 403, message: '医生只能添加自己的医患关系' };
     }
     */


    const exists = relations.some(r => String(r.doctorId) === String(doctorId) && String(r.patientId) === String(patientId));
    if (exists) {
         return {
            status: 409, message: '该医患关系已存在'
        };
    }

    const doctor = findDoctorById(doctorId);
    const patient = findPatientById(patientId);

    if (!doctor || !patient) {
         return {
            status: 404, message: '医生或患者不存在'
        };
    }

    // ✅ New relationship object does not have id field
    const newRelation = {
        doctorId: String(doctorId),
        patientId: String(patientId),
        doctorName: doctor.name, // Add name
        patientName: patient.name // Add name
    };

    relations.push(newRelation);

    return {
        status: 201,
        message: '关系添加成功',
        data: newRelation // Return new added relationship object (no id)
    };
});


// Modified: Simulated PUT /api/admin/relations (update relationship)
// URL no longer contains ID, relationship ID is carried in body
Mock.mock('/api/admin/relations', 'put', (options) => {
     const body = JSON.parse(options.body);
     const { oldDoctorId, oldPatientId, newDoctorId, newPatientId } = body;

     if (!oldDoctorId || !oldPatientId || !newDoctorId || !newPatientId) {
         return { status: 400, message: '请求体缺少旧的医患ID或新的医患ID' };
     }

     // ✅ Call modified permission check function, no parameters needed
     const authResult = checkAdminOrRelatedDoctor(); // checkAdminOrRelatedDoctor will always pass
     if (authResult.status !== 200) {
         return authResult; // Will not execute here
     }

     // ✅ Comment out doctor's permission to only update their own relationships
     /*
     if (authResult.user.isDoctor && !authResult.user.isAdmin && authResult.user.id !== String(oldDoctorId)) {
          return { status: 403, message: '医生只能更新自己的医患关系' };
     }
     */


    // Find old relationship to update
    const oldRelationIndex = relations.findIndex(rel =>
        String(rel.doctorId) === String(oldDoctorId) &&
        String(rel.patientId) === String(oldPatientId)
    );

    if (oldRelationIndex === -1) {
        return { status: 404, message: '未找到指定的旧医患关系' };
    }

     // Check if new relationship exists (if new and old IDs are different)
     const isNewRelationSameAsOld = String(oldDoctorId) === String(newDoctorId) && String(oldPatientId) === String(newPatientId);

     if (!isNewRelationSameAsOld) {
         const newRelationExists = relations.some(rel =>
             String(rel.doctorId) === String(newDoctorId) &&
             String(rel.patientId) === String(newPatientId)
         );
         if (newRelationExists) {
             return { status: 409, message: '新的医患关系已存在' };
         }
     }

     // Check if new doctor and patient exist
     const newDoctor = findDoctorById(newDoctorId);
     const newPatient = findPatientById(newPatientId);

      if (!newDoctor || !newPatient) {
         return { status: 404, message: '更新时指定的新医生或患者不存在' };
     }


    // Find old relationship object and update its properties (or delete old one and add new one)
    // Mock directly modifying object is more convenient
    const updatedRelation = relations[oldRelationIndex];
    updatedRelation.doctorId = String(newDoctorId);
    updatedRelation.patientId = String(newPatientId);
    updatedRelation.doctorName = newDoctor.name; // Update name
    updatedRelation.patientName = newPatient.name; // Update name

     // ✅ Comment out doctor's permission to transfer relationship to other doctors
     /*
     if (authResult.user.isDoctor && !authResult.user.isAdmin && String(newDoctorId) !== authResult.user.id) {
         return { status: 403, message: '医生无法将关系转移给其他医生' };
     }
     */


    return {
        status: 200,
        message: '医患关系更新成功',
        data: updatedRelation // Return updated object (no id)
    };
});

// Modified: Simulated DELETE /api/admin/relations/:doctorId/:patientId (delete relationship)
Mock.mock(/\/api\/admin\/relations\/(\d+)\/(\d+)/, 'delete', (options) => {
    const idMatch = options.url.match(/\/api\/admin\/relations\/(\d+)\/(\d+)/);
    const doctorId = idMatch ? String(idMatch[1]) : null;
    const patientId = idMatch ? String(idMatch[2]) : null;


     if (!doctorId || !patientId) {
        return {
            status: 400, message: 'URL 中缺少医生ID或患者ID'
        };
    }

    // ✅ Call modified permission check function, no parameters needed
     const authResult = checkAdminOrRelatedDoctor(); // checkAdminOrRelatedDoctor will always pass
     if (authResult.status !== 200) {
         return authResult; // Will not execute here
     }

     // ✅ Comment out doctor's permission to delete their own relationships
     /*
     if (authResult.user.isDoctor && !authResult.user.isAdmin && authResult.user.id !== String(doctorId)) {
          return { status: 403, message: '医生只能删除自己的医患关系' };
     }
     */


    const relationIndex = relations.findIndex(rel =>
        String(rel.doctorId) === String(doctorId) &&
        String(rel.patientId) === String(patientId)
    );

    if (relationIndex === -1) {
        return {
            status: 404, message: '未找到该医患关系'
        };
    }

    // Delete data
    relations.splice(relationIndex, 1);

    return {
        status: 204,
        message: '医患关系删除成功'
    };
});


console.log('Mock API 已启用 (硬编码数据 + 医生/患者/关系管理) - 安全检查已禁用');


Mock.mock(/\/api\/measurements\/\d+/, 'get', (options) => {
  const measurementId = options.url.split('/').pop()

  return Mock.mock({
    code: 200,
    message: 'success',
    data: {
      id: measurementId,
      patientId: 1,
      date: '@date',
      results: {
        rangeOfMotion: '@integer(70, 90)%',
        gaitCycle: '@float(0.8, 1.5, 1, 2)s',
        stepLength: '@float(0.6, 0.9, 1, 2)m',
        cadence: '@integer(90, 120) steps/min',
        speed: '@float(0.8, 1.4, 1, 2)m/s'
      }
    }
  })
})

import dayjs from 'dayjs'

const reportsDB = []
let reportCounter = 1

// Fixed pattern report data generator
const generateFixedReportData = () => ({
  standardAmplitude: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  motionAmplitude: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  difference: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
})

// Intercept CSV upload route
Mock.mock(/\/api\/upload\/csv/, 'post', (options) => {
  try {
    // Parse FormData (simulated)
    const formData = new URLSearchParams(options.body)
    const patientId = formData.get('patientId')

    if (!patientId) {
      return Mock.mock({
        status: 400,
        message: '缺少 patientId 参数'
      })
    }

    // Generate fixed pattern report data
    const reportData = {
      reportId: `rep_${reportCounter++}`,
      receivedAt: dayjs().toISOString(),
      reportData: generateFixedReportData()
    }

    // Save to database
    reportsDB.push({
      ...reportData,
      patientId,
      createdAt: new Date().toISOString()
    })

    // Return strictly compliant response
    return {
      status: 200,
      data: {
        receivedAt: reportData.receivedAt,
        reportId: reportData.reportId,
        reportData: reportData.reportData  // Now includes standardAmplitude, motionAmplitude, difference
      },
      message: 'CSV 文件上传成功'
    }
  } catch (error) {
    return Mock.mock({
      status: 500,
      message: '服务器处理文件时出错: ' + error.message
    })
  }
})
// Report update interface (unchanged)
Mock.mock(/\/api\/report\/\w+/, 'put', (options) => {
  const urlParts = options.url.split('/')
  const reportId = urlParts[urlParts.length - 1]
  const body = JSON.parse(options.body)

  const report = reportsDB.find(r => r.reportId === reportId)
  if (!report) {
    return Mock.mock({
      status: 404,
      message: '报告不存在'
    })
  }

  report.type = body.type || '初始评估'
  report.summary = body.summary || ''
  report.updatedAt = new Date().toISOString()

  return Mock.mock({
    status: 200,
    data: {
      reportId: report.reportId,
      updatedAt: report.updatedAt
    },
    message: '报告更新成功'
  })
})

// Get report details (return fixed data)
Mock.mock(/\/api\/reports\/\w+/, 'get', (options) => {
  const urlParts = options.url.split('/')
  const reportId = urlParts[urlParts.length - 1]

  const report = reportsDB.find(r => r.reportId === reportId)
  if (!report) {
    return Mock.mock({
      status: 404,
      message: '报告不存在'
    })
  }

  return {
    status: 200,
    data: {
      ...report,
      // Ensure fixed array is returned with correct property names
      reportData: {
        standardAmplitude: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        motionAmplitude: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        difference: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      }
    },
    message: '获取报告成功'
  }
})

console.log('Mock 服务已启动，使用固定1-12的测试数据')
console.log('POST /api/upload/csv')
console.log('PUT /api/report/:id')
console.log('GET /api/reports/:id')