// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex';
import goodslist from './views/goodslist/goodslist.vue'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './Util/currency'

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.filter('currency', currency);

Vue.use(Vuex);
Vue.use(VueLazyLoad, {
  loading: './static/loading-svg/loading-bars.svg'
});
Vue.use(infiniteScroll);

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateNickName(state, nickName){
      state.nickName = nickName;
    },
    updateCartCount (state, cartCount){
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App,
    goodslist
  }
})
