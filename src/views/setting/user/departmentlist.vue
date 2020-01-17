<template>
  <div class="app-container">
<div class="filter-container">
<!--           <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column align="center" label="記錄編號" width="120">
        <template slot-scope="scope">
          {{ scope.row.departmentid }}
        </template>
      </el-table-column>
      <el-table-column label="名稱描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="排序優先" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.priority }}
        </template>
      </el-table-column>
      <el-table-column label="預設記錄" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.defaultrecord }}</span>
        </template>
      </el-table-column>
        <el-table-column label="記錄狀態" width="110" align="center">
        <template slot-scope="scope">
            {{ scope.row.active }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="建檔日期" width="200">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ scope.row.createdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最後更新" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastupdate }}
        </template>
      </el-table-column>
      <el-table-column label="更新用戶" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastupdateuser }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            編輯
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="記錄編號" prop="departmentid">
          <el-input v-model="temp.departmentid" />
        </el-form-item>
        <el-form-item label="名稱描述" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="排序優先" prop="priority">
          <el-input-number v-model.number="temp.priority" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="預設記錄">
          <el-switch v-model="temp.defaultrecord" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="記錄狀態">
          <el-switch v-model="temp.active" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="建檔日期" prop="datestamp">
          <el-date-picker v-model="temp.createdate" type="date" readonly="true" />
        </el-form-item>
        <el-form-item label="最後更新" prop="timestamp">
          <el-date-picker v-model="temp.lastupdate" type="datetime" readonly="true" />
        </el-form-item>
        <el-form-item label="修改用戶" prop="lastupdateuser">
          <el-input v-model="temp.lastupdateuser" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()"> -->
        <el-button type="primary" @click="handleSubmit()">
          Confirm
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
// import { getList } from '@/api/table'
import axios from 'axios'
// import waves from '@/directive/waves' // waves directive
// eslint-disable-next-line no-unused-vars
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
//  components: { Pagination },
// directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
    /*     typeFilter(type) {
      return calendarTypeKeyValue[type]
    } */
  },
  data() {
    return {
      tableKey: 0,
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        departmentid: undefined,
        description: '',
        priority: 1,
        defaultrecord: 0,
        active: 1,
        createdate: new Date(),
        lastupdate: new Date(),
        lastupdateuser: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改記錄',
        create: '新增記錄'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: { active: [{ required: true, message: 'Active is required', trigger: 'blur' }],
        description: [{ required: true, message: 'Description is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    console.log('Hello from Vue!')
    this.getDepartments()
  },
  methods: {
    getDepartments: function() {
      this.listLoading = true
      axios.get('http://localhost/api/read.php')
        .then((response) => {
          console.log(response.data)
          this.list = response.data
          this.total = response.data.total
          this.listLoading = false
        })
        .catch((error) => {
          console.log(error)
        }
        )
    },
    resetTemp() {
      this.temp = {
        departmentid: undefined,
        description: '',
        priority: 1,
        defaultrecord: 0,
        active: 1,
        createdate: new Date(),
        lastupdate: new Date(),
        lastupdateuser: ''
      }
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
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDownload() {
      this.downloadLoading = true
      /*       import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        }) */
      this.downloadLoading = false
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
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //  this.list.unshift(this.temp)
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
          // })
        }
      })
    },
    createDepartment: function() {
      console.log('Create Department!')
      // eslint-disable-next-line prefer-const
      let formData = new FormData()
      console.log('Description:', this.temp.description)
      formData.append('departmentid', -1)
      formData.append('description', this.temp.description)
      formData.append('priority', this.temp.priority)
      formData.append('defaultrecord', this.temp.defaultrecord)
      formData.append('active', this.temp.active)
      formData.append('lastupdateuser', 'Admin')

      var department = {}
      formData.forEach(function(value, key) {
        department[key] = value
      })

      axios({
        method: 'post',
        url: 'api/contacts.php',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
      })
        .then(function (response) {
            //handle success
            console.log(response)
            app.contacts.push(contact)
            app.resetForm();
        })
        .catch(function (response) {
            //handle error
            console.log(response)
        });
    }
    /*     handleSubmit() {
      const t = this
      t.$refs['dataForm'].validate((valid) => {
        if (valid) {
          alert('submit!')
          // console.log(this.dataForm)
        } else {
          console.log('error submit!!')
        //  return false;
        }
      })
    } */
  }
}
</script>
