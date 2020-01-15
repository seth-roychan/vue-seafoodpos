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
      highlight-current-row>

      <el-table-column align="center" label="Department ID" width="120">
        <template slot-scope="scope">
          {{ scope.row.departmentid }}
        </template>
      </el-table-column>
      <el-table-column label="Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="Default Record" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.defaultrecord }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Priority" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.priority}}
        </template>
      </el-table-column>


<!--       <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="Create Date" width="200">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ scope.row.createdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Lastup Update User" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastupdateuser}}
        </template>
      </el-table-column>

       <el-table-column label="Lastup Update" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastupdate}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230">
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
       <el-form-item label="DeparmentID" prop="departmentid">
          <el-input v-model="temp.departmentid" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="Priority" prop="priority">
          <el-input v-model="temp.priority" />
        </el-form-item>
        <el-form-item label="預設記錄" prop="defaultrecord">
          <el-switch v-model="temp.defaultrecord"></el-switch>
        </el-form-item>
        <el-form-item label="記錄狀態" prop="active">
          <el-switch v-model="temp.active"></el-switch>
        </el-form-item>

        <el-form-item label="Create Date" prop="timestamp">
          <el-date-picker v-model="temp.createdate" type="datetime" />
        </el-form-item>
        <el-form-item label="Last Update" prop="timestamp">
          <el-date-picker v-model="temp.lastupdate" type="datetime" />
        </el-form-item>
        <el-form-item label="Last Update User" prop="lastupdateuser">
          <el-input v-model="temp.lastupdateuser" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
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
//import { getList } from '@/api/table'
import axios from 'axios'
//import waves from '@/directive/waves' // waves directive
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
        defaultrecord: 0,
        priority: 1,
        createdate: new Date(),
        lastupdate: new Date(),
        lastupdateuser: '',
        active: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: { type: [{ required: true, message: 'type is required', trigger: 'change' }],
               timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
               description: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    console.log('Hello from Vue!')
    this.getDepartments()
  },
  methods: {
    getDepartments: function(){
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
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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
    }
  }
}
</script>
