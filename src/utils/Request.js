import axios from "axios";
//导入进度条及其样式
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const request = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1/",

})

//添加axios请求拦截器：在请求发出去之前将请求拦截下来进行预处理
request.interceptors.request.use(config => {    //config为请求对象
  //在发送请求之前开启进度条
  NProgress.start();
  config.headers.Authorization = window.localStorage.getItem("token");//为请求头挂载一个Authotization字段
  return config;//return config是必须要写的
})

//添加axios响应拦截器
request.interceptors.response.use(config => {    //config为请求对象
  //在收到响应之后关闭进度条
  NProgress.done();
  return config;//return config是必须要写的
})

export { request }
