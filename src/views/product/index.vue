<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="always">
        <div>
          <span style="font-size: 16px;"><i class="el-icon-search"></i></span>
          <span style="font-size: 20px;">筛选搜索</span>
          <el-button
            style="float: right"
            @click="handleSearchList()"
            type="primary"
            size="small">
            查询结果
          </el-button>
          <el-button
            style="float: right;margin-right: 15px"
            @click="handleResetSearch()"
            size="small">
            重置
          </el-button>
        </div>
        <!-- ============ 筛选 ============ -->
        <div style="margin-top: 20px;">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px;">
            <el-form-item label="输入搜索: ">
              <el-input v-model="listQuery.name" placeholder="商品名称" style="width: 203px;" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-form-item label="商品编号：">
              <el-input style="width: 203px" placeholder="商品编号"></el-input>
            </el-form-item>
            <el-form-item label="商品分类：">
              <el-cascader :options="options" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="上架状态">
              <el-select placeholder="全部" clearable>
                <el-option label="上架"></el-option>
                <el-option label="下架"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    <!-- 添加&批量操作 -->
    <el-card class="batch-operation" shadow="always">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-input v-model="listQuery.name" placeholder="名字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </el-card>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      class="product-table"
    >
      <!-- slot-scope表示的是插槽作用域，scope就是表示新copy的table数据的副本scope，所以直接可以通过scope.$index获取数据的索引，scope.row获取
       表格数据的row数据。-->
      <!--<el-table-column align="center" label="编号" width="95" sortable="custom" :class-name="getSortClass('id')">-->
      <el-table-column align="center" label="序号" prop="id" width="95" sortable="custom" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="{row}">
          {{ row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="商品图片" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productImage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品库存" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ row.status | statusValueFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            详情
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 模态框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <!--
                <el-form-item label="Password" prop="password">
                  <el-input v-model="temp.password" />
                </el-form-item>
        -->
        <el-form-item label="时间" prop="lastlogintime">
          <el-date-picker v-model="temp.lastlogintime" type="datetime" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="个人介绍">
          <el-input v-model="temp.introduction" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getProductInfo, createUser, updateUser } from '@/api/user'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

export default {
  name: 'ProductMgr',
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    // 状态过滤器
    statusFilter(status) {
      const statusMap = {
        normal: 'success',
        blocked: 'gray',
        forbidden: 'danger'
      }
      return statusMap[status]
    },
    // 状态值过滤器
    statusValueFilter(status) {
      const statusValueMap = {
        normal: '正常',
        blocked: '锁定',
        forbidden: '禁用'
      }
      return statusValueMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      currentPage4: 2,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        name: undefined
      },
      // 模态框标题
      textMap: {
        update: '更新',
        create: '创建'
      },
      // 显示模态框
      dialogFormVisible: false,
      // 模态框状态
      dialogStatus: '',
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        lastlogintime: [{ type: 'date', required: true, message: 'lastlogintime is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      // 模态框默认数据
      temp: {
        name: '',
        phone: '',
        email: '',
        lastLoginTime: new Date(),
        introduction: '',
        status: 'normal'
      },
      calendarTypeOptions,
      statusOptions: ['normal', 'blocked', 'forbidden'],
      // 商品分类级联
      props: {
        multiple: true
      },
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getProductInfo(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // 模拟请求时间
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.lastlogintime = new Date(this.temp.lastlogintime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // 涉及到Vue中DOM的异步更新
      this.$nextTick(() => {
        // 清除表单的内容
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTmp()
      this.dialogStatus = 'create'
      // 显示模态框
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置模态框架数据
    resetTmp() {
      this.temp = {
        name: '',
        phone: '',
        email: '',
        lastLoginTime: new Date(),
        introduction: '',
        status: 'normal'
      }
    },
    createData() {
      // 校验
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建用户成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.lastLoginTime = +new Date(tempData.lastLoginTime)
          updateUser(tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            // 通知提示
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      console.log(sort === `+${key}`)
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style>
  .el-table th.gutter{
    display: table-cell!important;
  }
  .batch-operation {
    margin-top: 20px;
  }
  .product-table {
    margin-top: 20px;
  }
</style>
