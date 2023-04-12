import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/style/theme/index.css';
import "@/style/mystyle.css";
import { Form, FormItem, Input, Button, Image, MessageBox, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Table, TableColumn, Col, Row, Switch, Pagination, Dialog, Message, Tag, Tree, Checkbox, Select, Option, Cascader } from "element-ui";

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
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
