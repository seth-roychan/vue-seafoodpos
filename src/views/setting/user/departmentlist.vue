<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.description" placeholder="Description" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜尋
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        匯出PDF
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="記錄編號" prop="departmentid" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.departmentid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名稱描述">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序優先" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="預設記錄" width="110" align="center">
        <template slot-scope="{row}">
          <!-- <el-checkbox :checked="row.defaultrecord" onclick="return false" /> -->
          <input v-model="row.defaultrecord" type="checkbox" onclick="return false">
        </template>
      </el-table-column>
      <el-table-column label="記錄狀態" width="110" align="center">
        <template slot-scope="{row}">
          <input v-model="row.active" type="checkbox" onclick="return false">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createdate" label="建檔日期" width="100">
        <template slot-scope="{row}">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ row.createdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最後更新" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastupdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新用戶" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastupdateuser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            編輯
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getDepartments" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="記錄編號" prop="departmentid">
          <el-input v-model="temp.departmentid" readonly="true" />
        </el-form-item>
        <el-form-item label="名稱描述" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="排序優先" prop="priority">
          <el-input-number v-model.number="temp.priority" type="number" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="預設記錄" prod="defaultrecord">
          <el-switch v-model="temp.defaultrecord" :disabled="isDisabled" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="記錄狀態" prod="active">
          <el-switch v-model="temp.active" :disabled="isDisabled" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="建檔日期" prop="createdate">
          <el-date-picker v-model="temp.createdate" type="date" value-format="yyyy-MM-dd" readonly="true" />
        </el-form-item>
        <el-form-item label="最後更新" prop="lastupdate">
          <el-date-picker v-model="temp.lastupdate" type="datetime" value-format="yyyy-MM-dd" readonly="true" />
        </el-form-item>
        <el-form-item label="修改用戶" prop="lastupdateuser">
          <el-input v-model="temp.lastupdateuser" readonly="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()"> -->
        <el-button type="primary" @click="handleSubmit()">
          儲存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { formatDate } from '@/utils/formatfunct'
import { formatDateTime } from '@/utils/formatfunct'



export default {
  name: 'DepartmentList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        description: undefined,
        sort: '+departmentid'
      },
      temp: {
        departmentid: undefined,
        description: '',
        priority: 1,
        defaultrecord: 0,
        active: 1,
        createdate: new Date(),
        lastupdate: new Date(),
        lastupdateuser: '',
        readonly: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改記錄',
        create: '新增記錄'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: { active: [{ required: true, message: 'Active is required', trigger: 'change', validator: 'chkactive'}],
        description: [{ required: true, message: 'Description is required', trigger: 'blur' }],
        defaultrecord: [{ required: true, message: 'Defaultrecord is required', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    isDisabled: function(row) {
      if (this.temp.readonly === 1) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    console.log('departmentlist created !')
    this.getDepartments()
  },
  methods: {
    chkactive: function(rule, value, callback) {
      // 自定义校验规则
      if (!value) {
        if (this.temp.defaultrecord === 1) {
          if (value === 0) {
            return callback(new Error('預設記錄不能取消啟用狀態'))         
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    },
    getDepartments: function() {
      this.listLoading = true
      const search = this.listQuery.description
      axios.get('http://localhost/api/department.php?action=read')
        .then((response) => {
          console.log(response.data)
          if (this.listQuery.description) {
            this.list = response.data
            this.list = this.list.filter(function(item, index, array) {
              return String(item.description).includes(search)
            })
          } else {
            this.list = response.data
          }

          this.total = this.list.length

          if (this.listQuery.sort === '-departmentid') {
            this.list = this.list.reverse()
          }

          this.list = this.list.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    resetTemp() {
      this.temp = {
        departmentid: 'New',
        description: '',
        priority: 1,
        defaultrecord: 0,
        active: 1,
        createdate: new Date(),
        lastupdate: new Date(),
        lastupdateuser: 'Admin',
        readonly: 0
      }
    },
    toFormData: function(obj) {
      var form_data = new FormData()
      for (var key in obj) {
        form_data.append(key, obj[key])
      }
      return form_data
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getDepartments()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'departmentid') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+departmentid'
      } else {
        this.listQuery.sort = '-departmentid'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.lastupdate = new Date()
      this.temp.lastupdateuser = 'Admin'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp.readonly = this.temp.defaultrecord
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'create') {
            this.createDepartment()
          } else {
            this.updateDepartment()
          }
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Saved Successfully',
            type: 'success',
            duration: 2000
          })
          this.getDepartments
        }
      })
    },
    createDepartment: function() {
      console.log('Create Department!')
      // eslint-disable-next-line prefer-const
      this.temp.createdate = formatDate(this.temp.createdate)
      this.temp.lastupdate = formatDateTime(this.temp.lastupdate)
      const formData = this.toFormData(this.temp)
      console.log('Description:', this.temp.description)

      axios({
        method: 'post',
        url: 'http://localhost/api/department.php?action=create',
        data: formData,
        config: { headers: { 'Content-Type': 'application/form-data' }}
      })
        .then((response) => {
          // handle success
          console.log(response)
          this.temp.departmentid = response.data
          this.list.unshift(this.temp)
          this.resetTemp()
        })
        .catch(function(response) {
          // handle error
          console.log(response)
        })
    },
    updateDepartment: function() {
      console.log('Update Department!')
      this.temp.lastupdate = formatDateTime(this.temp.lastupdate)
      const formData = this.toFormData(this.temp)
      axios({
        method: 'post',
        url: 'http://localhost/api/department.php?action=update',
        data: formData,
        config: { headers: { 'Content-Type': 'application/form-data' }}
      })
        .then((response) => {
          // handle success
          console.log(response)
          for (const v of this.list) {
            if (v.departmentid === this.temp.departmentid) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
        })
        .catch(function(response) {
          // handle error
          console.log(response)
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['記錄編號', '名稱描述', '排序優先', '預設記錄', '記錄狀態', '建檔日期', '最後更新', '更新用戶']
        const filterVal = ['departmentid', 'description', 'priority', 'defaultrecord', 'active', 'createdate', 'lastupdate', 'lastupdateuser']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'department-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}

</script>
