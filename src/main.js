import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/style/theme/index.css';
import "@/style/mystyle.css";
import { Form, FormItem, Input, Button, Image, MessageBox } from "element-ui";

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Image);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
