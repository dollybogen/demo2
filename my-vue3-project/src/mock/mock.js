import Mock from 'mockjs';

Mock.setup({
  timeout: '200-600'
});

// 模拟用户数据 (包含姓名)
const users = [
  { 
    id: '1', 
    name: 'admin', 
    password: 'password', 
    isAdmin: true, 
    isDoctor: false, 
    isPatient: false, 

  },
  { 
    id: '101', 
    name: 'doctor1', 
    password: 'password', 
    isAdmin: false, 
    isDoctor: true, 
    isPatient: false, 

    phone: '13812345678', 
    hospital: '某医院', 
    department: '内科' 
  },
  { 
    id: '102', 
    name: 'doctor2', 
    password: 'password', 
    isAdmin: false, 
    isDoctor: true, 
    isPatient: false,  
    phone: '13912345678', 
    hospital: '某医院', 
    department: '外科' 
  },
  { 
    id: '1001', 
    name: 'patient1', 
    password: 'password', 
    isAdmin: false, 
    isDoctor: false, 
    isPatient: true,  
    phone: '15612345678', 
    gender: '男', 
    birthdate: '1990-01-01', 
    idType: '身份证', 
    idNumber: '110101199001010001' 
  },
  { 
    id: '1002', 
    name: 'patient2', 
    password: 'password', 
    isAdmin: false, 
    isDoctor: false, 
    isPatient: true, 
    phone: '15623456789', 
    gender: '女', 
    birthdate: '1985-06-15', 
    idType: '身份证', 
    idNumber: '110101198506150001' 
  },
  { 
    id: '1003', 
    name: 'patient3', 
    password: 'password', 
    isAdmin: false, 
    isDoctor: false, 
    isPatient: true, 
    phone: '15634567890', 
    gender: '男', 
    birthdate: '2000-12-20', 
    idType: '身份证', 
    idNumber: '110101200012200001' 
  }
];

// 模拟医生数据
const doctors = users
  .filter(user => user.isDoctor)
  .map(doctor => ({
    id: doctor.id,
    name: doctor.name,
    password: doctor.password,
    phone: doctor.phone,
    hospital: doctor.hospital,
    department: doctor.department
  }));

let doctorIdCounter = doctors.length > 0 ? Math.max(...doctors.map(d => parseInt(d.id))) + 1 : 103; // 确保 ID 递增

// 模拟患者数据
const patientsData = users
  .filter(user => user.isPatient)
  .map(patient => ({
    id: patient.id,
    name: patient.name,
    phone: patient.phone,
    gender: patient.gender,
    birthdate: patient.birthdate,
    idType: patient.idType,
    idNumber: patient.idNumber
  }));

// 模拟医生-患者关系列表数据
const relations = [
  { id: 1, doctorId: '101', patientId: '1001' },
  { id: 2, doctorId: '102', patientId: '1002' },
];
let relationIdCounter = relations.length + 1;

// 根据 ID 查找用户
// eslint-disable-next-line no-unused-vars
const findUserById = (id) => users.find(user => user.id === id);
const findDoctorById = (id) => doctors.find(doctor => doctor.id === id);
const findPatientById = (id) => patientsData.find(patient => patient.id === id);

// 模拟登录接口 /api/session (POST)Mock.mock('/api/session', 'post', (req) => {
Mock.mock('/api/session', 'post', (req) => {
    const { username, password } = JSON.parse(req.body);
    // 查找用户：可以使用姓名或手机号作为用户名
    const user = users.find(u => (u.name === username || u.phone === username) && u.password === password);
  
    if (user) {
      return {
        status: 200,
        data: {
          id: user.id,
          name: user.name, // 返回姓名
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

// 模拟注册接口 /api/users (POST)
Mock.mock('/api/users', 'post', (req) => {
  const { name, phone, gender, birthdate, idType, idNumber, password } = JSON.parse(req.body); // 接收注册信息
  
  // 查找是否已存在相同姓名或手机号的用户
  const existingUser = users.find(u => u.name === name || u.phone === phone);

  if (existingUser) {
    return {
      status: 409,
      message: '姓名或手机号已存在',
    };
  } else {
    const newUser = {
      id: Mock.mock('@increment'),
      name, // 保存姓名
      phone, // 保存手机号
      gender, // 保存性别
      birthdate, // 保存出生日期
      idType, // 保存证件类型
      idNumber, // 保存证件号码
      password, // 保存密码
      isAdmin: false,
      isDoctor: false,
      isPatient: true, // 默认患者
    };
    users.push(newUser);
    return {
      status: 201,
      data: {
        id: newUser.id,
        name: newUser.name, // 返回姓名
      },
      message: '注册成功',
    };
  }
});


// 模拟获取特定医生患者列表接口 /api/doctors/:doctorId/patients (GET)
Mock.mock(/\/api\/doctors\/(\d+)\/patients/, 'get', (req) => {
  const doctorId = req.url.split('/').slice(-2)[0]; // 从 URL 中提取 doctorId

  if (doctorId === '101') { // 模拟 doctor1 的患者数据
    return {
      code: 200,
      message: 'success',
      data: [
        { id: 1001, name: '张三', age: 45, gender: '男'},
        { id: 1002, name: '李四', age: 32, gender: '女'},
        { id: 1003, name: '王五', age: 60, gender: '男'},
      ],
    };
  } else { // 其他医生返回空数组或相应的患者数据
    return {
      code: 200,
      message: 'success',
      data: [], // 其他医生没有患者或你可以在这里添加其他医生的模拟数据
    };
  }
});

const patientReports = {
  '1001': [
    {
      date: '2025-04-22',
      type: '最新评估',
      summary: '最新步态评估，各项指标稳定。',
      data: {
        '标准幅度': [10,9,1,2,3,4,5,6,7,8,9,10],
        '运动幅度': [1,2,3,4,5,6,7,8,9,10,11,12],
        '差值': [1,2,3,4,5,6,7,8,9,10,11,12],
      },
    },
    {
      date: '2025-04-18',
      type: '中期复查',
      summary: '中期复查，左腿活动度有所改善。',
      data: {
        '标准幅度': [10,9,1,2,3,4,5,6,7,8,9,10],
        '运动幅度':[10,9,1,2,3,4,5,6,7,8,9,10],
        '差值': [100,100,1,0,100,1,2,3,5,9,13,66],
      },
    },
    {
      date: '2025-04-15',
      type: '初步评估',
      summary: '初步步态评估，左腿活动度受限。',
      data: {
        '标准幅度': [10,9,1,2,3,4,5,6,7,8,9,10],
        '运动幅度':[100,100,1,0,100,1,2,3,5,9,13,66],
        '差值': [10,9,1,2,3,4,5,6,7,8,9,10],
      },
    },
  ],
  '1002': [
    {
      date: '2025-04-20',
      type: '首次评估',
      summary: '首次步态评估，双腿平衡感较差。',
      data: {
        '标准幅度': [1,2,3,4,5,6,7,8,9,10,11,12],
        '运动幅度': [1,2,3,4,5,6,7,8,9,10,11,12],
        '差值': [1,2,3,4,5,6,7,8,9,10,11,12],
      },
    },
  ],
  // 你可以添加更多患者的模拟数据
};
Mock.mock(/\/api\/patient\/(\d+)\/reports/, 'get', (options) => {
  const patientId = options.url.split('/').reverse()[1];
  const reports = patientReports[patientId] || [];
  reports.sort((a, b) => new Date(b.date) - new Date(a.date));
  return reports;
});



// 获取医生列表
Mock.mock('/api/admin/doctors', 'get', () => {
  return {
    status: 200,
    data: doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,  // 显示电话
      hospital: doctor.hospital,  // 显示医院
      department: doctor.department  // 显示科室
    })),
  };
});


// 注册医生
Mock.mock('/api/admin/doctors', 'post', (options) => {
  const { username, password, name } = JSON.parse(options.body);
  const exists = doctors.find(d => d.username === username);

  if (exists) {
    return { status: 409, message: '用户名已存在' };
  }

  const newDoctor = {
    id: String(doctorIdCounter++), // 使用字符串 ID
    username,
    password,
    name,
  };
  doctors.push(newDoctor);
  return { status: 201, data: { id: newDoctor.id, username: newDoctor.username, name: newDoctor.name } };
});

// 获取患者列表
Mock.mock('/api/admin/patients', 'get', () => {
  return {
    status: 200,
    data: patientsData,
  };
});

// 获取医生-患者关系 (返回医生和患者姓名)
Mock.mock('/api/admin/relations', 'get', () => {
  const relationsWithNames = relations.map(relation => {
    const doctor = findDoctorById(relation.doctorId);
    const patient = findPatientById(relation.patientId);
    return {
      id: relation.id,
      doctorId: relation.doctorId,
      doctorName: doctor ? doctor.name : '未知医生',
      patientId: relation.patientId,
      patientName: patient ? patient.name : '未知患者',
    };
  });
  return {
    status: 200,
    data: relationsWithNames,
  };
});

// 添加医生-患者关系 (接收医生和患者 ID)
Mock.mock('/api/admin/relations', 'post', (options) => {
  const { doctorId, patientId } = JSON.parse(options.body);
  const newRelation = {
    id: relationIdCounter++,
    doctorId,
    patientId,
  };
  relations.push(newRelation);
  return {
    status: 201,
    data: newRelation,
  };
});

// 更新医生-患者关系 (接收医生和患者 ID)
Mock.mock(/\/api\/admin\/relations\/(\d+)/, 'put', (options) => {
  const id = parseInt(options.url.split('/').pop());
  const { doctorId, patientId } = JSON.parse(options.body);
  const index = relations.findIndex(r => r.id === id);

  if (index !== -1) {
    relations[index] = { ...relations[index], doctorId, patientId };
    return { status: 200, data: relations[index] };
  }
  return { status: 404, message: '未找到关系' };
});

// 删除医生-患者关系
Mock.mock(/\/api\/admin\/relations\/(\d+)/, 'delete', (options) => {
  const id = parseInt(options.url.split('/').pop());
  const index = relations.findIndex(r => r.id === id);

  if (index !== -1) {
    relations.splice(index, 1);
    return { status: 204 };
  }
  return { status: 404, message: '未找到关系' };
});

console.log('Mock API 已启用');
console.log('Mock API is running');