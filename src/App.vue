<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
  name: "App",
  components: { RouterView }
}
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
