import axios from "axios";

const request = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1/",

})

//添加axios请求拦截器：在请求发出去之前将请求拦截下来进行预处理
request.interceptors.request.use(config => {    //config为请求对象
  config.headers.Authorization = window.localStorage.getItem("token");//为请求头挂载一个Authotization字段
  return config;//return config是必须要写的
})

export { request }
