import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Goodslist from './../views/goodslist/goodslist.vue'
import Cart from './../views/cart/cart.vue'
import Address from './../views/address/address.vue'
import OrderConfirm from './../views/orderConfirm/orderConfirm.vue'
import OrderSuccess from './../views/orderSuccess/orderSuccess.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'goodslist',
      component: Goodslist
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: OrderSuccess
    }
  ]
})
