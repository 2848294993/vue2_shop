import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueQuillEditor from 'vue-quill-editor'
import '@/style/theme/index.css';
import "@/style/mystyle.css";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { Form, FormItem, Input, Button, Image, MessageBox, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Table, TableColumn, Col, Row, Switch, Pagination, Dialog, Message, Tag, Tree, Checkbox, Select, Option, Cascader, Alert, Tabs, TabPane, Steps, Step, InputNumber, CheckboxGroup, Upload, Timeline, TimelineItem } from "element-ui";

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Image);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Row);
Vue.use(Col);
Vue.use(Switch);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(InputNumber);
Vue.use(CheckboxGroup);
Vue.use(Upload);
Vue.use(VueQuillEditor, /* { default global options } */);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;


Vue.config.productionTip = false
Vue.filter("dateFormat", (date) => {
  let date1 = new Date(date);
  let YY = date1.getFullYear();
  let MM = padZero(date1.getMonth() + 1);//注意月份要加1（因为getMonth获得的月份是从0开始的）
  let DD = padZero(date1.getDate());
  let hh = padZero(date1.getHours());
  let mm = padZero(date1.getMinutes());
  let ss = padZero(date1.getSeconds());
  return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
})
new Vue({
  router,
  //render函数指定了渲染的是哪一个组件，被指定的组件就是根组件
  render: h => h(App)
}).$mount('#app')

function padZero(time) {
  return time < 10 ? "0" + time : time;
}