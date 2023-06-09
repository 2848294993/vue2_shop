import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import User from "@/views/User.vue";
import Role from "@/views/Role.vue";
import Right from "@/views/Right.vue";
import Category from "@/views/Category.vue";
import Param from "@/views/Param.vue";
import Goods from "@/views/Goods.vue";
import AddGoods from "@/views/AddGoods.vue";
import Order from "@/views/Order.vue";
import Report from "@/views/Report.vue";


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
        { path: "categories", component: Category },
        { path: "params", component: Param },
        { path: "goods", component: Goods },
        { path: "addgoods", component: AddGoods },
        { path: "orders", component: Order },
        { path: "reports", component: Report }
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
