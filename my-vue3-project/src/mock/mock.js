import Mock from 'mockjs';

Mock.setup({
  timeout: '200-600'
});

// Mock user data (including names)
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
    hospital: 'General Hospital',
    department: 'Internal Medicine'
  },
  {
    id: '102',
    name: 'doctor2',
    password: 'password',
    isAdmin: false,
    isDoctor: true,
    isPatient: false,
    phone: '13912345678',
    hospital: 'General Hospital',
    department: 'Surgery'
  },
  {
    id: '1001',
    name: 'patient1',
    password: 'password',
    isAdmin: false,
    isDoctor: false,
    isPatient: true,
    phone: '15612345678',
    gender: 'Male',
    birthdate: '1990-01-01',
    idType: 'ID Card',
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
    gender: 'Female',
    birthdate: '1985-06-15',
    idType: 'ID Card',
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
    gender: 'Male',
    birthdate: '2000-12-20',
    idType: 'ID Card',
    idNumber: '110101200012200001'
  }
];

// Mock doctor data
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

let doctorIdCounter = doctors.length > 0 ? Math.max(...doctors.map(d => parseInt(d.id))) + 1 : 103; // Ensure ID increments

// Mock patient data
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

// Mock doctor-patient relationship data
const relations = [
  { id: 1, doctorId: '101', patientId: '1001' },
  { id: 2, doctorId: '102', patientId: '1002' },
];
let relationIdCounter = relations.length + 1;

// Find user by ID
// eslint-disable-next-line no-unused-vars
const findUserById = (id) => users.find(user => user.id === id);
const findDoctorById = (id) => doctors.find(doctor => doctor.id === id);
const findPatientById = (id) => patientsData.find(patient => patient.id === id);

// Mock login endpoint /api/session (POST)
Mock.mock('/api/session', 'post', (req) => {
    const { username, password } = JSON.parse(req.body);
    // Find user: can use name or phone as username
    const user = users.find(u => (u.name === username || u.phone === username) && u.password === password);

    if (user) {
      return {
        status: 200,
        data: {
          id: user.id,
          name: user.name, // Return name
          isAdmin: user.isAdmin,
          isDoctor: user.isDoctor,
          isPatient: user.isPatient,
        },
        message: 'Login successful',
      };
    } else {
      return {
        status: 401,
        message: 'Incorrect username or password',
      };
    }
  });

// Mock registration endpoint /api/users (POST)
Mock.mock('/api/users', 'post', (req) => {
  const { name, phone, gender, birthdate, idType, idNumber, password } = JSON.parse(req.body); // Receive registration info

  // Check if user with same name or phone already exists
  const existingUser = users.find(u => u.name === name || u.phone === phone);

  if (existingUser) {
    return {
      status: 409,
      message: 'Name or phone number already exists',
    };
  } else {
    const newUser = {
      id: Mock.mock('@increment'),
      name, // Save name
      phone, // Save phone
      gender, // Save gender
      birthdate, // Save birthdate
      idType, // Save ID type
      idNumber, // Save ID number
      password, // Save password
      isAdmin: false,
      isDoctor: false,
      isPatient: true, // Default to patient
    };
    users.push(newUser);
    return {
      status: 201,
      data: {
        id: newUser.id,
        name: newUser.name, // Return name
      },
      message: 'Registration successful',
    };
  }
});

// Mock endpoint to get specific doctor's patient list /api/doctors/:doctorId/patients (GET)
Mock.mock(/\/api\/doctors\/(\d+)\/patients/, 'get', (req) => {
  const doctorId = req.url.split('/').slice(-2)[0]; // Extract doctorId from URL

  if (doctorId === '101') { // Mock data for doctor1
    return {
      code: 200,
      message: 'success',
      data: [
        { id: 1001, name: 'John', age: 45, gender: 'Male'},
        { id: 1002, name: 'Mary', age: 32, gender: 'Female'},
        { id: 1003, name: 'David', age: 60, gender: 'Male'},
      ],
    };
  } else { // Return empty array for other doctors
    return {
      code: 200,
      message: 'success',
      data: [], // Other doctors have no patients or you can add mock data here
    };
  }
});

const patientReports = {
  '1001': [
    {
      date: '2025-04-22',
      type: 'Latest Assessment',
      summary: 'Latest gait assessment, all indicators stable.',
      data: {
        'Range of Motion': [1,2,3,4,5,6,7,8,9,10,11,12],
        'Score': [1,2,3,4,5,6,7,8,9,10,11,12],
      },
    },
    {
      date: '2025-04-18',
      type: 'Mid-term Review',
      summary: 'Mid-term review, left leg mobility improved.',
      data: {
        'Range of Motion':[10,9,1,2,3,4,5,6,7,8,9,10],
        'Score': [100,100,1,0,100,1,2,3,5,9,13,66],
      },
    },
    {
      date: '2025-04-15',
      type: 'Initial Assessment',
      summary: 'Initial gait assessment, left leg mobility limited.',
      data: {
        'Range of Motion':[100,100,1,0,100,1,2,3,5,9,13,66],
        'Score': [10,9,1,2,3,4,5,6,7,8,9,10],
      },
    },
  ],
  '1002': [
    {
      date: '2025-04-20',
      type: 'First Assessment',
      summary: 'First gait assessment, poor balance in both legs.',
      data: {
        'Range of Motion': [1,2,3,4,5,6,7,8,9,10,11,12],
        'Score': [1,2,3,4,5,6,7,8,9,10,11,12],
      },
    },
  ],
  // You can add more patient mock data here
};
Mock.mock(/\/api\/patient\/(\d+)\/reports/, 'get', (options) => {
  const patientId = options.url.split('/').reverse()[1];
  const reports = patientReports[patientId] || [];
  reports.sort((a, b) => new Date(b.date) - new Date(a.date));
  return reports;
});

// Get doctor list
Mock.mock('/api/admin/doctors', 'get', () => {
  return {
    status: 200,
    data: doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,  // Show phone
      hospital: doctor.hospital,  // Show hospital
      department: doctor.department  // Show department
    })),
  };
});

// Register doctor
Mock.mock('/api/admin/doctors', 'post', (options) => {
  const { username, password, name } = JSON.parse(options.body);
  const exists = doctors.find(d => d.username === username);

  if (exists) {
    return { status: 409, message: 'Username already exists' };
  }

  const newDoctor = {
    id: String(doctorIdCounter++), // Use string ID
    username,
    password,
    name,
  };
  doctors.push(newDoctor);
  return { status: 201, data: { id: newDoctor.id, username: newDoctor.username, name: newDoctor.name } };
});

// Get patient list
Mock.mock('/api/admin/patients', 'get', () => {
  return {
    status: 200,
    data: patientsData,
  };
});

// Get doctor-patient relationships (return doctor and patient names)
Mock.mock('/api/admin/relations', 'get', () => {
  const relationsWithNames = relations.map(relation => {
    const doctor = findDoctorById(relation.doctorId);
    const patient = findPatientById(relation.patientId);
    return {
      id: relation.id,
      doctorId: relation.doctorId,
      doctorName: doctor ? doctor.name : 'Unknown Doctor',
      patientId: relation.patientId,
      patientName: patient ? patient.name : 'Unknown Patient',
    };
  });
  return {
    status: 200,
    data: relationsWithNames,
  };
});

// Add doctor-patient relationship (accept doctor and patient IDs)
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

// Update doctor-patient relationship (accept doctor and patient IDs)
Mock.mock(/\/api\/admin\/relations\/(\d+)/, 'put', (options) => {
  const id = parseInt(options.url.split('/').pop());
  const { doctorId, patientId } = JSON.parse(options.body);
  const index = relations.findIndex(r => r.id === id);

  if (index !== -1) {
    relations[index] = { ...relations[index], doctorId, patientId };
    return { status: 200, data: relations[index] };
  }
  return { status: 404, message: 'Relationship not found' };
});

// Delete doctor-patient relationship
Mock.mock(/\/api\/admin\/relations\/(\d+)/, 'delete', (options) => {
  const id = parseInt(options.url.split('/').pop());
  const index = relations.findIndex(r => r.id === id);

  if (index !== -1) {
    relations.splice(index, 1);
    return { status: 204 };
  }
  return { status: 404, message: 'Relationship not found' };
});

console.log('Mock API is running');