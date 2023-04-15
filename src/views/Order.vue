<template>
  <div class="order-cont">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" style="width: 100%;">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template #default="scoped">
            <el-tag type="success" v-if="scoped
              .row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>

        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column label="下单时间">
          <template #default="scoped">
            {{ scoped.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button type="primary" icon="el-icon-edit" circle @click="setAddress"></el-button>
            <el-button type="success" icon="el-icon-location" circle @click="showAddress"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="setAddressDialog" width="40%" @close="closeSetAddressDialog">
      <el-form :model="setAddressForm" :rules="setAddressRules" ref="setAddressRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="setAddressForm.address1" :options="cityData"
            :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="setAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="setAddressDialog = false">取 消</el-button>
        <el-button type="primary" @click="setAddressDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看物流" :visible.sync="showAddressDialog" width="30%">
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList } from "@/api/OrderApi";
import remind from "@/utils/Remind";
import cityData from "@/utils/citydata";
export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      setAddressDialog: false,
      setAddressForm: {
        address1: [],
        address2: "",
      },
      setAddressRules: {
        address1: [
          {
            required: true, message: "请选择省份信息", trigger: "blur"
          }],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData,
      progressInfo: [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ],
      showAddressDialog: false,
    }
  },
  methods: {
    async getOrderList() {
      const { data: res } = await getOrderList(this.queryInfo);
      if (res.meta.status !== 200)
        return remind("获取订单列表失败", "错误", this);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    setAddress() {
      this.setAddressDialog = true;
    },
    closeSetAddressDialog() {
      this.$refs.setAddressRef.resetFields();
    },
    showAddress() {
      this.showAddressDialog = true;
    }
  },
  created() {
    this.getOrderList();
  }
}
</script>

<style lang="less" scoped>
.el-col {
  display: flex;
  justify-content: center;
}

.el-input {
  width: 400px;
}

.el-cascader {
  width: 400px;
}
</style>