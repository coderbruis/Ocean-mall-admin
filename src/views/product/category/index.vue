<template>
  <div class="app-container">
    <el-card class="batch-operation" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="filter-item" style="float: right;margin-top: -5px;" type="primary" size="mini">
        添加
      </el-button>
    </el-card>
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 20px;"
        :default-sort = "{prop: 'date', order: 'descending'}"
        border
      >
        <el-table-column
          prop="id"
          label="编号"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="date"
          label="分类名称"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="分类详情"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          :formatter="formatter">
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      tableData: [{
        id: '1',
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: '2',
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: '3',
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: '4',
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    formatter(row, column) {
      return row.address;
    }
  }
}
</script>

<style scoped>

</style>
