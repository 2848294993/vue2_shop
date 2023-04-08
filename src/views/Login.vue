<template>
  <div class="login-container">
    <div class="login-box">
      <h1>L O G I N</h1>
      <el-form ref="elloginform" :rules="loginRule" :model="loginForm" label-width="80px">
        <el-form-item class="input" prop="username">
          <label slot="label" class="label">用户名</label>
          <el-input v-model.trim="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item class="input" prop="password">
          <label slot="label" class="label">密&nbsp;&nbsp;&nbsp;码</label>
          <el-input v-model.trim="loginForm.password" type="password" show-password>
          </el-input>
        </el-form-item>
        <el-form-item class="button">
          <el-button @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="button">
          <el-button type="reset" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/loginApi";
import remind from "@/utils/Remind"
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRule: {
        username: [
          { required: true, message: "用户名不能为空", trigger: 'blur' },
          { min: 3, message: "用户名长度最短为3", trigger: 'blur' }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: 'blur' },
          { min: 5, message: "密码的最小长度为5", trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    login() {
      this.$refs.elloginform.validate(async (validate) => {
        if (validate) {//通过验证
          const { data: res } = await login(this.loginForm);
          if (res.meta.status !== 200)
            return remind("用户名或者密码错误", "提示", this);
          //登录成功
          else {
            window.localStorage.setItem("token", res.data.token);//在本地存储token
            this.$router.push("/home");
          }
        }
        else {//没有通过验证
          return remind("用户名或者密码不符合要求", "提示", this);
        }
      })
    },
    reset() {
      this.loginForm.username = "";
      this.loginForm.password = "";
    },


  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.login-box {
  width: 20%;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background-color: #d0b2ed;

  h1 {
    margin-top: 100px;
    text-align: center;
    color: #fff;
  }


  .label {
    color: #fff;
    font-weight: 600;
  }

  .input {
    margin-right: 30px;

    /deep/ .el-input__inner {
      background-color: #d0b2ed;
      border: 0px;
      border-bottom: 2px solid #fff;

    }

    /deep/ .el-input__inner:focus {
      border-bottom: 2px solid #ab92e8;
    }

    /deep/ .el-icon-view:before {
      color: #fff;
    }
  }

  .button {
    margin-left: -80px;
    text-align: center;

    .el-button {
      width: 200px;

      /deep/ span {
        color: #d0b2ed;
        font-weight: 600;
      }
    }
  }
}
</style>