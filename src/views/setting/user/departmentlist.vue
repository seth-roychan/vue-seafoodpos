<template>
  <div class="app-container">
   <div class="actions">
    <a class="btn btn-default" v-link="{path: '/add-product'}">
      <span class="glyphicon glyphicon-plus"></span>
      Add product
    </a>
  </div>
  <h1>Department List</h1>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
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

      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>

    </el-table>
  </div>
</template>

<script>
//import { getList } from '@/api/table'
import axios from 'axios'


export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true
    }
  },
  created() {
    console.log('Hello from Vue!')
    this.getDepartments()
  },
  methods: {
/*     fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }, */
    getDepartments: function(){
         this.listLoading = true
        axios.get('http://localhost/api/read.php')
              .then((response) => {
                    console.log(response.data);
                    this.list = response.data;
                    this.listLoading = false
                })
                .catch((error) => {
                    console.log(error)
                });
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>

// https://panjiachen.github.io/vue-element-admin/#/table/complex-table
