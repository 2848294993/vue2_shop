<template>
  <div class="goods-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20" style="justify-content: center;">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model.trim="queryInfo.query" clearable @clear="searchGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量(kg)">
        </el-table-column>
        <el-table-column label="创建时间">
          <template v-slot:default="scoped">
            {{ scoped.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button type="success" circle icon="el-icon-edit"></el-button>
            <el-button type="danger" circle icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList } from "@/api/GoodsApi";
import remind from "@/utils/Remind";
export default {
  name: "Goods",
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
    }
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await getGoodsList(this.queryInfo);
      if (res.meta.status !== 200) return remind("获取商品列表失败", this);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;

      window.sessionStorage.setItem("pagesize", this.queryInfo.pagesize);
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;

      window.sessionStorage.setItem("pagenum", this.queryInfo.pagenum);
      this.getGoodsList();
    },
    searchGoods() {
      this.queryInfo.pagenum = 1;
      this.getGoodsList();
    },
    addGoods() {
      this.$router.push("/home/addgoods");
    }
  },
  created() {
    if (window.sessionStorage.getItem("pagesize"))
      this.queryInfo.pagesize = parseInt(window.sessionStorage.getItem("pagesize"));
    if (window.sessionStorage.getItem("pagenum"))
      this.queryInfo.pagenum = parseInt(window.sessionStorage.getItem("pagenum"));
    this.getGoodsList();
  }
}
</script>

<style lang="less" scoped></style>