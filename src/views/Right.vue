<template>
  <div class="right-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-table :data="rightList" stripe border>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="authName" label="权限名称">
            </el-table-column>
            <el-table-column prop="path" label="路径">
            </el-table-column>
            <el-table-column label="权限等级">
              <template v-slot:default="scoped">
                <el-tag type="danger" v-if="scoped.row.level === '0'">1级标签</el-tag>
                <el-tag type="primary" v-else-if="scoped.row.level === '1'">2级标签</el-tag>
                <el-tag type="success" v-else>3级标签</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

    </el-card>

  </div>
</template>

<script>
import { getRightList } from "@/api/RightApi";
import remind from "@/utils/Remind";
export default {
  name: "Right",
  data() {
    return {
      rightList: [],
    }
  },
  methods: {
    async getRightList() {
      const { data: res } = await getRightList();
      if (res.meta.status !== 200) return remind("获取权限列表失败", "错误", this);
      this.rightList = res.data;
    }
  },
  created() {
    this.getRightList();
  }
}
</script>

<style lang="less" scoped></style>