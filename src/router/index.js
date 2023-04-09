import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import User from "@/views/User.vue";
import Role from "@/views/Role.vue";
import Right from "@/views/Right.vue";

Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/login", component: Login },
  {
    path: "/home", component: Home, redirect: "/home/users", children:
      [
        { path: "users", component: User },
        { path: "roles", component: Role },
        { path: "rights", component: Right },
      ]
  },

]

const router = new VueRouter({
  routes
})


//路由守卫
router.beforeEach((to, from, next) => {

  if (to.path !== "/login") {
    const token = window.localStorage.getItem("token");
    if (!token) {//如果token为空
      return next("/login");//跳到登录页面
    }
    else {
      return next();
    }

  }
  else {
    next();
  }


})

export default router
