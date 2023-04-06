<template>
  <div class="home-container">
    <el-button @click="logout" type="primary">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logout() {
      window.localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  border-radius: 20px;
}
</style>