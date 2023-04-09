<template>
  <div>
    <div class="role-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-button type="primary">
          添加角色
        </el-button>
        <el-table :data="roleList" stripe>
          <el-table-column type="expand">
            <template #default="scoped">
              <el-row v-for="(item1, i1) in scoped.row.children" :key="item1.id">
                <el-col :span="5">
                  <el-tag type="danger" closable @close="closeTag(scoped.row, item1.id)">
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="(item2, i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="closeTag(scoped.row, item2.id)">{{ item2.authName
                      }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="(item3, i3) in item2.children" :key="item3.id" closable
                        @close="closeTag(scoped.row, item3.id)">
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="scoped">
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
              <el-button type="warning" icon="el-icon-star-off" circle @click="setRolesRight(scoped.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog title="修改用户权限" :visible.sync="setVisible" width="50%" @close="setRightClose">
        <el-tree :data="rightList" :props="props" show-checkbox node-key="id" :default-checked-keys="myRightList"
          default-expand-all ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmRights">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, closeTag, getRightList, confirmRights } from "@/api/RoleApi";
import remind from "@/utils/Remind";
export default {
  name: "Role",
  data() {
    return {
      roleList: [],
      setVisible: false,
      props: {
        label: "authName",
        children: "children"
      },
      rightList: [],
      myRightList: [],
      roleId: ""
    }
  },
  methods: {
    async getRoleList() {
      const { data: res } = await getRoleList();
      if (res.meta.status !== 200) {
        return remain("获取角色列表失败", "错误", this);
      }
      this.roleList = res.data;
    },
    async closeTag(role, rightId) {
      const confirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirm === "confirm") {
        const { data: res } = await closeTag(role.id, rightId);
        if (res.meta.status !== 200) return remind("取消权限失败", "错误", this);
        role.children = res.data;
        return this.$message.success("删除权限成功");
      }
      else {
        this.$message.info("取消删除权限");
      }
    },
    getMyRightList(role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      else {
        role.children.forEach(item => { this.getMyRightList(item, arr) });
      }
    },
    setRolesRight(role) {
      this.getRightList();
      this.getMyRightList(role, this.myRightList);
      this.roleId = role.id;
      this.setVisible = true;
    },
    async getRightList() {
      const { data: res } = await getRightList();
      if (res.meta.status !== 200) remind("获取权限列表失败", "错误", this);
      this.rightList = res.data;
    },
    setRightClose() {
      this.myRightList = [];
    },
    async confirmRights() {
      const rightArr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const rightStr = rightArr.join(",");
      const { data: res } = await confirmRights(this.roleId, rightStr);
      if (res.meta.status !== 200) return remind("更新权限失败", "错误", this);
      this.$message.success("更新权限成功");
      this.setVisible = false;
      this.getRoleList();
    }
  },

  async created() {
    this.getRoleList();
  }
}
</script>

<style lang="less" scoped></style>