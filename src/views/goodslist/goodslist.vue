<template>
  <div>
    <symbol id="icon-arrow-short" viewBox="0 0 25 32">
      <title>arrow-short</title>
      <path class="path1" d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z"></path>
    </symbol>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default" v-bind:class="{'cur':sortFlag}" @click="sortGoodsDefault">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods" v-bind:class="{'sort-up':sortFlag,'cur':!sortFlag}">Price
            <svg class="icon-arrow-short" v-bind:class="{'sort-up':sortFlag}">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="setPriceAll">All</a>
              </dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)"
                   v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}}-{{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'./static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice | currency('￥')}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                   infinite-scroll-distance="30">
                <img src="./../../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="mdShow" @click="closeFilterPop"></div>
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">请先登录！</p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </modal>

    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon icon-status-ok">
          <use xlink:href="#icon-status-ok"></use>
        </svg>
        <span>添加成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShowCart=false">继续逛逛</a>
        <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import "./../../assets/css/base.css";
  import "./../../assets/css/product.css";
  import axios from "axios";
  import NavHeader from "@/components/header.vue";
  import NavFooter from "@/components/footer.vue";
  import NavBread from "@/components/bread.vue";
  import modal from './../../components/Modal.vue'
  export default {
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      modal
    },
    data(){
      return {
        goodsList: [],
        priceFilter: [
          {
            startPrice: '0',
            endPrice: '500'
          },
          {
            startPrice: '500',
            endPrice: '1000'
          },
          {
            startPrice: '1000',
            endPrice: '2000'
          },
          {
            startPrice: '2000',
            endPrice: '5000'
          }
        ],
        priceChecked: 'all',
        loading: false,
        filterBy: false,
        overLayFlag: false,
        mdShow: false,
        mdShowCart: false,
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: true,
        priceLevel: 'all'
      }
    },
    mounted(){
      this.getGoodsList();
    },
    methods: {
      getGoodsList(flag){
        var param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked
        }
        this.loading = true;
        axios.get('/goods/list', {
          params: param
        }).then((response) => {
          let res = response.data;
          this.loading = false;
          if (res.status == '0') {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list);
              if (res.result.count == 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
            }
          } else {
            this.goodsList = [];
          }
        });
      },
      addCart(productId){
        axios.post('/goods/addCart', {productId: productId}).then((res) => {
          res = res.data;
          if (res.status == '0') {
            this.mdShowCart = true;
          } else {
            this.mdShow = true;
          }
        });
      },
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      sortGoodsDefault(){
        this.sortFlag = true;
        this.page = 1;
        this.getGoodsList();
      },
      setPriceFilter(index){
        this.filterBy = false;
        this.overLayFlag = false;
        this.page = 1;
        this.priceChecked = index;
        this.getGoodsList();
      },
      setPriceAll(){
        this.filterBy = false;
        this.overLayFlag = false;
        this.page = 1;
        this.priceChecked = 'all';
        this.getGoodsList();
      },
      showFilterPop(){
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closeFilterPop(){
        this.filterBy = false;
        this.overLayFlag = false;
        this.mdShow = false;
      },
      closeModal(){
        this.mdShow = false;
        this.mdShowCart = false;
      },
      loadMore(){
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      }
    }
  };
</script>


