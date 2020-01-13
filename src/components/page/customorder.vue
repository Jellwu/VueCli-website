<template lang="html">
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for=" items in products" :key="items.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 150px; background-size: cover; background-position: center"
          :style="{backgroundImage : `url(${items.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{items.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark" v-model="items.title"> {{items.title}}</a>
            </h5>
            <p class="card-text">{{items.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- <div class="h5">2,800 元</div> -->
              <div class="h5" v-if="!items.price">原價 {{items.price}}</div>
              <del class="h6" v-if="items.price">原價 {{items.origin_price}} 元</del>
              <div class="h5" v-if="items.price">現在只要 {{items.price}}元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(items.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === items.id"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === items.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="pdcModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{product.title}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt="...">
            <h5 class="mt-2">說明：{{product.content}}</h5>
            <div class="row mt-2">
              <h5 v-if="!product.price">現正售價：{{product.origin_price}}</h5>
              <del class="col-6" v-if="product.price">原價：{{product.origin_price}}</del>
              <h5 class="col-6" v-if="product.price">現正售價：{{product.price}}</h5>
            </div>
            <div class="mt-2">
              <select class="custom-select" >
                <option selected>請選擇選購數量</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary mr-auto" data-dismiss="modal">加入購物車</button>
            <button type="button" class="btn btn-primary">確認</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data(){
    return{
      products:[],
      product:{},
      pagination:{},
      status:{
        loadingItem:'',
      },
      isLoading:false,
    }
  },
  methods:{
    getProducts(page = 1){
      const vm = this;
      vm.isLoading = true;
      const Url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
      this.$http.get(Url).then((response) =>{
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
        console.log(response.data);
        this.$bus.$emit('page:push',vm.pagination.total_pages,vm.pagination.current_page,vm.pagination.has_pre,vm.pagination.has_next);
      })
    },
    getProduct(id){
      const vm = this;
      vm.status.loadingItem = id;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      this.$http.get(api).then((response) =>{
        vm.status.loadingItem = "";
        vm.product = response.data.product;
        $('#pdcModal').modal('show');
      })
    },
  },
  created(){
    const vm = this;
    this.$bus.$on('page:pages' ,(page) =>{
      vm.getProducts(page);
    })
    vm.getProducts();
  }
}
</script>

<style lang="css" scoped>
</style>
