<template>
  <div class="user-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入用户名" v-model.trim="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="addUserButton">添加用户</el-button>
        </el-col>

      </el-row>
      <el-table :data="userList" style="width: 100%" stripe>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scoped">
            <el-switch v-model="scoped.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
              @change="stateChange(scoped.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button type="primary" icon="el-icon-edit" circle @click="editUserButton(scoped.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scoped.row.id)"></el-button>
            <el-button type="success" icon="el-icon-setting" circle @click="setRoles(scoped.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
      <span>
        <el-form :model="userForm" :rules="userRules" ref="userRef" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editUserVisible" width="50%" @close="$refs.editRef.resetFields()">
      <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.trim="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置角色" :visible.sync="setRoleDialogVisible" width="50%" @close="closeSetRoleDialog">
      <div>
        <p>用户名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ userinfo.username }}</p>
        <p>角色名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ userinfo.role_name }}</p>
        <p>修改角色为:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetRoleDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from "@/api/RoleApi";
import { getUserList, addUser, stateChange, editUser, deleteUser, setRole } from "@/api/UserApi.js";
import remind from "@/utils/Remind";

export default {
  name: "User",
  data() {
    const emailValid = (rule, email, cb) => {
      const emailSchema = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (emailSchema.test(email)) {
        return cb();
      }
      else {
        return cb(new Error("请填写正确的邮箱"))
      }
    };
    const mobileValid = (rule, mobile, cb) => {
      const mobileSchema = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (mobileSchema.test(mobile)) {
        return cb();
      }
      else {
        return cb(new Error("请填写正确的手机号码"))
      }
    };
    return {
      userList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      total: 0,
      dialogVisible: false,
      userForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      userRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 10, message: "用户名必须在3位到10位之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 5, max: 16, message: "密码必须在6位到16位之间", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: emailValid, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: mobileValid, trigger: "blur" }
        ]
      },
      editForm: {},
      editUserVisible: false,
      editRules: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: emailValid, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: mobileValid, trigger: "blur" }
        ]
      },
      setRoleDialogVisible: false,
      userinfo: {},
      roleList: [],
      selectedRoleId: "",
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await getUserList(this.queryInfo);
      if (res.meta.status !== 200) return remind("获取用户列表失败", "错误", this);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
      window.sessionStorage.setItem("pagesize", this.queryInfo.pagesize);
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getUserList();
      window.sessionStorage.setItem("pagenum", this.queryInfo.pagenum);
    },
    addUserButton() {
      this.dialogVisible = true;
    },
    async addUser() {
      this.$refs.userRef.validate(async valid => {
        if (!valid) {
          return remind("输入的信息不符合要求", "错误", this);
        }
        else {
          const { data: res } = await addUser(this.userForm);
          if (res.meta.status != 201) {
            return this.$message.error('增加用户失败');
          }
          else {
            this.$message.success("增加用户成功");
            this.getUserList();
            this.$refs.userRef.resetFields();
          }
        }
      })
    },
    closeDialog() {
      this.$refs.userRef.resetFields();
    },
    async stateChange(user) {
      const { data: res } = await stateChange(user);
      if (res.meta.status !== 200) {
        remind("设置用户状态失败", "错误", this);
        user.mg_state = !user.mg_state;
        return;
      }
      this.$message.success("设置用户状态成功");
    },
    editUserButton(user) {
      this.editUserVisible = true;
      this.editForm = user;
    },
    async editUser() {
      const { data: res } = await editUser(this.editForm);
      if (res.meta.status !== 200) return remind("修改用户信息失败", "错误", this);
      this.getUserList();
      this.editUserVisible = false;
      this.$message.success("修改用户信息成功");
    },
    async deleteUser(id) {
      const confirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirm === "confirm") {
        const { data: res } = await deleteUser(id);
        if (res.meta.status !== 200) return remind("删除用户失败", "错误", this);
        this.$message.success("删除用户成功");
        const { data: res1 } = await getUserList(this.queryInfo);
        if (res1.meta.status !== 200) return remind("获取用户列表失败", "错误", this);
        if (res1.data.users.length === 0)
          this.queryInfo.pagenum = 1;
        window.sessionStorage.setItem("pagenum", this.queryInfo.pagenum);
        this.getUserList();
      }
      else {
        this.$message.info("已取消删除用户");
      }

    },
    async setRoles(row) {
      this.userinfo = row;
      const { data: res } = await getRoleList();
      if (res.meta.status !== 200)
        return remind("获取角色列表失败", "错误", this);
      this.roleList = res.data;
      this.setRoleDialogVisible = true;
    },
    async confirmSetRoleDialog() {
      const { data: res } = await setRole(this.userinfo.id, this.selectedRoleId);
      if (res.meta.status !== 200) remind("更新角色失败", "错误", this);
      this.getUserList();
      this.$message.success("更新角色车成功");
      this.setRoleDialogVisible = false;
    },
    closeSetRoleDialog() {
      this.selectedRoleId = "";
    }

  },
  created() {
    if (window.sessionStorage.getItem("pagenum"))
      this.queryInfo.pagenum = parseInt(window.sessionStorage.getItem("pagenum"));
    if (window.sessionStorage.getItem("pagesize"))
      this.queryInfo.pagesize = parseInt(window.sessionStorage.getItem("pagesize"));
    this.getUserList();
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 10px;
  border: 3px solid lightgray;
  box-shadow: 5px 5px 3px lightgray !important;

  .el-row {
    display: flex;
    justify-content: center;
  }

  .lightpurple {
    background-color: #f9e0f1;
  }




}
</style>