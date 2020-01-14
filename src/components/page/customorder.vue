<template lang="html">
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4 mb-5">
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
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(items.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === items.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="">

    </div>

    <div class="row mt-5 mb-5 justify-content-md-center">
      <div class="col-6 mt-2 ">
        <table class="table">
          <thead class="bg-primary text-white">
            <tr>
              <td width="40px">刪除</td>
              <td>品名</td>
              <td width="80px">數量</td>
              <td width="120px">單價</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for = "(items) in cartlist.carts" :key="items.id">
              <td>
              <button class="btn btn-outline-danger" @click="opendropModal(items)">
                <i class="fas fa-trash"></i>
              </button>
              </td>
              <td> {{ items.product.title }} </td>
              <td> {{ items.qty }} / {{ items.product.unit}}</td>
              <td> {{ items.product.price | currency }}</td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td>總計：</td>
              <td>{{ total_price | currency}}</td>
            </tr>
            <tr class="text-success">
              <td colspan="2"></td>
              <td>折扣價：</td>
              <td>{{ total_price | currency}}</td>
            </tr>
            <tr>
              <td colspan="2">
                <input type="text" class="form-control" placeholder="輸入優惠券號碼">
              </td>
              <td colspan="2" class="text-right">
                <button class="btn btn-outline-success" width="50px">
                  <i class="fas fa-ticket-alt"></i>
                  優惠券
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal(pdcModal) -->
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
              <select class="custom-select" v-model="product.num">
                <option selected>請選擇選購數量</option>
                <option v-for="num in 10" :value="num">
                  {{num}} {{product.unit}}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary mr-auto" @click="addtoCart(product.id,product.num)">加入購物車</button>
            <button type="button" class="btn btn-primary"  data-dismiss="modal">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- dropcartModal -->
      <div class="modal fade" id="dropcartModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">刪除確認</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-primary" @click="delCart(tempCart.id)">確認</button>
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
      cartlist:{},
      tempCart:{},
      total_price: 0,
      final_price: 0,
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
        // console.log(response.data);
        this.$bus.$emit('page:push',vm.pagination.total_pages,vm.pagination.current_page,vm.pagination.has_pre,vm.pagination.has_next);
      })
    },
    // 取得單一產品
    getProduct(id){
      const vm = this;
      // 使回傳id寫到data，等等用來判斷是否顯示loadingIcon
      vm.status.loadingItem = id;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      this.$http.get(api).then((response) =>{
        // 結束後清空id資料，不顯示loadingIcon
        vm.status.loadingItem = "";
        vm.product = response.data.product;
        // 在資料回傳完成後才開啟Modal
        $('#pdcModal').modal('show');
      })
    },
    addtoCart(id, qty = 1){
      const vm = this;
      vm.status.loadingItem = id;
      const Url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const cart = {
        product_id:id,
        qty
      };
      this.$http.post(Url, { data:cart }).then((response) => {
        vm.status.loadingItem = "";
        $('#pdcModal').modal('hide');
        vm.getCart();
        // console.log(response.data);
      })
    },
    getCart(){
        const vm = this;
        const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
        this.$http.get(api).then((response) =>{
          // 結束後清空id資料，不顯示loadingIcon
          vm.status.loadingItem = "";
          vm.cartlist = response.data.data;
          vm.total_price = response.data.data.final_total;
      })
    },
    delCart(id){
      const vm = this;
      console.log(id);
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}}`;
      vm.isLoading = true;
      this.$http.delete(api).then((response) => {
        console.log(response.data);
        vm.isLoading = false;
        console.log(vm.cartlist);
        // if(response.data.success){
        //   alert(response.data.message);
        //   vm.getCart();
        // }else{
        //   alert('刪除失敗！')
        //   vm.getCart();
        // }
        $("#dropcartModal").modal('hide');
      })
    },
    opendropModal(item){
      const vm = this;
      vm.tempCart = item;
      console.log(vm.tempCart);
      $("#dropcartModal").modal('show');

    },
    dropcart(id){
      const vm = this;
      const Url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      this.$http.delete(Url).then((response) => {
        console.log(response.data);
        vm.getCart();
      })
    },
  },
  created(){
    const vm = this;
    this.$bus.$on('page:pages' ,(page) =>{
      vm.getProducts(page);
    })
    vm.getProducts();
    vm.getCart();
  }
}
</script>

<style lang="css" scoped>
</style>
