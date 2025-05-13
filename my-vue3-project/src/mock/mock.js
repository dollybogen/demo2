// mock.js
import Mock from 'mockjs';

// 设置全局延迟，模拟网络请求
Mock.setup({
  timeout: '200-600' // 设置请求延迟时间，单位毫秒
});

// --- 硬编码的模拟数据 ---

// 模拟用户数据 (包含姓名和所有字段)
const initialUsers = [
  { id: '1', name: 'admin', password: 'password', isAdmin: true, isDoctor: false, isPatient: false },

  // 10 个医生数据
  { id: '101', name: 'doctor1', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13810001011', hospital: '北京协和医院', department: '内科' },
  { id: '102', name: 'doctor2', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13920002022', hospital: '上海华山医院', department: '外科' },
  { id: '103', name: '赵强', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13030003033', hospital: '广州中山医院', department: '儿科' },
  { id: '104', name: '钱莉莉', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13140004044', hospital: '深圳人民医院', department: '妇产科' },
  { id: '105', name: '孙海涛', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13250005055', hospital: '武汉同济医院', department: '骨科' },
  { id: '106', name: '周文静', password: 'password', isAdmin: false, isDoctor: true, isPatient: false, phone: '13360006066', hospital: '成都华西医院', department: '眼科' },
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


// --- 辅助函数 ---

// 根据 ID 查找医生 (此函数仍在接口中使用，保留)
const findDoctorById = (id) => doctors.find(doctor => doctor.id === String(id));
// 根据 ID 查找患者 (此函数仍在接口中使用，保留)
const findPatientById = (id) => patientsData.find(patient => patient.id === String(id));


// ✅ 修改：模拟权限检查函数，使其始终通过，不再需要参数
const checkAdminOrRelatedDoctor = () => {
    // 在不进行实际认证检查时，模拟一个具有所有权限的用户
    // 注意：这仅用于开发和演示目的，真实后端绝不能这样做！
    return {
        status: 200,
        user: { // 返回一个模拟用户，带有管理员和医生标志
            id: 'mock_user_id', // 一个虚拟ID
            name: 'Mock User',
            isAdmin: true,
            isDoctor: true,
            isPatient: true // 模拟用户啥权限都有
        }
    };
};


// --- 模拟接口 ---

// 模拟登录接口 /api/session (POST) - 此接口无需认证，保留原样
Mock.mock('/api/session', 'post', (req) => {
    const { username, password } = JSON.parse(req.body);
    const user = initialUsers.find(u => (u.name === username || u.phone === username) && u.password === password);

    if (user) {
      return {
        status: 200,
        data: {
          id: user.id, // 在登录成功时返回用户ID
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

// 模拟注册接口 /api/users (POST) - 主要用于患者注册，此接口无需认证，保留原样
Mock.mock('/api/users', 'post', (options) => {
    const body = JSON.parse(options.body);
    const { name, phone, gender, birthDate, idType, idNumber, password } = body;

    // 注册时检查姓名、手机号或身份证号冲突
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
            id: Mock.mock('@increment').toString(), // 使用 Mock.mock('@increment') 生成数字，再转字符串 ID
            name, password,
            phone: phone || null, // 允许为空
            gender: gender || null, // 允许为空
            birthDate: birthDate || null, // 允许为空
            idType: idType || null, // 允许为空
            idNumber: idNumber || null, // 允许为空
            isAdmin: false,
            isDoctor: false,
            isPatient: true, // 默认患者
        };
        initialUsers.push(newUser);
        // 注册新用户后，更新派生的患者列表和医生列表
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


// 模拟获取特定医生患者列表接口 /api/doctors/:doctorId/patients (GET)
// 医生端界面可能会使用此接口获取自己关联的患者列表
Mock.mock(/\/api\/doctors\/(\d+)\/patients/, 'get', (options) => {
     const doctorId = options.url.split('/').reverse()[1]; // 从 URL 中提取 doctorId

     // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor();
     if (authResult.status !== 200) {
          return authResult; // 不会执行到这里
     }

     // 根据 doctorId 查找关系，然后找到对应的患者信息
     const patientsForDoctor = relations
         .filter(rel => rel.doctorId === String(doctorId)) // 确保 ID 类型匹配
         .map(rel => findPatientById(rel.patientId))
         .filter(patient => patient !== undefined); // 过滤掉未找到的患者

    return {
        code: 200,
        message: 'success',
        data: patientsForDoctor.map(p => ({ // 模拟返回患者部分信息
             id: p.id,
             name: p.name,
             age: Mock.mock('@integer(20, 70)'), // 模拟年龄
             gender: p.gender
         })),
    };
 });


// 模拟获取患者报告接口 /api/patient/:patientId/reports (GET)
Mock.mock(/\/api\/patient\/(\d+)\/reports/, 'get', (options) => {
  const patientId = options.url.split('/').reverse()[1];
  // ✅ 调用修改后的权限检查函数，不再传递参数
  const authResult = checkAdminOrRelatedDoctor();
  if (authResult.status !== 200) {
      return authResult; // 不会执行到这里
  }

  // 直接从 patientReports object 中获取数据
  const reports = patientReports[patientId] || [];
   // 这里不需要再次排序，因为硬编码时可以保持顺序
  return {
      status: 200,
      message: '获取报告成功',
      data: reports
  };
});


// 模拟 GET /api/admin/doctors (分页列表 带搜索条件)
Mock.mock(/\/api\/admin\/doctors(\?.*)?$/, 'get', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor();
     if (authResult.status !== 200) {
          return authResult; // 不会执行到这里
     }

    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);

    // 获取分页参数
    const page = parseInt(params.get('page') || 1);
    const pageSize = parseInt(params.get('pageSize') || 20);

    // 获取搜索参数
    const searchName = params.get('name') || '';
    const searchPhone = params.get('phone') || '';
    const searchHospital = params.get('hospital') || '';
    const searchDepartment = params.get('department') || '';


    // 根据搜索条件过滤 doctors 数组
    let filteredDoctors = doctors; // 从全部医生开始过滤

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


    // 获取过滤后的总数
    const totalFiltered = filteredDoctors.length;

    // 对过滤后的结果进行分页切片
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = filteredDoctors.slice(startIndex, endIndex).map(doc => ({
         // 返回医生列表所需字段
         id: doc.id,
         name: doc.name,
         phone: doc.phone,
         hospital: doc.hospital,
         department: doc.department
    }));


    return {
        status: 200,
        data: list, // 返回分页后的数据
        total: totalFiltered, // 返回过滤后的总数
        message: '获取医生列表成功'
    };
});

// 模拟 POST /api/admin/doctors (注册医生)
Mock.mock('/api/admin/doctors', 'post', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
    const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // 不会执行到这里
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
        id: Mock.mock('@increment').toString(), // 使用 Mock.mock('@increment') 生成数字，再转字符串 ID
        name, password, phone, hospital, department,
        isAdmin: false, isDoctor: true, isPatient: false,
    };

    initialUsers.push(newDoctor);
    // 注册新用户后，更新派生的医生和患者列表
    patientsData = initialUsers.filter(user => user.isPatient);
    doctors = initialUsers.filter(user => user.isDoctor);


    return {
        status: 201, // Created
        message: '医生注册成功',
        data: { id: newDoctor.id, name: newDoctor.name } // 可以在成功时返回一些数据
    };
});

// 模拟 PUT /api/admin/doctors/:id (更新医生)
Mock.mock(/\/api\/admin\/doctors\/(\d+)/, 'put', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // 不会执行到这里
     }

    const idMatch = options.url.match(/\/api\/admin\/doctors\/(\d+)/);
    const doctorId = idMatch ? String(idMatch[1]) : null;

    if (!doctorId) {
        return { status: 400, message: 'URL 中缺少医生ID' };
    }

    const body = JSON.parse(options.body);
    // 允许部分更新，只取 body 中存在的字段
    const { name, phone, hospital, department, password } = body;

     // 检查 body 是否为空
     if (Object.keys(body).length === 0) {
         return { status: 400, message: '请求体缺少需要更新的字段' };
     }


    const doctorIndex = initialUsers.findIndex(user => user.id === doctorId && user.isDoctor); // 在 initialUsers 中查找医生

    if (doctorIndex === -1) {
        return { status: 404, message: '未找到该医生' };
    }

     // 检查更新后的姓名或电话是否与其他用户冲突 (排除当前医生自己)
    const conflictUser = initialUsers.find(user =>
        user.id !== doctorId &&
        ( (name !== undefined && user.name === name) || (phone !== undefined && user.phone === phone) ) // 仅检查 body 中提供的字段
    );

    if (conflictUser) {
        return { status: 409, message: '更新的姓名或手机号已被其他用户使用' };
    }


    // 更新 initialUsers 中的医生信息
    const doctorToUpdate = initialUsers[doctorIndex];
    if (name !== undefined) doctorToUpdate.name = name;
    if (phone !== undefined) doctorToUpdate.phone = phone;
    if (hospital !== undefined) doctorToUpdate.hospital = hospital;
    if (department !== undefined) doctorToUpdate.department = department;
    if (password !== undefined) doctorToUpdate.password = password; // 如果前端发送了密码字段

    // 更新派生的医生和患者列表
    doctors = initialUsers.filter(user => user.isDoctor);
    patientsData = initialUsers.filter(user => user.isPatient);

     // 如果医生姓名更新了，需要同步更新 relations 数组中相关的 doctorName
     // 这里的 relations 数组没有 id，所以直接修改找到的对象是没问题的
     relations.forEach(rel => {
        if (rel.doctorId === doctorId) {
            rel.doctorName = doctorToUpdate.name;
        }
     });


    return { status: 200, message: '医生信息更新成功' };
});

// 模拟 DELETE /api/admin/doctors/:id (删除医生)
Mock.mock(/\/api\/admin\/doctors\/(\d+)/, 'delete', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // 不会执行到这里
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

     // 💡 Mock 中直接删除关联的关系和报告
     relations = relations.filter(rel => rel.doctorId !== doctorId); // ⬅️ 修改 relations 数组

     // 删除医生的患者的报告 (如果医生是患者的唯一关联医生，并且业务允许删除患者) - 这个逻辑复杂，先跳过
     // 简单处理：删除该医生的关系即可


    // 从 initialUsers 中删除医生
    initialUsers.splice(doctorIndex, 1);

    // 更新派生的医生和患者列表
    doctors = initialUsers.filter(user => user.isDoctor);
    patientsData = initialUsers.filter(user => user.isPatient);


    return { status: 204, message: '医生删除成功' }; // 204 No Content 规范表示删除成功且无返回体
});


// 模拟 GET /api/admin/doctors/search (远程搜索医生)
Mock.mock(/\/api\/admin\/doctors\/search(\?.*)?$/, 'get', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
    const authResult = checkAdminOrRelatedDoctor(); // Allow doctors too
    if (authResult.status !== 200) {
         return authResult; // 不会执行到这里
    }


    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);
    const query = params.get('query') || '';

    const lowerCaseQuery = query.toLowerCase();

    const filteredDoctors = doctors.filter(doctor =>
        // 使用 typeof 检查确保是字符串再调用 toLowerCase
        (typeof doctor.name === 'string' && doctor.name.toLowerCase().includes(lowerCaseQuery)) ||
        (doctor.phone && String(doctor.phone).includes(query)) || // 电话确保是字符串再包含
        (typeof doctor.hospital === 'string' && doctor.hospital.toLowerCase().includes(lowerCaseQuery)) ||
        (typeof doctor.department === 'string' && doctor.department.toLowerCase().includes(lowerCaseQuery))
    );

    const result = filteredDoctors.slice(0, 50).map(doc => ({ // 搜索结果限制50条
         id: doc.id,
         name: doc.name
    }));

    return {
        status: 200,
        data: result,
        message: '搜索医生成功'
    };
});


// 模拟 GET /api/admin/patients (分页列表 带搜索条件)
Mock.mock(/\/api\/admin\/patients(\?.*)?$/, 'get', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
    const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // 不会执行到这里
     }

    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);

    // 获取分页参数
    const page = parseInt(params.get('page') || 1);
    const pageSize = parseInt(params.get('pageSize') || 20);

    // 获取搜索参数
    const searchName = params.get('name') || '';
    const searchPhone = params.get('phone') || '';
    const searchGender = params.get('gender') || '';
    const searchIdNumber = params.get('idNumber') || '';


    // 根据搜索条件过滤 patientsData 数组
    let filteredPatients = patientsData; // 从全部患者开始过滤

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


    // 获取过滤后的总数
    const totalFiltered = filteredPatients.length;

    // 对过滤后的结果进行分页切片
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = filteredPatients.slice(startIndex, endIndex).map(pat => ({
         // 返回患者列表所需字段
         id: pat.id,
         name: pat.name,
         phone: pat.phone,
         gender: pat.gender,
         birthDate: pat.birthDate, // 添加出生日期
         idNumber: pat.idNumber,   // 添加身份证号
    }));


    return {
        status: 200,
        data: list, // 返回分页后的数据
        total: totalFiltered, // 返回过滤后的总数
        message: '获取患者列表成功'
    };
});

// 模拟 GET /api/admin/patients/search (远程搜索患者)
Mock.mock(/\/api\/admin\/patients\/search(\?.*)?$/, 'get', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
    const authResult = checkAdminOrRelatedDoctor(); // Allow doctors too
    if (authResult.status !== 200) {
         return authResult; // 不会执行到这里
    }

    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);
    const query = params.get('query') || '';

    const lowerCaseQuery = query.toLowerCase();

    const filteredPatients = patientsData.filter(patient =>
        // 使用 typeof 检查确保是字符串再调用 toLowerCase
        (typeof patient.name === 'string' && patient.name.toLowerCase().includes(lowerCaseQuery)) ||
        (patient.phone && String(patient.phone).includes(query)) ||
        (typeof patient.gender === 'string' && patient.gender.toLowerCase().includes(lowerCaseQuery)) ||
        (typeof patient.idNumber === 'string' && patient.idNumber.toLowerCase().includes(lowerCaseQuery))
    );

    const result = filteredPatients.slice(0, 50).map(pat => ({ // 搜索结果限制50条
         id: pat.id,
         name: pat.name
    }));

    return {
        status: 200,
        data: result,
        message: '搜索患者成功'
    };
});

// 模拟 PUT /api/admin/patients/:id (更新患者)
Mock.mock(/\/api\/admin\/patients\/(\d+)/, 'put', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // 不会执行到这里
     }

    const idMatch = options.url.match(/\/api\/admin\/patients\/(\d+)/);
    const patientId = idMatch ? String(idMatch[1]) : null;

    if (!patientId) {
        return { status: 400, message: 'URL 中缺少患者ID' };
    }

    const body = JSON.parse(options.body);
    // 允许部分更新，只取 body 中存在的字段
    const { name, phone, gender, birthDate, idType, idNumber, password } = body;

     // 检查 body 是否为空
     if (Object.keys(body).length === 0) {
         return { status: 400, message: '请求体缺少需要更新的字段' };
     }


    const patientIndex = initialUsers.findIndex(user => user.id === patientId && user.isPatient); // 在 initialUsers 中查找患者

    if (patientIndex === -1) {
        return { status: 404, message: '未找到该患者' };
    }

     // 检查更新后的姓名、电话或身份证号是否与其他用户冲突 (排除当前患者自己)
    const conflictUser = initialUsers.find(user =>
        user.id !== patientId &&
        ( (name !== undefined && user.name === name) || (phone !== undefined && user.phone === phone) || (idNumber !== undefined && user.idNumber === idNumber) ) // 仅检查 body 中提供的字段
    );

    if (conflictUser) {
        return { status: 409, message: '更新的姓名、手机号或身份证号已被其他用户使用' };
    }


    // 更新 initialUsers 中的患者信息
    const patientToUpdate = initialUsers[patientIndex];
    if (name !== undefined) patientToUpdate.name = name;
    if (phone !== undefined) patientToUpdate.phone = phone;
    if (gender !== undefined) patientToUpdate.gender = gender;
    if (birthDate !== undefined) patientToUpdate.birthDate = birthDate;
    if (idType !== undefined) patientToUpdate.idType = idType;
    if (idNumber !== undefined) patientToUpdate.idNumber = idNumber;
    if (password !== undefined) patientToUpdate.password = password; // 如果前端发送了密码字段

    // 更新派生的医生和患者列表
    doctors = initialUsers.filter(user => user.isDoctor);
    patientsData = initialUsers.filter(user => user.isPatient);

     // 如果患者姓名更新了，需要同步更新 relations 数组中相关的 patientName
     // 这里的 relations 数组没有 id，所以直接修改找到的对象是没问题的
     relations.forEach(rel => {
        if (rel.patientId === patientId) {
            rel.patientName = patientToUpdate.name;
        }
     });


    return { status: 200, message: '患者信息更新成功' };
});

// 模拟 DELETE /api/admin/patients/:id (删除患者)
Mock.mock(/\/api\/admin\/patients\/(\d+)/, 'delete', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor();
    if (authResult.status !== 200) {
          return authResult; // 不会执行到这里
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

     // 💡 Mock 中直接删除关联的关系和报告
     relations = relations.filter(rel => rel.patientId !== patientId); // ⬅️ 修改 relations 数组

     // 删除该患者的所有报告
     if (patientReports[patientId]) {
         delete patientReports[patientId];
     }


    // 从 initialUsers 中删除患者
    initialUsers.splice(patientIndex, 1);

    // 更新派生的医生和患者列表
    doctors = initialUsers.filter(user => user.isDoctor);
    patientsData = initialUsers.filter(user => user.isPatient);


    return { status: 204, message: '患者删除成功' }; // 204 No Content 规范表示删除成功且无返回体
});


// 模拟 GET /api/admin/relations (分页列表 带搜索条件)
Mock.mock(/\/api\/admin\/relations(\?.*)?$/, 'get', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor();
     if (authResult.status !== 200) {
         return authResult; // 不会执行到这里
     }

    const { url } = options;
    const params = new URLSearchParams(url.split('?')[1]);

    // 获取分页参数
    const page = parseInt(params.get('page') || 1);
    const pageSize = parseInt(params.get('pageSize') || 20);

    // 获取搜索参数
    const searchDoctorName = params.get('doctorName') || '';
    const searchDoctorPhone = params.get('doctorPhone') || '';
    const searchPatientName = params.get('patientName') || '';
    const searchPatientPhone = params.get('patientPhone') || '';

    // 根据权限过滤关系列表: 如果是医生，只显示自己的关系 (这里的过滤逻辑仍然保留，因为它是 Mock 数据的一部分，但权限检查已失效)
    let accessibleRelations = relations;
    // ✅ 注释掉实际的权限过滤逻辑，让所有用户都能看到所有关系
    /*
    // 注意：由于 checkAdminOrRelatedDoctor 不再接收 options 和 doctorIdInRelation，
    // 这里的 user 对象实际上是 checkAdminOrRelatedDoctor 中返回的模拟用户
    if (authResult.user.isDoctor && !authResult.user.isAdmin) { // If user is doctor AND NOT admin
        // 这里 authResult.user.id 会是 'mock_user_id'
        accessibleRelations = relations.filter(rel => rel.doctorId === authResult.user.id);
    }
    */


    // 根据搜索条件过滤 accessibleRelations 数组
    let filteredRelations = accessibleRelations; // 从可访问关系开始过滤

    if (searchDoctorName) {
        const lowerCaseSearchDoctorName = searchDoctorName.toLowerCase();
        filteredRelations = filteredRelations.filter(rel =>
             // 确保 doctorName 是字符串再进行匹配
            typeof rel.doctorName === 'string' && rel.doctorName.toLowerCase().includes(lowerCaseSearchDoctorName)
        );
    }

    if (searchDoctorPhone) {
        // 需要找到关系中的医生，然后根据医生ID找到其电话进行匹配
        filteredRelations = filteredRelations.filter(rel => {
            const doctor = findDoctorById(rel.doctorId);
            return doctor && typeof doctor.phone === 'string' && doctor.phone.includes(searchDoctorPhone);
        });
    }

     if (searchPatientName) {
        const lowerCaseSearchPatientName = searchPatientName.toLowerCase();
        filteredRelations = filteredRelations.filter(rel =>
             // 确保 patientName 是字符串再进行匹配
             typeof rel.patientName === 'string' && rel.patientName.toLowerCase().includes(lowerCaseSearchPatientName)
        );
    }

    if (searchPatientPhone) {
         // 需要找到关系中的患者，然后根据患者ID找到其电话进行匹配
        filteredRelations = filteredRelations.filter(rel => {
            const patient = findPatientById(rel.patientId);
            return patient && typeof patient.phone === 'string' && patient.phone.includes(searchPatientPhone);
        });
    }

    // 获取过滤后的总数
    const totalFiltered = filteredRelations.length;

    // 对过滤后的结果进行分页切片
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    // 关系对象不再有 id
    const list = filteredRelations.slice(startIndex, endIndex).map(relation => {
         // 关联数据，查找名称（硬编码中已包含，这里再查找确保最新，但Mock简单处理直接用relation里的）
        // 这里的 map 可以简化，因为过滤后的 relations 已经包含了 name field
        // 为了确保名称与用户数据同步，还是保留查找
        const doctor = findDoctorById(relation.doctorId); // 再次查找以确保名称最新（如果医生信息被修改）
        const patient = findPatientById(relation.patientId); // 再次查找以确保名称最新（如果患者信息被修改）
         return {
            // id: relation.id, // 移除 id
            doctorId: relation.doctorId,
            patientId: relation.patientId,
            // 使用查找到的最新名称，或者回退使用关系中存储的名称
            doctorName: doctor ? doctor.name : relation.doctorName || '未知医生',
            patientName: patient ? patient.name : relation.patientName || '未知患者',
         };
    });


    return {
        status: 200,
        data: list, // 返回分页后的数据
        total: totalFiltered, // 返回过滤后的总数
        message: '获取医患关系列表成功'
    };
});


// 模拟 POST /api/admin/relations (添加关系)
Mock.mock('/api/admin/relations', 'post', (options) => {
    // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor(); // doctorIdInRelation is determined by the request body
     if (authResult.status !== 200) {
         return authResult; // 不会执行到这里
     }


    const body = JSON.parse(options.body);
    const { doctorId, patientId } = body; // 仍然期望 doctorId 和 patientId

    if (!doctorId || !patientId) {
         return {
            status: 400, message: '缺少医生ID或患者ID'
        };
    }

     // ✅ 注释掉医生只能添加自己的关系的权限判断
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

    // ✅ 新的关系对象没有 id 字段
    const newRelation = {
        doctorId: String(doctorId),
        patientId: String(patientId),
        doctorName: doctor.name, // 添加名称
        patientName: patient.name // 添加名称
    };

    relations.push(newRelation);

    return {
        status: 201,
        message: '关系添加成功',
        data: newRelation // 返回新添加的关系对象 (没有 id)
    };
});


// 修改：模拟 PUT /api/admin/relations (更新关系)
// URL 不再包含 ID，通过 body 携带旧 ID 和新 ID
Mock.mock('/api/admin/relations', 'put', (options) => {
     const body = JSON.parse(options.body);
     const { oldDoctorId, oldPatientId, newDoctorId, newPatientId } = body;

     if (!oldDoctorId || !oldPatientId || !newDoctorId || !newPatientId) {
         return { status: 400, message: '请求体缺少旧的医患ID或新的医患ID' };
     }

     // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor(); // checkAdminOrRelatedDoctor will always pass
     if (authResult.status !== 200) {
         return authResult; // 不会执行到这里
     }

     // ✅ 注释掉医生只能更新自己的关系的权限判断
     /*
     if (authResult.user.isDoctor && !authResult.user.isAdmin && authResult.user.id !== String(oldDoctorId)) {
          return { status: 403, message: '医生只能更新自己的医患关系' };
     }
     */


    // 查找要更新的旧关系
    const oldRelationIndex = relations.findIndex(rel =>
        String(rel.doctorId) === String(oldDoctorId) &&
        String(rel.patientId) === String(oldPatientId)
    );

    if (oldRelationIndex === -1) {
        return { status: 404, message: '未找到指定的旧医患关系' };
    }

     // 检查新的医患关系是否存在 (如果新旧ID不同)
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

     // 查找新的医生和患者是否存在
     const newDoctor = findDoctorById(newDoctorId);
     const newPatient = findPatientById(newPatientId);

      if (!newDoctor || !newPatient) {
         return { status: 404, message: '更新时指定的新医生或患者不存在' };
     }


    // 找到旧的关系对象并更新其属性（或者删除旧的，添加新的）
    // Mock 中直接修改对象更方便
    const updatedRelation = relations[oldRelationIndex];
    updatedRelation.doctorId = String(newDoctorId);
    updatedRelation.patientId = String(newPatientId);
    updatedRelation.doctorName = newDoctor.name; // 更新名称
    updatedRelation.patientName = newPatient.name; // 更新名称

     // ✅ 注释掉医生无法将关系转移给其他医生的权限判断
     /*
     if (authResult.user.isDoctor && !authResult.user.isAdmin && String(newDoctorId) !== authResult.user.id) {
         return { status: 403, message: '医生无法将关系转移给其他医生' };
     }
     */


    return {
        status: 200,
        message: '医患关系更新成功',
        data: updatedRelation // 返回更新后的对象 (没有 id)
    };
});

// 修改：模拟 DELETE /api/admin/relations/:doctorId/:patientId (删除关系)
Mock.mock(/\/api\/admin\/relations\/(\d+)\/(\d+)/, 'delete', (options) => {
    const idMatch = options.url.match(/\/api\/admin\/relations\/(\d+)\/(\d+)/);
    const doctorId = idMatch ? String(idMatch[1]) : null;
    const patientId = idMatch ? String(idMatch[2]) : null;


     if (!doctorId || !patientId) {
        return {
            status: 400, message: 'URL 中缺少医生ID或患者ID'
        };
    }

    // ✅ 调用修改后的权限检查函数，不再传递参数
     const authResult = checkAdminOrRelatedDoctor(); // checkAdminOrRelatedDoctor will always pass
     if (authResult.status !== 200) {
         return authResult; // 不会执行到这里
     }

     // ✅ 注释掉医生只能删除自己的关系的权限判断
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

    // 删除数据
    relations.splice(relationIndex, 1);

    return {
        status: 204,
        message: '医患关系删除成功'
    };
});


console.log('Mock API 已启用 (硬编码数据 + 医生/患者/关系管理) - 安全检查已禁用');