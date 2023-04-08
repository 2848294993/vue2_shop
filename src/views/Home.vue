<template>
  <div class="home-container">
    <el-container class="box">
      <el-header>
        <div class="left">
          <img src="../assets/购物车.png" alt="无">
          <span>mymymy商城</span>
        </div>
        <el-button @click="logout">退出</el-button>
      </el-header>

      <el-container class="content">
        <el-aside :width="iscollapse ? '64px' : '200px'">
          <div class="fold"><i class="el-icon-remove-outline" @click="iscollapse = !iscollapse"></i></div>
          <el-menu background-color="#d0b2ed" text-color="#fff" active-text-color="#fff" unique-opened router
            :collapse="iscollapse" :collapse-transition="false" :default-active="defaultactive">
            <el-submenu v-for="item in menulist" :key="item.id" :index="item.path + ''">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item v-for="i in item.children" :key="i.id" :index="i.path + ''" @click="toggleMenu(i.path + '')">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ i.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenuList } from "@/api/MenuApi";
import remind from "@/utils/Remind";
export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      iscollapse: false,
      defaultactive: 'users',
    }
  },
  methods: {
    logout() {
      window.localStorage.removeItem("token");
      this.$router.push("/login");
    },
    async getMenutList() {
      const { data: res } = await getMenuList();
      if (res.meta.status !== 200) return remind("请求菜单栏数据失败", "错误", this);
      this.menulist = res.data;
      console.log(this.menulist);
    },
    toggleMenu(path) {
      window.sessionStorage.setItem("menu", path);
      console.log(path);
      this.defaultactive = path;
    },
  },

  created() {
    this.getMenutList();
    if (window.sessionStorage.getItem("menu")) {
      this.defaultactive = window.sessionStorage.getItem("menu");
    }
  }
}
</script>


<style lang="less" scoped>
.home-container {
  height: 100%;


  .box {
    height: 100%;

    .el-header {
      display: flex;
      justify-content: space-between;
      background-color: #d0b2ed;
      align-items: center;

      >.left {
        display: flex;
        align-items: center;
        color: #fff;
        font-weight: 600;

        img {
          height: 50px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }

      .el-button {
        color: #d0b2ed;
        width: 100px;
        border-radius: 20px;
        font-weight: 600;
      }

    }

    .content {
      background-color: #d0b2ed;

      .el-aside {
        .fold {
          text-align: center;
          color: gray;

          i {
            cursor: pointer;
          }
        }

        .el-menu {
          border: 0px;
        }
      }


      .el-main {
        background-color: #fff;
      }
    }
  }
}
</style>