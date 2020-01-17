import Vue from 'vue';
import VueRouter from 'vue-router';
//官方元件載入

Vue.use(VueRouter);
//Router元件呼叫

import HOME from '@/components/HelloWorld.vue';
import Login from '@/components/page/login.vue';
import Dashboard from '@/components/dashboard/dashboard.vue';
import Products from '@/components/page/products.vue';
import Orders from '@/components/page/orders.vue';
import Coupon from '@/components/page/coupon.vue';
import Customorder from '@/components/page/customorder.vue'
import CustomorderCheckout from '@/components/page/Customorder_Checkout.vue'

//元件路徑import

export default new VueRouter({
  routes: [
    // 此段是阻止使用者在網域中隨意輸入網址，只要隨意輸入的網址都轉跳到登入頁面
    {
      path:'*',
      redirect:'/login',
    },
    {
      name: '首頁', //網頁名稱
      path: '/', //虛擬路徑
      component: HOME, //使用元件
      // meta: { requiresAuth: true } //設定路由訊息，判斷此頁面需要驗證才可以轉跳
    },
    {
      name: '使用者登入',
      path: '/login',
      component:Login,
    },
    {
      name: '後台管理',
      path: '/admin',
      component:Dashboard,
      children:[
        {
          name: '產品明細',
          path: 'products',
          component:Products,
          meta: { requiresAuth: true }
        },
        {
          name: '訂單明細',
          path: 'orders',
          component:Orders,
          meta: { requiresAuth: true }
        },
        {
          name: '優惠券',
          path: 'coupon',
          component:Coupon,
          meta: { requiresAuth: true }
        },
    ]
    },
    {
      name: '訂單管理',
      path: '/',
      component:Dashboard,
      children:[
        {
          name: '模擬訂單',
          path: 'customorder',
          component:Customorder,
        },
        {
          name: 'CustomorderCheckout',
          path: 'CustomorderCheckout/:orderId',
          component:CustomorderCheckout,
        },
    ]
    },
  ]
})
