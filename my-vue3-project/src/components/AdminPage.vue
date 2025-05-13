/* eslint-disable */ 
<template>
  <div class="admin-container">
    <el-card class="admin-card" shadow="always">
      <template #header>
        <div class="card-header">
          <h2>医生与患者关系管理</h2>
        </div>
      </template>

      <el-divider content-position="left">注册医生</el-divider>
      <el-form :inline="true" :model="registerForm" class="form">
        <el-form-item label="密码">
          <el-input v-model="registerForm.password" type="password" placeholder="医生密码" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="registerForm.name" placeholder="医生姓名" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="registerForm.phone" placeholder="医生电话" />
        </el-form-item>
        <el-form-item label="医院">
          <el-input v-model="registerForm.hospital" placeholder="所属医院" />
        </el-form-item>
        <el-form-item label="科室">
          <el-input v-model="registerForm.department" placeholder="所属科室" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="registerLoading" @click="registerDoctor">注册</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">添加医生-患者关系</el-divider>
      <div class="add-relation-section">
          <div class="add-relation-selector">
              <h3>选择医生</h3>
              <el-form :inline="true" :model="addRelationDoctorSearchCriteria" class="form">
                  <el-form-item label="姓名">
                      <el-input v-model="addRelationDoctorSearchCriteria.name" placeholder="输入医生姓名" clearable size="small"/>
                  </el-form-item>
                  <el-form-item label="电话">
                      <el-input v-model="addRelationDoctorSearchCriteria.phone" placeholder="输入医生电话" clearable size="small"/>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="searchDoctorsForRelation" size="small">搜索医生</el-button>
                  </el-form-item>
              </el-form>
              <el-table :data="addRelationDoctorSearchResults" stripe style="width: 100%; margin-top: 10px;" max-height="200" :show-header="true">
                  <el-table-column prop="name" label="姓名" width="150"></el-table-column>
                  <el-table-column prop="phone" label="电话" width="150"></el-table-column>
                   <el-table-column prop="hospital" label="医院"></el-table-column>
                   <el-table-column prop="department" label="科室"></el-table-column>
                  <el-table-column label="操作" width="80">
                      <template #default="scope">
                          <el-button type="primary" size="small" @click="selectDoctorForRelation(scope.row)">选择</el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <div v-if="selectedDoctorForRelation" style="margin-top: 10px; color: #67c23a;">
                  已选医生: **{{ selectedDoctorForRelation.name }}** ({{ selectedDoctorForRelation.phone }})
              </div>
          </div>

          <div class="add-relation-selector">
              <h3>选择患者</h3>
              <el-form :inline="true" :model="addRelationPatientSearchCriteria" class="form">
                  <el-form-item label="姓名">
                      <el-input v-model="addRelationPatientSearchCriteria.name" placeholder="输入患者姓名" clearable size="small"/>
                  </el-form-item>
                  <el-form-item label="电话">
                      <el-input v-model="addRelationPatientSearchCriteria.phone" placeholder="输入患者电话" clearable size="small"/>
                  </el-form-item>
                   <el-form-item label="性别">
                      <el-input v-model="addRelationPatientSearchCriteria.gender" placeholder="输入患者性别" clearable size="small"/>
                  </el-form-item>
                   <el-form-item label="身份证号">
                      <el-input v-model="addRelationPatientSearchCriteria.idNumber" placeholder="输入患者身份证号" clearable size="small"/>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="searchPatientsForRelation" size="small">搜索患者</el-button>
                  </el-form-item>
              </el-form>
              <el-table :data="addRelationPatientSearchResults" stripe style="width: 100%; margin-top: 10px;" max-height="200" :show-header="true">
                   <el-table-column prop="name" label="姓名" width="150"></el-table-column>
                   <el-table-column prop="phone" label="电话" width="150"></el-table-column>
                   <el-table-column prop="gender" label="性别" width="80"></el-table-column>
                   <el-table-column prop="birthDate" label="出生日期" width="120"></el-table-column>
                   <el-table-column prop="idNumber" label="身份证号"></el-table-column>
                  <el-table-column label="操作" width="80">
                      <template #default="scope">
                          <el-button type="primary" size="small" @click="selectPatientForRelation(scope.row)">选择</el-button>
                      </template>
                  </el-table-column>
              </el-table>
               <div v-if="selectedPatientForRelation" style="margin-top: 10px; color: #67c23a;">
                  已选患者: **{{ selectedPatientForRelation.name }}** ({{ selectedPatientForRelation.phone }})
              </div>
          </div>

          <div style="text-align: center; margin-top: 20px; width: 100%;">
              <el-button
                  type="success"
                  :loading="addRelationLoading"
                  @click="addRelation"
                  :disabled="!selectedDoctorForRelation || !selectedPatientForRelation"
              >
                  确认添加关系
              </el-button>
               <el-button
                   type="info"
                   @click="resetAddRelation"
                   :disabled="!selectedDoctorForRelation && !selectedPatientForRelation && addRelationDoctorSearchResults.length === 0 && addRelationPatientSearchResults.length === 0"
                >
                   重置选择
               </el-button>
          </div>
      </div>


       <el-divider content-position="left">医患关系搜索与列表</el-divider>
       <el-form :inline="true" :model="searchCriteria" class="form">
           <el-form-item label="医生姓名">
               <el-input v-model="searchCriteria.doctorName" placeholder="输入医生姓名" clearable />
           </el-form-item>
            <el-form-item label="医生电话">
               <el-input v-model="searchCriteria.doctorPhone" placeholder="输入医生电话" clearable />
           </el-form-item>
            <el-form-item label="患者姓名">
               <el-input v-model="searchCriteria.patientName" placeholder="输入患者姓名" clearable />
           </el-form-item>
            <el-form-item label="患者电话">
               <el-input v-model="searchCriteria.patientPhone" placeholder="输入患者电话" clearable />
           </el-form-item>
           <el-form-item>
               <el-button type="primary" @click="searchRelations">搜索关系</el-button>
                <el-button @click="resetSearch">重置</el-button>
           </el-form-item>
       </el-form>

      <el-table :data="relations" style="width: 100%" :loading="relationsLoading" key="relationsTable">
         <el-table-column prop="doctorName" label="医生" width="280">
           <template #default="scope">
             <div class="cell-content">
                 <span v-if="editingRelationPair.doctorId !== scope.row.doctorId || editingRelationPair.patientId !== scope.row.patientId">{{ scope.row.doctorName }}</span>
                 <el-select
                   v-else
                   v-model="scope.row.doctorId"
                   placeholder="输入姓名、电话等搜索医生"
                   filterable
                   remote
                   :remote-method="remoteMethodDoctors"
                   :loading="doctorOptionsLoading"
                   @change="handleRelationDoctorChange(scope.row)"
                   style="width: 100%;"
                   size="small"
                 >
                   <el-option
                     v-for="item in doctorOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"
                   ></el-option>
                 </el-select>
             </div>
           </template>
         </el-table-column>
         <el-table-column prop="patientName" label="患者" width="280">
           <template #default="scope">
             <div class="cell-content">
                <span v-if="editingRelationPair.doctorId !== scope.row.doctorId || editingRelationPair.patientId !== scope.row.patientId">{{ scope.row.patientName }}</span>
                <el-select
                   v-else
                  v-model="scope.row.patientId"
                  placeholder="输入姓名、电话等搜索患者"
                  filterable
                  remote
                  :remote-method="remoteMethodPatients"
                  :loading="patientOptionsLoading"
                   @change="handleRelationPatientChange(scope.row)"
                  style="width: 100%;"
                  size="small"
                >
                  <el-option
                    v-for="item in patientOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
             </div>
           </template>
         </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
             <template v-if="editingRelationPair.doctorId !== scope.row.doctorId || editingRelationPair.patientId !== scope.row.patientId">
                <el-button size="small" type="primary" @click="startEditingRelation(scope.row)">编辑</el-button>
                 <el-button size="small" type="danger" :loading="deleteLoading[`${scope.row.doctorId}-${scope.row.patientId}`]" @click="deleteRelation(scope.$index, scope.row)">删除</el-button>
             </template>
             <template v-else>
                 <el-button size="small" type="success" :loading="updateLoading[`${scope.row.doctorId}-${scope.row.patientId}`]" @click="updateRelation(scope.$index, scope.row)">保存</el-button>
                <el-button size="small" type="info" @click="cancelEditingRelation(scope.row)">取消</el-button>
             </template>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="relationsPagination.total > 0"
        @size-change="handleRelationsSizeChange"
        @current-change="handleRelationsCurrentChange"
        :current-page="relationsPagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="relationsPagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="relationsPagination.total"
        style="margin-top: 20px; text-align: right;"
      />


      <el-divider content-position="left" style="margin-top: 30px;">已注册医生账户</el-divider>
      <el-form :inline="true" :model="doctorSearchCriteria" class="form">
           <el-form-item label="姓名">
               <el-input v-model="doctorSearchCriteria.name" placeholder="输入医生姓名" clearable />
           </el-form-item>
            <el-form-item label="电话">
               <el-input v-model="doctorSearchCriteria.phone" placeholder="输入医生电话" clearable />
           </el-form-item>
            <el-form-item label="医院">
               <el-input v-model="doctorSearchCriteria.hospital" placeholder="输入医生医院" clearable />
           </el-form-item>
            <el-form-item label="科室">
               <el-input v-model="doctorSearchCriteria.department" placeholder="输入医生科室" clearable />
           </el-form-item>
           <el-form-item>
               <el-button type="primary" @click="searchDoctorsTable">搜索医生</el-button>
               <el-button @click="resetDoctorSearch">重置</el-button>
           </el-form-item>
       </el-form>

      <el-table :data="doctors" style="width: 100%" :loading="doctorsLoading" key="doctorsTable" id="doctorsTable">
        <el-table-column prop="name" label="姓名" width="150">
            <template #default="scope">
              <div class="cell-content">
                 <span v-if="editingDoctorId !== scope.row.id">{{ scope.row.name }}</span>
                 <el-input v-else v-model="scope.row.name" size="small"></el-input>
              </div>
            </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="150">
             <template #default="scope">
               <div class="cell-content">
                 <span v-if="editingDoctorId !== scope.row.id">{{ scope.row.phone }}</span>
                 <el-input v-else v-model="scope.row.phone" size="small"></el-input>
               </div>
            </template>
        </el-table-column>
        <el-table-column prop="hospital" label="医院" width="200">
             <template #default="scope">
               <div class="cell-content">
                 <span v-if="editingDoctorId !== scope.row.id">{{ scope.row.hospital }}</span>
                 <el-input v-else v-model="scope.row.hospital" size="small"></el-input>
               </div>
            </template>
        </el-table-column>
        <el-table-column prop="department" label="科室" width="150">
             <template #default="scope">
               <div class="cell-content">
                 <span v-if="editingDoctorId !== scope.row.id">{{ scope.row.department }}</span>
                 <el-input v-else v-model="scope.row.department" size="small"></el-input>
               </div>
            </template>
        </el-table-column>
         <el-table-column label="操作" width="200">
           <template #default="scope">
             <template v-if="editingDoctorId !== scope.row.id">
                <el-button size="small" type="primary" @click="startEditingDoctor(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" :loading="deleteLoading[scope.row.id]" @click="deleteDoctor(scope.$index, scope.row)">删除</el-button>
             </template>
              <template v-else>
                <el-button size="small" type="success" :loading="updateLoading[scope.row.id]" @click="updateDoctor(scope.$index, scope.row)">保存</el-button>
                <el-button size="small" type="info" @click="cancelEditingDoctor(scope.row)">取消</el-button>
             </template>
           </template>
         </el-table-column>
      </el-table>

      <el-pagination
        v-if="doctorsPagination.total > 0"
        @size-change="handleDoctorsSizeChange"
        @current-change="handleDoctorsCurrentChange"
        :current-page="doctorsPagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="doctorsPagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="doctorsPagination.total"
        style="margin-top: 20px; text-align: right;"
      />

       <el-divider content-position="left" style="margin-top: 30px;">患者管理</el-divider>
        <el-form :inline="true" :model="patientSearchCriteria" class="form">
           <el-form-item label="姓名">
               <el-input v-model="patientSearchCriteria.name" placeholder="输入患者姓名" clearable />
           </el-form-item>
            <el-form-item label="电话">
               <el-input v-model="patientSearchCriteria.phone" placeholder="输入患者电话" clearable />
           </el-form-item>
            <el-form-item label="性别">
               <el-input v-model="patientSearchCriteria.gender" placeholder="输入患者性别" clearable />
           </el-form-item>
            <el-form-item label="身份证号">
               <el-input v-model="patientSearchCriteria.idNumber" placeholder="输入患者身份证号" clearable />
           </el-form-item>
           <el-form-item>
               <el-button type="primary" @click="searchPatientsTable">搜索患者</el-button>
               <el-button @click="resetPatientSearch">重置</el-button>
           </el-form-item>
       </el-form>

       <el-table :data="patientsData" style="width: 100%" :loading="patientsLoading" key="patientsTable" id="patientsTable">
            <el-table-column prop="name" label="姓名" width="150">
                <template #default="scope">
                   <div class="cell-content">
                    <span v-if="editingPatientId !== scope.row.id">{{ scope.row.name }}</span>
                    <el-input v-else v-model="scope.row.name" size="small"></el-input>
                   </div>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话" width="150">
                <template #default="scope">
                  <div class="cell-content">
                    <span v-if="editingPatientId !== scope.row.id">{{ scope.row.phone }}</span>
                    <el-input v-else v-model="scope.row.phone" size="small"></el-input>
                  </div>
                </template>
            </el-table-column>
            <el-table-column prop="gender" label="性别" width="80" align="center">
                <template #default="scope">
                   <div class="cell-content">
                    <span v-if="editingPatientId !== scope.row.id">{{ scope.row.gender }}</span>
                    <el-input v-else v-model="scope.row.gender" size="small"></el-input>
                   </div>
                </template>
            </el-table-column>
            <el-table-column prop="birthDate" label="出生日期" width="150">
                <template #default="scope">
                   <div class="cell-content">
                    <span v-if="editingPatientId !== scope.row.id">{{ scope.row.birthDate }}</span>
                     <el-input v-else v-model="scope.row.birthDate" size="small" placeholder="YYYY-MM-DD"></el-input>
                   </div>
                </template>
            </el-table-column>
             <el-table-column prop="idNumber" label="身份证号" width="200">
                <template #default="scope">
                   <div class="cell-content">
                    <span v-if="editingPatientId !== scope.row.id">{{ scope.row.idNumber }}</span>
                    <el-input v-else v-model="scope.row.idNumber" size="small"></el-input>
                   </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                 <template v-if="editingPatientId !== scope.row.id">
                    <el-button size="small" type="primary" @click="startEditingPatient(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" :loading="deleteLoading[scope.row.id]" @click="deletePatient(scope.$index, scope.row)">删除</el-button>
                 </template>
                  <template v-else>
                    <el-button size="small" type="success" :loading="updateLoading[scope.row.id]" @click="updatePatient(scope.$index, scope.row)">保存</el-button>
                    <el-button size="small" type="info" @click="cancelEditingPatient(scope.row)">取消</el-button>
                 </template>
              </template>
            </el-table-column>
       </el-table>

        <el-pagination
            v-if="patientsPagination.total > 0"
            @size-change="handlePatientsSizeChange"
            @current-change="handlePatientsCurrentChange"
            :current-page="patientsPagination.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="patientsPagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="patientsPagination.total"
            style="margin-top: 20px; text-align: right;"
        />


    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import debounce from 'lodash/debounce';


// ✅ 临时禁用身份认证和权限模拟，该变量不再用于权限判断，但保留以避免其他 potential issues if it was used elsewhere
// const currentMockUserId = ref('1'); // '1' for admin, '101' for doctor 王晓东, etc.
// console.log(`当前模拟用户ID: ${currentMockUserId.value}`); // 可以在控制台查看当前模拟的用户ID

// ✅ 辅助函数：获取 Mock 请求头 - 暂时返回空对象，不再发送模拟用户ID
const getMockAuthHeaders = () => {
    return {
        // 'X-Mock-User-Id': currentMockUserId.value, // 注释掉，不再发送模拟用户ID
    };
};


// 关系列表数据和分页状态
const relations = ref([]);
const relationsPagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
const relationsLoading = ref(false);

// 医生列表数据和分页状态 (用于展示表格)
const doctors = ref([]);
const doctorsPagination = reactive({
   currentPage: 1,
   pageSize: 20,
   total: 0,
});
const doctorsLoading = ref(false);

// 患者列表数据和分页状态 (用于展示表格)
const patientsData = ref([]);
const patientsPagination = reactive({
   currentPage: 1,
   pageSize: 20,
   total: 0,
});
const patientsLoading = ref(false);


// 用于医生下拉选择框的远程搜索结果 (保留用于关系列表编辑)
const doctorOptions = ref([]);
const doctorOptionsLoading = ref(false);

// 用于患者下拉选择框的远程搜索结果 (保留用于关系列表编辑)
const patientOptions = ref([]);
const patientOptionsLoading = ref(false);


const registerForm = reactive({
  name: "",
  password: "",
  phone: "",
  hospital: "",
  department: ""
});

const registerLoading = ref(false);
const addRelationLoading = ref(false);

// 使用对象来跟踪每行的loading状态，key为行的唯一标识
// 使用组合键 doctorId-patientId 作为 key (用于关系列表)
const updateLoading = ref({}); // 用于管理每行更新按钮的loading状态
const deleteLoading = ref({}); // 用于管理每行删除按钮的loading状态

// 跟踪当前正在编辑的关系的 doctorId 和 patientId 对
const editingRelationPair = reactive({ doctorId: null, patientId: null });

// 这些变量是用于医生和患者表格的编辑状态，保留
const editingDoctorId = ref(null);
const editingPatientId = ref(null);


// 存储编辑前的原始数据，用于取消时恢复 (为不同表格分开存储)
// 存储关系的 doctorId 和 patientId 等关键信息
const originalRelationEditingRow = reactive({});
const originalDoctorEditingRow = reactive({});
const originalPatientEditingRow = reactive({});

// 医患关系搜索条件 (用于关系列表)
const searchCriteria = reactive({
    doctorName: '',
    doctorPhone: '',
    patientName: '',
    patientPhone: ''
});

// 医生搜索条件 (用于医生表格)
const doctorSearchCriteria = reactive({
    name: '',
    phone: '',
    hospital: '',
    department: ''
});

// 患者搜索条件 (用于患者表格)
const patientSearchCriteria = reactive({
    name: '',
    phone: '',
    gender: '',
    idNumber: ''
});


// 添加关系区域的搜索条件和结果
const addRelationDoctorSearchCriteria = reactive({
    name: '',
    phone: ''
});
const addRelationDoctorSearchResults = ref([]);

const addRelationPatientSearchCriteria = reactive({
    name: '',
    phone: '',
    gender: '',
    idNumber: ''
});
const addRelationPatientSearchResults = ref([]);

// 添加关系区域选中的医生和患者
const selectedDoctorForRelation = ref(null);
const selectedPatientForRelation = ref(null);


// --- 数据获取函数（主要用于表格分页和搜索） ---

// 获取医生患者关系列表（带分页和搜索条件）
const fetchRelations = async (criteria = searchCriteria) => {
  relationsLoading.value = true;
  try {
    const params = {
        page: relationsPagination.currentPage,
        pageSize: relationsPagination.pageSize,
        ...criteria // 搜索条件
    };
     // 不再发送 Mock 认证头，因为后端暂时忽略
    const response = await axios.get('/api/admin/relations', { params, headers: getMockAuthHeaders() });
    if (response.data && response.data.status === 200) {
      // Mock 返回的关系对象没有 id
      relations.value = response.data.data;
      relationsPagination.total = response.data.total;
    } else {
      ElMessage.error(response.data.message || "加载关系失败！");
       relations.value = [];
       relationsPagination.total = 0;
    }
  } catch (error) {
    console.error("加载关系失败:", error);
    ElMessage.error("加载关系失败，请检查网络或服务器！");
     relations.value = [];
     relationsPagination.total = 0;
  } finally {
    relationsLoading.value = false;
  }
};

// 触发关系搜索的方法
const searchRelations = () => {
    relationsPagination.currentPage = 1; // 从第一页开始搜索
    fetchRelations(searchCriteria);
};

// 重置关系搜索条件并刷新列表
const resetSearch = () => {
    Object.assign(searchCriteria, {
        doctorName: '',
        doctorPhone: '',
        patientName: '',
        patientPhone: ''
    });
    relationsPagination.currentPage = 1;
    fetchRelations(searchCriteria);
};


// 获取医生列表（带分页和搜索，用于展示表格）
const fetchDoctors = async (criteria = doctorSearchCriteria) => {
  doctorsLoading.value = true;
  try {
    const params = {
         page: doctorsPagination.currentPage,
         pageSize: doctorsPagination.pageSize,
          // 将搜索条件添加到请求参数中
         ...criteria
    };
    // 不再发送 Mock 认证头
    const response = await axios.get('/api/admin/doctors', { params, headers: getMockAuthHeaders() });
    if (response.data && response.data.status === 200) {
      doctors.value = response.data.data;
      doctorsPagination.total = response.data.total;
    } else {
      ElMessage.error(response.data.message || "加载医生列表失败！");
       doctors.value = [];
       doctorsPagination.total = 0;
    }
  } catch (error) {
    console.error("加载医生列表失败:", error);
    ElMessage.error("加载医生列表失败，请检查网络或服务器！");
     doctors.value = [];
     doctorsPagination.total = 0;
  } finally {
    doctorsLoading.value = false;
  }
};

// 触发医生表格搜索的方法
const searchDoctorsTable = () => {
    doctorsPagination.currentPage = 1; // 从第一页开始搜索
    fetchDoctors(doctorSearchCriteria);
};

// 重置医生表格搜索条件并刷新列表
const resetDoctorSearch = () => {
     Object.assign(doctorSearchCriteria, { // 重置搜索条件对象
        name: '',
        phone: '',
        hospital: '',
        department: ''
    });
    doctorsPagination.currentPage = 1; // 重置页码
    fetchDoctors(doctorSearchCriteria);
};


// 获取患者列表（带分页和搜索，用于展示表格）
const fetchPatients = async (criteria = patientSearchCriteria) => {
    patientsLoading.value = true;
    try {
        const params = {
            page: patientsPagination.currentPage,
            pageSize: patientsPagination.pageSize,
            ...criteria // 搜索条件
        };
        // 调用 GET /api/admin/patients 接口
         // 不再发送 Mock 认证头
        const response = await axios.get('/api/admin/patients', { params, headers: getMockAuthHeaders() });
        if (response.data && response.data.status === 200) {
            patientsData.value = response.data.data;
            patientsPagination.total = response.data.total;
        } else {
            ElMessage.error(response.data.message || "加载患者列表失败！");
            patientsData.value = [];
            patientsPagination.total = 0;
        }
    } catch (error) {
        console.error("加载患者列表失败:", error);
        ElMessage.error("加载患者列表失败，请检查网络或服务器！");
        patientsData.value = [];
        patientsPagination.total = 0;
    } finally {
        patientsLoading.value = false;
    }
};

// 触发患者表格搜索的方法
const searchPatientsTable = () => {
    patientsPagination.currentPage = 1; // 从第一页开始搜索
    fetchPatients(patientSearchCriteria);
};

// 重置患者表格搜索条件并刷新列表
const resetPatientSearch = () => {
     Object.assign(patientSearchCriteria, { // 重置搜索条件对象
        name: '',
        phone: '',
        gender: '',
        idNumber: ''
    });
    patientsPagination.currentPage = 1; // 重置页码
    fetchPatients(patientSearchCriteria);
};


// --- 远程搜索函数（用于关系列表编辑时的下拉选择） ---
// 这些函数仍然保留，用于关系列表编辑时切换医生/患者
const remoteMethodDoctors = debounce(async (query) => {
  if (query) {
    doctorOptionsLoading.value = true;
    try {
      // 这里仍然使用 /search 接口，因为它返回适合下拉框的少量 id/name 数据
       // 不再发送 Mock 认证头
      const response = await axios.get('/api/admin/doctors/search', { params: { query }, headers: getMockAuthHeaders() });
      if (response.data && response.data.status === 200) {
         // 为了在编辑时显示已选中的名称，需要确保当前选中的 doctorId 对应的 {id, name} 在 options 里
         // 查找当前编辑行的医生ID和名称
         const currentDoctorIdInRelation = editingRelationPair.doctorId;
         const currentRelation = relations.value.find(r => r.doctorId === currentDoctorIdInRelation && r.patientId === editingRelationPair.patientId);
         const currentDoctorNameInRelation = currentRelation ? currentRelation.doctorName : null;


         let options = response.data.data.map(item => ({ id: item.id, name: item.name }));

         // 如果当前选中项不在搜索结果中，尝试通过当前编辑的关系ID找到名称并添加到选项列表
         // 💡 这里逻辑可以简化，直接通过当前行的 doctorId 去 findUserById 找到名字加入选项
         // 但目前 Mock.js 不方便直接调 findUserById，保留此逻辑
         if (currentDoctorIdInRelation && currentDoctorNameInRelation && !options.some(opt => opt.id === currentDoctorIdInRelation)) {
             options.push({ id: currentDoctorIdInRelation, name: currentDoctorNameInRelation });
         }
         doctorOptions.value = options;

      } else {
        ElMessage.error(response.data.message || "搜索医生失败！");
        doctorOptions.value = [];
      }
    } catch (error) {
      console.error("搜索医生失败:", error);
      ElMessage.error("搜索医生失败，请检查网络或服务器！");
      doctorOptions.value = [];
    } finally {
      doctorOptionsLoading.value = false;
    }
  } else {
      // 清空搜索词时，清空选项
    doctorOptions.value = [];
  }
}, 300);

const remoteMethodPatients = debounce(async (query) => {
  if (query) {
    patientOptionsLoading.value = true;
    try {
       // 这里仍然使用 /search 接口
        // 不再发送 Mock 认证头
      const response = await axios.get('/api/admin/patients/search', { params: { query }, headers: getMockAuthHeaders() });
      if (response.data && response.data.status === 200) {
        // 为了在编辑时显示已选中的名称，需要确保当前选中的 patientId 对应的 {id, name} 在 options 里
         // 查找当前编辑行的患者ID和名称
         const currentPatientIdInRelation = editingRelationPair.patientId;
         const currentRelation = relations.value.find(rel => rel.doctorId === editingRelationPair.doctorId && rel.patientId === editingRelationPair.patientId);
         const currentPatientNameInRelation = currentRelation ? currentRelation.patientName : null;


         let options = response.data.data.map(item => ({ id: item.id, name: item.name }));

          // 💡 这里的逻辑也可以简化，直接通过当前行的 patientId 去 findUserById 找到名字加入选项
          // 但目前 Mock.js 不方便直接调 findUserById，保留此逻辑
          if (currentPatientIdInRelation && currentPatientNameInRelation && !options.some(opt => opt.id === currentPatientIdInRelation)) {
             options.push({ id: currentPatientIdInRelation, name: currentPatientNameInRelation });
         }
         patientOptions.value = options;

      } else {
        ElMessage.error(response.data.message || "搜索患者失败！");
        patientOptions.value = [];
      }
    } catch (error) {
      console.error("搜索患者失败:", error);
      ElMessage.error("搜索患者失败，请检查网络或服务器！");
      patientOptions.value = [];
    } finally {
     patientOptionsLoading.value = false;
    }
  } else {
     patientOptions.value = [];
  }
}, 300);


// --- 分页事件处理 ---

// 关系列表分页尺寸改变 - 搜索时也需要保留搜索条件
const handleRelationsSizeChange = (newSize) => {
  relationsPagination.pageSize = newSize;
  relationsPagination.currentPage = 1;
  fetchRelations(searchCriteria);
};

// 关系列表当前页改变 - 搜索时也需要保留搜索条件
const handleRelationsCurrentChange = (newPage) => {
  relationsPagination.currentPage = newPage;
  fetchRelations(searchCriteria);
};

// 医生列表分页尺寸改变 - 搜索时也需要保留搜索条件
const handleDoctorsSizeChange = (newSize) => {
  doctorsPagination.pageSize = newSize;
  doctorsPagination.currentPage = 1;
  fetchDoctors(doctorSearchCriteria); // 搜索时保留条件
};

// 医生列表当前页改变 - 搜索时也需要保留搜索条件
const handleDoctorsCurrentChange = (newPage) => {
  doctorsPagination.currentPage = newPage;
  fetchDoctors(doctorSearchCriteria); // 搜索时保留条件
};

// 患者列表分页尺寸改变 - 搜索时也需要保留搜索条件
const handlePatientsSizeChange = (newSize) => {
  patientsPagination.pageSize = newSize;
  patientsPagination.currentPage = 1;
  fetchPatients(patientSearchCriteria); // 搜索时保留条件
};

// 患者列表当前页改变 - 搜索时也需要保留搜索条件
const handlePatientsCurrentChange = (newPage) => {
  patientsPagination.currentPage = newPage;
  fetchPatients(patientSearchCriteria); // 搜索时保留条件
};


// --- 业务操作函数 ---

// 注册医生
const registerDoctor = async () => {
  if (!registerForm.password || !registerForm.name || !registerForm.phone || !registerForm.hospital || !registerForm.department) {
    ElMessage.warning("所有字段均不能为空！");
    return;
  }
  registerLoading.value = true;
  try {
    // 不再发送 Mock 认证头
    const response = await axios.post('/api/admin/doctors', registerForm, { headers: getMockAuthHeaders() });
    if (response.data && response.data.status === 201) {
      ElMessage.success("医生注册成功！");
      doctorsPagination.currentPage = 1;
      fetchDoctors(doctorSearchCriteria); // 注册成功后刷新列表并保留搜索条件
      Object.assign(registerForm, { password: "", name: "", phone: "", hospital: "", department: "" });
    } else if (response.data && response.data.status === 409) {
      ElMessage.warning(response.data.message || "用户名已存在！");
    } else {
       ElMessage.error(response.data.message || "医生注册失败！");
    }
  } catch (error) {
    console.error("医生注册失败:", error);
    ElMessage.error("医生注册失败，请检查网络或服务器！");
  } finally {
    registerLoading.value = false;
  }
};

// 添加医生患者关系
const addRelation = async () => {
  // 检查是否已选择医生和患者
  if (!selectedDoctorForRelation.value || !selectedPatientForRelation.value) {
    ElMessage.warning("请先选择医生和患者！");
    return;
  }

  addRelationLoading.value = true;
  try {
    // 使用选中的医生和患者的 ID
    // 不再发送 Mock 认证头
    const response = await axios.post('/api/admin/relations', {
        doctorId: selectedDoctorForRelation.value.id,
        patientId: selectedPatientForRelation.value.id
     }, { headers: getMockAuthHeaders() });

    if (response.data && response.data.status === 201) {
      ElMessage.success("关系添加成功！");
      relationsPagination.currentPage = 1; // 添加成功后刷新第一页
      fetchRelations(searchCriteria); // 刷新时保留搜索条件
      resetAddRelation(); // 添加成功后重置添加关系区域
    } else {
      ElMessage.error(response.data.message || "添加关系失败！");
    }
  } catch (error) {
    console.error("添加关系失败:", error);
    ElMessage.error("添加关系失败，请检查网络或服务器！");
  } finally {
    addRelationLoading.value = false;
  }
};

// 搜索医生（用于添加关系区域）
const searchDoctorsForRelation = async () => {
    addRelationDoctorSearchResults.value = []; // 清空上次结果
    selectedDoctorForRelation.value = null; // 清空已选医生

    // 检查是否有搜索条件，避免无条件搜索全量数据
    const criteria = addRelationDoctorSearchCriteria;
    if (!criteria.name && !criteria.phone) {
         ElMessage.warning("请输入搜索条件！");
         return;
    }

    // 调用 GET /api/admin/doctors 接口 (带搜索参数)
     try {
         const params = { page: 1, pageSize: 10, ...criteria }; // 限定结果数量
          // 不再发送 Mock 认证头
         const response = await axios.get('/api/admin/doctors', { params, headers: getMockAuthHeaders() });
         if (response.data && response.data.status === 200) {
             // 只取 data数组，用于展示搜索结果列表
             addRelationDoctorSearchResults.value = response.data.data;
             if (response.data.total === 0) {
                 ElMessage.info("未找到匹配的医生。");
             }
         } else {
              ElMessage.error(response.data.message || "搜索医生失败！");
         }
     } catch (error) {
         console.error("搜索医生失败:", error);
         ElMessage.error("搜索医生失败，请检查网络或服务器！");
     }
};

// 选择医生（用于添加关系区域）
const selectDoctorForRelation = (doctor) => {
    selectedDoctorForRelation.value = doctor;
    // addRelationDoctorSearchResults.value = []; // 选择后不清空结果，方便用户反悔
    // Optionally reset search criteria: Object.assign(addRelationDoctorSearchCriteria, { name: '', phone: '' });
    ElMessage.success(`已选择医生: ${doctor.name}`);
};

// 搜索患者（用于添加关系区域）
const searchPatientsForRelation = async () => {
    addRelationPatientSearchResults.value = []; // 清空上次结果
    selectedPatientForRelation.value = null; // 清空已选患者

     // 检查是否有搜索条件
    const criteria = addRelationPatientSearchCriteria;
     if (!criteria.name && !criteria.phone && !criteria.gender && !criteria.idNumber) {
         ElMessage.warning("请输入搜索条件！");
         return;
    }

    // 调用 GET /api/admin/patients 接口 (带搜索参数)
    // 同样调用获取患者列表的接口，并传入搜索条件，只取第一页
     try {
         const params = { page: 1, pageSize: 10, ...criteria }; // 限定结果数量
          // 不再发送 Mock 认证头
         const response = await axios.get('/api/admin/patients', { params, headers: getMockAuthHeaders() });
         if (response.data && response.data.status === 200) {
             // 只取 data数组，用于展示搜索结果列表
             addRelationPatientSearchResults.value = response.data.data;
              if (response.data.total === 0) {
                 ElMessage.info("未找到匹配的患者。");
             }
         } else {
              ElMessage.error(response.data.message || "搜索患者失败！");
         }
     } catch (error) {
         console.error("搜索患者失败:", error);
         ElMessage.error("搜索患者失败，请检查网络或服务器！");
     }
};

// 选择患者（用于添加关系区域）
const selectPatientForRelation = (patient) => {
    selectedPatientForRelation.value = patient;
    // addRelationPatientSearchResults.value = []; // 选择后不清空结果
    // Optionally reset search criteria: Object.assign(addRelationPatientSearchCriteria, { name: '', phone: '', gender: '', idNumber: '' });
     ElMessage.success(`已选择患者: ${patient.name}`);
};

// 重置添加关系区域的选择和搜索
const resetAddRelation = () => {
    selectedDoctorForRelation.value = null;
    selectedPatientForRelation.value = null;
    addRelationDoctorSearchResults.value = [];
    addRelationPatientSearchResults.value = [];
    Object.assign(addRelationDoctorSearchCriteria, { name: '', phone: '' });
    Object.assign(addRelationPatientSearchCriteria, { name: '', phone: '', gender: '', idNumber: '' });
    ElMessage.info("已重置医患选择。");
};


// 开始编辑关系行
// 接受整个行对象
const startEditingRelation = (row) => {
    // 使用 doctorId 和 patientId 对来标识正在编辑的关系
    editingRelationPair.doctorId = row.doctorId;
    editingRelationPair.patientId = row.patientId;

    // 存储原始行的关键数据，用于取消时恢复
    Object.assign(originalRelationEditingRow, {
        doctorId: row.doctorId,
        patientId: row.patientId,
        doctorName: row.doctorName,
        patientName: row.patientName
        // 如果关系对象有其他字段，也需要在这里存储
    });

    // 在开始编辑关系时，预加载当前医生和患者到远程搜索的 options 中
    // 这样即使不搜索，下拉框也能显示当前选中的医生/患者名称
     if (row.doctorId && row.doctorName) {
         doctorOptions.value = [{ id: row.doctorId, name: row.doctorName }];
     } else {
         doctorOptions.value = [];
     }
     if (row.patientId && row.patientName) {
         patientOptions.value = [{ id: row.patientId, name: row.patientName }];
     } else {
         patientOptions.value = [];
     }
};

// 取消编辑关系行
// 接受整个行对象，通过这对ID找到原始数据并恢复
// eslint-disable-next-line
const cancelEditingRelation = (row) => {
     // 在 relations 列表中找到当前正在编辑的行（通过组合ID查找）
     // 注意：这里需要根据原始ID来查找，因为当前行的ID可能已经被修改了
     const index = relations.value.findIndex(rel =>
         rel.doctorId === originalRelationEditingRow.doctorId && rel.patientId === originalRelationEditingRow.patientId
     );

     if (index !== -1) {
        // 恢复原始数据到当前行
        Object.assign(relations.value[index], originalRelationEditingRow);
     }

    stopEditingRelation();
};

// 更新关系
// 接受整个行对象
const updateRelation = async (index, row) => {
  // 检查新的医生和患者ID是否有效
  if (!row.doctorId || !row.patientId) {
    ElMessage.warning("请选择医生和患者！");
    return;
  }

  // 获取旧的医生和患者ID (从开始编辑时存储的原始数据中获取)
  const oldDoctorId = originalRelationEditingRow.doctorId;
  const oldPatientId = originalRelationEditingRow.patientId;
  const newDoctorId = row.doctorId; // New ID is taken directly from the row being edited
  const newPatientId = row.patientId; // New ID is taken directly from the row being edited

   // 如果新旧 ID 对完全一致，则没有修改，直接停止编辑
   if (oldDoctorId === newDoctorId && oldPatientId === newPatientId) {
       ElMessage.info("关系信息未更改");
       stopEditingRelation();
       return;
   }


  // 准备更新请求体
  const updatedData = {
      oldDoctorId: oldDoctorId,
      oldPatientId: oldPatientId,
      newDoctorId: newDoctorId,
      newPatientId: newPatientId
  };

  // 使用组合键作为 loading key
  const loadingKey = `${oldDoctorId}-${oldPatientId}`; // 使用旧的 ID 对作为 key，因为这是唯一标识这条关系的原始 key
  updateLoading.value = { ...updateLoading.value, [loadingKey]: true };

  try {
    // 调用 PUT /api/admin/relations 接口
     // 不再发送 Mock 认证头
    const response = await axios.put('/api/admin/relations', updatedData, { headers: getMockAuthHeaders() });
    if (response.data && response.data.status === 200) {
      ElMessage.success("关系修改成功！");
       // 刷新列表以获取最新数据（Mock可能直接返回更新后的数据，但刷新更保险）
       fetchRelations(searchCriteria); // 刷新时保留搜索条件
       stopEditingRelation(); // 停止编辑状态
    } else {
      ElMessage.error(response.data.message || "修改失败！");
       // 如果修改失败，可以考虑恢复原始数据，或者提示用户手动取消
       // 为了简化，这里只提示失败，用户可以手动点击取消
    }
  } catch (error) {
    console.error("修改关系失败:", error);
    ElMessage.error("修改失败，请检查网络或服务器！");
  } finally {
     updateLoading.value[loadingKey] = false; // 停止 loading
  }
};

// 停止编辑关系行
const stopEditingRelation = () => {
    // 重置编辑中的关系对
    editingRelationPair.doctorId = null;
    editingRelationPair.patientId = null;
     // 清空 originalEditingRow
    for (const key in originalRelationEditingRow) {
        delete originalRelationEditingRow[key];
    }
     // 清空关系列表编辑时的搜索结果
    doctorOptions.value = [];
    patientOptions.value = [];
};


// 删除关系
// 接受整个行对象
const deleteRelation = async (index, row) => {
   const relationToDelete = row; // 行对象包含了 doctorId 和 patientId

    // 使用组合键作为 loading key
    const loadingKey = `${relationToDelete.doctorId}-${relationToDelete.patientId}`;

  ElMessageBox.confirm(`确定要删除医生 "${relationToDelete.doctorName}" 和患者 "${relationToDelete.patientName}" 的关系吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    deleteLoading.value = { ...deleteLoading.value, [loadingKey]: true }; // Use combination key
    try {
      // 调用 DELETE /api/admin/relations/:doctorId/:patientId 接口
       // 不再发送 Mock 认证头
      const response = await axios.delete(`/api/admin/relations/${relationToDelete.doctorId}/${relationToDelete.patientId}`, { headers: getMockAuthHeaders() });
      if (response.data && response.data.status === 204) { // 204 No Content
        ElMessage.success("删除成功！");
        // 删除成功后，刷新当前页的关系列表，注意删除最后一页唯一一项的情况
        if (relations.value.length === 1 && relationsPagination.currentPage > 1) {
             relationsPagination.currentPage--;
        }
        fetchRelations(searchCriteria); // 刷新时保留搜索条件

      } else {
         const errorMessage = response.data && response.data.message ? response.data.message : "删除失败！";
         ElMessage.error(errorMessage);
      }
    } catch (error) {
      console.error("删除关系失败:", error);
      ElMessage.error("删除失败，请检查网络或服务器！");
    } finally {
       deleteLoading.value[loadingKey] = false; // Stop loading
    }
  }).catch(() => {
      // 用户取消删除
  });
};

// 开始编辑医生行
const startEditingDoctor = (row) => {
    editingDoctorId.value = row.id;
    Object.assign(originalDoctorEditingRow, JSON.parse(JSON.stringify(row)));
};

// 取消编辑医生行
/* eslint-disable */ 
const cancelEditingDoctor = (row) => {
     // 根据 id 查找原始数据并恢复
     const index = doctors.value.findIndex(doc => doc.id === originalDoctorEditingRow.id);
     if (index !== -1) {
        Object.assign(doctors.value[index], originalDoctorEditingRow);
    }
    stopEditingDoctor();
};

// 更新医生
const updateDoctor = async (index, row) => {
    // 可以根据需要添加字段校验，例如检查电话号码格式
    const updatedData = {
        name: row.name,
        phone: row.phone,
        hospital: row.hospital,
        department: row.department,
        // password: row.password, // 如果允许修改密码，需要加入此字段
    };
    // 💡 可选：检查哪些字段实际被修改了，只发送修改的字段

    updateLoading.value = { ...updateLoading.value, [row.id]: true }; // Use row.id as key
     try {
         // 不再发送 Mock 认证头
        const response = await axios.put(`/api/admin/doctors/${row.id}`, updatedData, { headers: getMockAuthHeaders() });
         if (response.data && response.data.status === 200) {
             ElMessage.success("医生信息更新成功！");
              // 刷新医生列表，保留搜索条件
             fetchDoctors(doctorSearchCriteria);
             stopEditingDoctor();
         } else {
              ElMessage.error(response.data.message || "医生信息更新失败！");
         }
     } catch (error) {
         console.error("更新医生信息失败:", error);
         ElMessage.error("更新医生信息失败，请检查网络或服务器！");
     } finally {
         updateLoading.value[row.id] = false;
     }
};

// 删除医生
const deleteDoctor = async (index, row) => {
     const doctorToDelete = row;

      ElMessageBox.confirm(`确定要删除医生 "${doctorToDelete.name}" 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        deleteLoading.value = { ...deleteLoading.value, [row.id]: true }; // Use row.id as key
        try {
             // 不再发送 Mock 认证头
            const response = await axios.delete(`/api/admin/doctors/${doctorToDelete.id}`, { headers: getMockAuthHeaders() });
             if (response.data && response.data.status === 204) { // 204 No Content
                ElMessage.success("医生删除成功！");
                // 刷新医生列表，保留搜索条件，注意删除最后一页唯一一项的情况
                 if (doctors.value.length === 1 && doctorsPagination.currentPage > 1) {
                     doctorsPagination.currentPage--;
                 }
                 fetchDoctors(doctorSearchCriteria);
             } else {
                 const errorMessage = response.data && response.data.message ? response.data.message : "医生删除失败！";
                 ElMessage.error(errorMessage);
             }
        } catch (error) {
            console.error("删除医生失败:", error);
            ElMessage.error("删除医生失败，请检查网络或服务器！");
        } finally {
             deleteLoading.value[row.id] = false;
        }
      }).catch(() => {
          // User canceled deletion
      });
};


// 停止编辑医生行
const stopEditingDoctor = () => {
     editingDoctorId.value = null;
      for (const key in originalDoctorEditingRow) {
        delete originalDoctorEditingRow[key];
    }
};


// 开始编辑患者行
const startEditingPatient = (row) => {
    editingPatientId.value = row.id;
    Object.assign(originalPatientEditingRow, JSON.parse(JSON.stringify(row)));
};

// 取消编辑患者行
const cancelEditingPatient = (row) => {
     // 根据 id 查找原始数据并恢复
    const index = patientsData.value.findIndex(pat => pat.id === originalPatientEditingRow.id);
     if (index !== -1) {
        Object.assign(patientsData.value[index], originalPatientEditingRow);
    }
    stopEditingPatient();
};

// 更新患者
const updatePatient = async (index, row) => {
    // 可以根据需要添加字段校验
    const updatedData = {
        name: row.name,
        phone: row.phone,
        gender: row.gender,
        birthDate: row.birthDate,
        idNumber: row.idNumber,
        // password: row.password, // 如果允许修改密码，需要加入此字段
    };
    // 💡 可选：检查哪些字段实际被修改了，只发送修改的字段

    updateLoading.value = { ...updateLoading.value, [row.id]: true }; // Use row.id as key
     try {
         // 不再发送 Mock 认证头
        const response = await axios.put(`/api/admin/patients/${row.id}`, updatedData, { headers: getMockAuthHeaders() });
         if (response.data && response.data.status === 200) {
             ElMessage.success("患者信息更新成功！");
              // Refresh patient list, keeping search criteria
             fetchPatients(patientSearchCriteria);
             stopEditingPatient();
         } else {
              ElMessage.error(response.data.message || "患者信息更新失败！");
         }
     } catch (error) {
         console.error("更新患者信息失败:", error);
         ElMessage.error("更新患者信息失败，请检查网络或服务器！");
     } finally {
         updateLoading.value[row.id] = false;
     }
};

// 删除患者
const deletePatient = async (index, row) => {
     const patientToDelete = row;

      ElMessageBox.confirm(`确定要删除患者 "${patientToDelete.name}" 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        deleteLoading.value = { ...deleteLoading.value, [row.id]: true }; // Use row.id as key
        try {
             // 不再发送 Mock 认证头
            const response = await axios.delete(`/api/admin/patients/${patientToDelete.id}`, { headers: getMockAuthHeaders() });
             if (response.data && response.data.status === 204) { // 204 No Content
                ElMessage.success("患者删除成功！");
                // Refresh patient list, keeping search criteria, handle deleting the last item on the last page
                 if (patientsData.value.length === 1 && patientsPagination.currentPage > 1) {
                     patientsPagination.currentPage--;
                 }
                 fetchPatients(patientSearchCriteria);
             } else {
                 const errorMessage = response.data && response.data.message ? response.data.message : "患者删除失败！";
                 ElMessage.error(errorMessage);
             }
        } catch (error) {
            console.error("删除患者失败:", error);
            ElMessage.error("删除患者失败，请检查网络或服务器！");
        } finally {
             deleteLoading.value[row.id] = false;
        }
      }).catch(() => {
          // User canceled deletion
      });
};


// 停止编辑患者行
const stopEditingPatient = () => {
     editingPatientId.value = null;
      for (const key in originalPatientEditingRow) {
        delete originalPatientEditingRow[key];
    }
};


// --- 辅助方法 ---

// 关系列表表格中医生选择改变 - 更新本地显示
// ✅ 直接使用 row 对象来更新其 name 属性
const handleRelationDoctorChange = (row) => {
   // row.doctorId 已经通过 v-model 更新为新选择的医生 ID
   const selectedDoctor = doctorOptions.value.find(doctor => doctor.id === row.doctorId);
    if (selectedDoctor) {
        // 直接更新当前行的 doctorName 属性
        row.doctorName = selectedDoctor.name;
   } else {
        // 如果没找到（理论上不会发生如果选项来自 remoteMethod），设置为未知
        row.doctorName = '未知医生';
   }
    // Note: This modification is local and temporary, it needs clicking save to submit to the backend
};

// 关系列表表格中患者选择改变 - 更新本地显示
// ✅ 直接使用 row 对象来更新其 name 属性
const handleRelationPatientChange = (row) => {
   // row.patientId 已经通过 v-model 更新为新选择的患者 ID
   const selectedPatient = patientOptions.value.find(patient => patient.id === row.patientId);
    if (selectedPatient) {
         // 直接更新当前行的 patientName 属性
         row.patientName = selectedPatient.name;
    } else {
         // 如果没找到（理论上不会发生如果选项来自 remoteMethod），设置为未知
         row.patientName = '未知患者';
    }
     // Note: This modification is local and temporary, it needs clicking save to submit to the backend
};


// --- 生命周期钩子 ---

onMounted(async () => {
  // Page load, get the first page data for the three lists (with default empty search criteria)
  await Promise.all([
      fetchRelations(), // Will use empty searchCriteria by default
      fetchDoctors(), // Will use empty doctorSearchCriteria by default
      fetchPatients() // Will use empty patientSearchCriteria by default
  ]);
});
</script>

<style scoped>
.admin-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the top */
  min-height: 100vh;
  background-color: #f2f6fc;
  padding: 20px; /* Add some padding */
  box-sizing: border-box; /* Include padding in element's total width and height */
}
.admin-card {
  width: 95%; /* Make card wider */
  max-width: 1200px; /* Maximum width */
  margin-bottom: 20px; /* Add margin at the bottom */
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form {
  margin-bottom: 20px; /* Add space below each form section */
}

/* 添加关系区域的布局 */
.add-relation-section {
    display: flex; /* 使用 flexbox */
    justify-content: space-between; /* 两端对齐 */
    gap: 20px; /* 子元素之间的间距 */
    margin-bottom: 20px;
    flex-wrap: wrap; /* 允许换行 */
}
.add-relation-selector {
     flex: 1; /* 子元素 flex-grow 均分空间 */
     min-width: 400px; /* 设置最小宽度，避免在flex时过小 */
     /* 增加边框和内边距，视觉上更好区分 */
     border: 1px solid #dcdfe6;
     border-radius: 4px;
     padding: 15px;
     box-sizing: border-box;
     background-color: #fff; /* Add background */
}
.add-relation-selector h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1em;
    color: #333;
    border-bottom: 1px solid #eee; /* Add a subtle line */
    padding-bottom: 10px;
}


/* 调整 inline フォーム项的间距 */
.form .el-form-item {
    margin-right: 20px;
    margin-bottom: 15px; /* Add bottom margin to inline form items for better stacking on smaller screens */
    vertical-align: top; /* Align items to the top */
}

/* 调整添加关系区域内的 form-item 间距 */
.add-relation-section .form .el-form-item {
    margin-bottom: 10px; /* Smaller bottom margin within this section's forms */
}


.el-divider {
  margin: 20px 0;
}

/* 样式用于包裹表格单元格内容，帮助对齐和填充 */
.el-table .cell-content {
    padding: 0 12px; /* 匹配 Element Plus 默认的单元格左右内边距 */
    display: flex; /* 使用 flexbox */
    align-items: center; /* 垂直居中内容 */
    min-height: 32px; /* 设置最小高度，与 small 尺寸的 input/select 大致对齐 */
    box-sizing: border-box; /* 内边距包含在元素的宽高内 */
}

/* 确保单元格内的输入框/选择器等填满空间并垂直对齐 */
.el-table .cell-content .el-input,
.el-table .cell-content .el-select {
     width: 100%; /* 已在模板中设置，这里确保 */
     /* vertical-align: top; */ /* 尝试垂直对齐，但 flexbox align-items 更好 */
}
.el-table .cell-content .el-input__wrapper,
.el-table .cell-content .el-select__wrapper {
     vertical-align: top; /* 可能需要对内部元素进行微调 */
}

</style>