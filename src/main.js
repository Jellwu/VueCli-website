// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
//插入vue-axios套件
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App';
//插入路由
import router from './router';
//插入bootstrap
import 'bootstrap';
//插入Vue Loading overlay
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
//註冊EventBus
import './bus'
//注入filter內容
import currencyFilter from './filter/currency.js'
import timeTranseFilter from './filter/timeTranse.js'
//注入vee-validate表單驗證工具
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import tw from "vee-validate/dist/locale/zh_TW.json";

// 安裝所有 VeeValidate 規則
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});
localize("zh_TW", tw);

// 註冊vee-validate 全域元件
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);

//將cookie寫到localstorage儲存
axios.defaults.withCredentials = true;
//使用vue-axios套件
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
//全域註冊vue loading overlay
Vue.component('Loading',Loading);
//使用currency(filter)
Vue.filter('currency',currencyFilter);
Vue.filter('timeTranse',timeTranseFilter);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
});

//導航守衛:在使用者針對這個網頁隨意轉跳頁面時，會跳出來阻擋並判斷是否需要驗證，也判斷使用者是否是登入狀態
router.beforeEach((to, from, next) => {
  // meta.requiresAuth是從index.js裡面去抓的參數(在vueRouter的文件有說明是判斷路由狀態的訊息)
  // 在要去的頁面有設定meatAuthrequire時，就去驗證，反之就不需要
  if(to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
    //this.$http是用在.vue的元件下，在entry這邊必須是直接改用axios
    axios.post(api).then((response) =>{
      //驗證成功前往指定路徑
      if(response.data.success){
        next();
      }else{
        alert(response.data.message);
        next({
          path:'./login'
        })
      }
    })
  }else{
    next();
  }

})
