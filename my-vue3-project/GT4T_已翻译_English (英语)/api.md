# One. User Authentication Module API Documentation

This module provides basic user login and registration functions, and is designed with RESTful API.

---

## 🟦 1. User login

- **URL**: `/api/session`
- **Method**:  `POST`
- **Description**: User login interface, which verifies according to the user name and password, and returns the user information and permission role after success.

### Request parameters

| 参数名   |Type| 是否必填 | 说明     |
|----------|----------|----------|----------|
| username | `string` | 是       | 用户名   |
| password | `string` | 是       | 密码     |

#### Sample request body


```json
{
  "username": "doctor1",
  "password": "password"
}
```

---

### Successful response (200 OK)


```json
{
  "status": 200,
  "data": {
    "id": "101",
    "username": "doctor1",
    "isAdmin": false,
    "isDoctor": true,
    "isPatient": false,
    "name": "医生1"
  },
  "message": "登录成功"
}
```

---

### Failure Response (401 Unauthorized)


```json
{
  "status": 401,
  "message": "用户名或密码错误"
}
```

---

## 🟩 2. User Registration

- **URL**: `/api/users`
- **Method**: `POST`
- **Description**: User registration API. Provide name, phone number, gender, birth date, and either ID card number or passport information. Upon success, returns the user's basic information.

### 📥 Request Parameters

| Parameter Name | Type     | Required | Description                       |
|----------------|----------|----------|-----------------------------------|
| name           | `string` | Yes      | Name                              |
| phone          | `string` | Yes      | Phone number                      |
| gender         | `string` | Yes      | Gender (e.g., "Male" or "Female") |
| birth_date     | `string` | Yes      | Birth date                        |
| id_card        | `string` | No       | ID card number (choose either ID card or passport) |
| passport       | `string` | No       | Passport number (choose either passport or ID card) |

#### Example Request Body (using ID card)

```json
{
  "name": "New User",
  "phone": "13812345678",
  "gender": "Male",
  "birth_date": "1990-01-01",
  "id_card": "123456789012345678"
}
```
#### Example Request Body (using passport)
```json
{
  "name": "New User",
  "phone": "13812345678",
  "gender": "Male",
  "birth_date": "1990-01-01",
  "passport": "P123456789"
}
```

####  Example Response (200 OK)
```json
{
"status": 200,
"message": "Registration successful",
"data": {
"id": "12345",
"name": "New User",
"phone": "13812345678",
"gender": "Male",
"birth_date": "1990-01-01",
"id_card": "123456789012345678"
}
}
```

#### Sample request body


```json
{
  "username": "newuser",
  "password": "123456",
  "name": "新用户"
}
```
- **Field Description:**

| Field       | Type    | Description             |
|-------------|---------|--------------------------|
| `status`    | number  | Status code (e.g., 200)   |
| `message`   | string  | Status message            |
| `data`      | object  | User information          |

**`data` Field Description:**

| Field             | Type   | Description             |
|-------------------|--------|--------------------------|
| `id`              | string | Unique user ID           |
| `name`            | string | Name                     |
| `phone`           | string | Phone number             |
| `gender`          | string | Gender                   |
| `birth_date`      | string | Birth date               |
| `id_card`         | string | ID card number           |
| `passport`        | string | Passport number          |

---

### Successful response (201 Created)


```json
{
  "status": 201,
  "data": {
    "id": "1004",
    "username": "newuser",
    "name": "新用户"
  },
  "message": "注册成功"
}
```

---

### Failure Response (409 Conflict)


```json
{
  "status": 409,
  "message": "用户名已存在"
}
```

---

## Description of status code

| 状态码 |Meaning|
|--------|-------------------------|
| 200    |The request was successful|
| 201    |Created successfully|
| 401    |Unauthorized (wrong username or password)|
| 409    |Conflicts (e.g. username already exists)|
| 500    |Server internal error|




# Two. Doctor-patient relationship management system API document

This API document is based on RESTful specifications and supports doctor registration, access to doctor/patient information, and addition, deletion, modification, and search of doctor-patient relationships.

---

## General information

- Request Address Uniform Prefix: `/api/admin`
- Request header:

---

## Doctor Management

### 1.Get a list of doctors

- **URL**： `/api/admin/doctors`
- **Method**：GET
- **Description**: Get information on all registered doctors

#### Respond


```json
{
  "status": 200,
  "data": [
    {
      "id": "1",
      "username": "zhangsan",
      "name": "张三"
    },
    {
      "id": "2",
      "username": "lisi",
      "name": "李四"
    }
  ]
}
```

---

### 🟩 2. Register a New Doctor

- **URL**: `/api/admin/doctors`
- **Method**: `POST`
- **Description**: Register a new doctor account by providing username, password, name, phone number, hospital, and department.

#### 📥 Request Body

```json
{
  "username": "zhangsan",
  "password": "123456",
  "name": "Zhang San",
  "phone": "13812345678",
  "hospital": "Beijing General Hospital",
  "department": "Cardiology"
}
```

#### ✅ Response (Success)

```json
{
  "status": 201,
  "data": {
    "id": "3",
    "username": "zhangsan",
    "name": "Zhang San",
    "phone": "13812345678",
    "hospital": "Beijing General Hospital",
    "department": "Cardiology"
  }
}
```

#### 🗂️ Field Description

| Field        | Type     | Description        |
|--------------|----------|--------------------|
| `id`         | string   | Unique doctor ID    |
| `username`   | string   | Username            |
| `name`       | string   | Doctor's name       |
| `phone`      | string   | Phone number        |
| `hospital`   | string   | Hospital name       |
| `department` | string   | Department name     |



#### Response (user name already exists)


```json
{
  "status": 409,
  "message": "用户名已存在"
}
```

---

## 🧍 ♂️ 3. Get a list of patients

- **URL**： `/api/admin/patients`
- **Method**：GET
- **Description**: Get all patient information

#### Respond


```json
{
  "status": 200,
  "data": [
    {
      "id": "1",
      "name": "王五"
    },
    {
      "id": "2",
      "name": "赵六"
    }
  ]
}
```

---

## Doctor-patient relationship management

### 4.Get Doctor-Patient Relationship List

- **URL**： `/api/admin/relations`
- **Method**：GET
- **Description**: Returns the association information between all doctors and patients

#### Respond


```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "doctorId": "1",
      "doctorName": "张三",
      "patientId": "2",
      "patientName": "赵六"
    }
  ]
}
```

---

### 5.Add Doctor-Patient Relationship

- **URL**： `/api/admin/relations`
- **Method**：POST
- **Description**: Add a doctor-patient relationship

#### Request body


```json
{
  "doctorId": "1",
  "patientId": "2"
}
```

#### Respond


```json
{
  "status": 201,
  "data": {
    "id": 5,
    "doctorId": "1",
    "patientId": "2"
  }
}
```

---

### 6.Update doctor-patient relationship

- **URL**： `/api/admin/relations/{relationId}`
- **Method**：PUT
- **Description**: Update existing doctor-patient relationships

#### Path parameters

| 参数名 | 类型 |Explain|
|--------|------|------------|
| relationId | number | 关系 ID |

#### Request body


```json
{
  "doctorId": "2",
  "patientId": "1"
}
```

#### Respond


```json
{
  "status": 200,
  "data": {
    "id": 1,
    "doctorId": "2",
    "patientId": "1"
  }
}
```

#### Response (not found)


```json
{
  "status": 404,
  "message": "未找到关系"
}
```

---

### 7.Delete doctor-patient relationship

- **URL**： `/api/admin/relations/{relationId}`
- **Method**：DELETE
- **Description**: Delete the corresponding doctor-patient relationship based on the relationship ID

#### Path parameters

| 参数名 | 类型 |Explain|
|--------|------|------------|
| relationId | number | 关系 ID |

#### Response (success)


```json
{
  "status": 204
}
```

#### Response (not found)


```json
{
  "status": 404,
  "message": "未找到关系"
}
```

---

## Description of status code

| 状态码 |Meaning|
|--------|---------------------|
| 200    |The request was successful|
| 201    |Created successfully|
| 204    |Deleted successfully, no content returned|
| 400    |Bad request parameter|
| 404    |The requested resource does not exist|
| 409    |Data conflicts (such as duplicate user names)|
| 500    |Server error|

---
# Three. Patient Management System RESTful API Documentation

This document describes the RESTful API interfaces used in the patient management system, including the acquisition interface for the physician associated patient and the acquisition interface for the patient report data.

---

## Interface overview

| 方法 |Interface path| 描述                     |
|------|--------------------------------------------|--------------------------|
| GET  | `/api/doctors/:doctorId/patients`          | 获取某位医生的患者列表   |
| GET  | `/api/patient/:patientId/reports`          | 获取指定患者的步态报告列表 |

---

## 1. Get a list of patients for a doctor

- **Interface path:** `/api/doctors/:doctorId/patients`
- **Request method:** `GET`
- **Request Parameters:**
  -  `doctorId` (Path parameter): unique identification of doctor (e.g. 101)

- **Request example:**


  ```
  GET /api/doctors/101/patients
  ```



```markdown
- **Response Example (200 OK):**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "1001",
      "name": "Zhang San",
      "phone": "13800001111",
      "gender": "Male",
      "birthdate": "1980-05-20",
      "id_card": "110101198005201234"
    },
    {
      "id": "1002",
      "name": "Li Si",
      "phone": "13800002222",
      "gender": "Female",
      "birthdate": "1992-08-15",
      "id_card": "110101199208152345"
    },
    {
      "id": "1003",
      "name": "Wang Wu",
      "phone": "13800003333",
      "gender": "Male",
      "birthdate": "1965-12-01",
      "id_card": "Passport A12345678"
    }
  ]
}
```

---

- **Field Description:**

| Field      | Type    | Description                  |
|------------|---------|------------------------------|
| `code`     | number  | Status code (e.g., 200)        |
| `message`  | string  | Status message                |
| `data`     | array   | Array of patient information  |

**Field Description for Objects within the `data` Array:**

| Field       | Type    | Description                          |
|-------------|---------|--------------------------------------|
| `id`        | string  | Unique patient ID                    |
| `name`      | string  | Name                                 |
| `phone`     | string  | Phone number                         |
| `gender`    | string  | Gender (Male/Female)                 |
| `birthdate` | string  | Birth date (format: YYYY-MM-DD)      |
| `id_card`   | string  | ID card number or passport number    |
```




- **Exception response example:**


  ```json
  {
    "code": 200,
    "message": "success",
    "data": []
  }
  ```

---

## 2. Obtain a gait assessment report for a patient

- **Interface path:** `/api/patient/:patientId/reports`
- **Request method:** `GET`
- **Request Parameters:**
  -  `patientId` (Path parameter): unique identification of the patient (e.g. 1001)

- **Request example:**


  ```
  GET /api/patient/1001/reports
  ```

- **Sample response (200 OK):**


  ```json
  [
    {
      "date": "2025-04-22",
      "type": "最新评估",
      "summary": "最新步态评估，各项指标稳定。",
      "data": {
        "运动幅度": [1,2,3,4,5,6,7,8,9,10,11,12],
        "得分": [1,2,3,4,5,6,7,8,9,10,11,12]
      }
    },
    {
      "date": "2025-04-18",
      "type": "中期复查",
      "summary": "中期复查，左腿活动度有所改善。",
      "data": {
        "运动幅度": [10,9,1,2,3,4,5,6,7,8,9,10],
        "得分": [100,100,1,0,100,1,2,3,5,9,13,66]
      }
    }
  ]
  ```

- **Field description:**

  | 字段       | 类型     |Description|
  |------------|----------|--------------------------|
  | `date`     | string   |Report Date (YYYY-MM-DD)|
  | `type`     | string   |Type of report (e.g. Initial assessment)|
  | `summary`  | string   |Report Summary Description|
  | `data`     | object   |Report data (contains an array of indicators)|
    -  `运动幅度`: `number[]`, 12 indicators
    -  `得分`: `number[]`, 12 scores

- **Sorting description:**
  - By default `date`, interfaces are sorted by field in descending order (newest first).

- **Abnormal response:**


  ```json
  []
  ```

  Returns an empty array when the patient does not have any reports.

---

## Xample patient report data structures


```json
{
  "date": "2025-04-15",
  "type": "初步评估",
  "summary": "初步步态评估，左腿活动度受限。",
  "data": {
    "运动幅度": [100,100,1,0,100,1,2,3,5,9,13,66],
    "得分": [10,9,1,2,3,4,5,6,7,8,9,10]
  }
}
```
---
# Four. CSV data upload interface document

This document describes the RESTful API interface for uploading the IMU data CSV file in the patient management system, following the RESTful API design specification.

---

## Interface overview

| 方法 | 接口路径         |Description|
|------|------------------|----------------------------|
| POST | `/api/upload/csv` |Upload IMU Data CSV File|

---

## 1. Upload IMU Data CSV File

- **Interface path:** `/api/upload/csv`
- **Request method:** `POST`
- **Request Type:** `multipart/form-data`
- Upload the acquired IMU data CSV file **Description** to the backend with the patient ID information. The backend will save and parse the data.

- **Request Parameters:**

| 参数名     | 类型       | 是否必须 |Description|
|------------|------------|----------|-------------------------|
| file       | File       | 是       |CSV file content (IMU data)|
| patientId  | string/int | 是       |Unique identification of the patient|

- **Request example:**


```http
POST /api/upload/csv HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="imu_data_2025-04-24.csv"
Content-Type: text/csv

时间戳,设备ID,设备名称,AccX(g),AccY(g),AccZ(g),GyroX(°/s),GyroY(°/s),GyroZ(°/s),Roll(°),Pitch(°),Yaw(°)
"2025-04-24T10:00:00",001,"IMU_A",0.01,0.02,0.98,0.1,0.1,0.2,10.0,5.0,0.0

------WebKitFormBoundary
Content-Disposition: form-data; name="patientId"

1001
------WebKitFormBoundary--
```

- **Sample response (200 OK):**


```json
{
  "code": 200,
  "message": "CSV 文件上传成功",
  "data": {
    "receivedAt": "2025-04-24T10:30:00.123Z"
  }
}
```

- **Response field description:**

| 字段名     | 类型     |Description|
|------------|----------|--------------------------------|
| code       | number   |Status code, 200 for success|
| message    | string   |Response information|
| data       | object   |Additional data returned|
| └─receivedAt | string |Timestamp of the request received by the backend (in ISO format)|

- **Error response example (400 Bad Request):**


```json
{
  "code": 400,
  "message": "缺少必要参数：file 或 patientId"
}
```

- **Error response example (500 Internal Server Error):**


```json
{
  "code": 500,
  "message": "服务器处理 CSV 文件时出错"
}
```

---

## Interface constraint description

- File must be in `.csv` format.
- Must be provided `patientId` or upload fails.
- The uploaded content must contain at least one row of data (excluding the header).

---

## Interceptor debugging instructions (for front-end development)

The interceptor implemented `window.fetch` in the current system is used for front-end simulation test:

- Intercepts `POST/api/upload/csv` the request and returns a simulated 200 success response.
- The format of the simulated response data is as follows:


```json
{
  "code": 200,
  "message": "模拟：CSV 文件上传成功 (Fetch Interceptor)",
  "data": {
    "receivedAt": "2025-04-24T10:00:00.000Z"
  }
}
```

When used for front-end debugging, it does not need back-end real service, and can directly verify upload logic and user prompts.
# Five. Additional notes

- The time format returned by all interfaces is unified as
- All values are simulation data for testing purposes only
- The API supports local Mock testing through [Mock.js](https://github.com/nuysoft/Mock)
- If there is any doubt about the response structure of an interface, it is recommended to use debugging tools such as Postman and curl tests.
  