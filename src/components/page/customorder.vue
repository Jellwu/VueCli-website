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

    <h4 class="text-center text-secondary">購物車列表</h4>
    <div class="row mt-5 mb-5 justify-content-md-center">
      <div class="col-6 mt-2 ">
        <table class="table" v-if="cartlist.total !== 0">
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
              <td> {{ items.product.title }}
                <p class="text-success" v-if="items.coupon">
                  已套用優惠券
                </p>
              </td>
              <td> {{ items.qty }} / {{ items.product.unit}}</td>
              <td> {{ items.product.price | currency }} <br>
                <p class="text-success" v-if = "items.coupon">
                  {{ items.final_total | currency }}
                </p>
              </td>

            </tr>
            <tr>
              <td colspan="2"></td>
              <td>總計：</td>
              <td>{{ cartlist.total | currency}}</td>
            </tr>
            <tr class="text-success" v-if=" cartlist.final_total !== cartlist.total">
              <td colspan="2"></td>
              <td>折扣價：</td>
              <td>{{ cartlist.final_total | currency}}</td>
            </tr>
            <tr>
              <td colspan="3">
                <input type="text" class="form-control" placeholder="輸入優惠券號碼" v-model="cuponCode">
              </td>
              <td class="text-right" colspan="2">
                <button class="btn btn-outline-success" @click="getCoupon()">
                  <i class="fas fa-ticket-alt"></i>
                  優惠券
                </button>
              </td>
            </tr>
          </tbody>
        </table>


      </div>
    </div>


    <h4 class="text-center text-secondary">訂單結帳</h4>
    <!-- <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="submit"> -->
      <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form">
      <div class="my-5 row justify-content-center">
      <form class="col-md-7">
        <ValidationProvider rules="required|email" name="e-mail" v-slot="{ valid, errors }" ref="emailField">
          <div class="form-group ">
            <label for="useremail">Email</label>
            <input type="email" class="form-control" name="email" id="useremail"
            v-model="form.user.email" placeholder="請輸入 Email"
            :class="{'is-invalid':errors[0]}">
            <span class="text-danger" v-if="errors[0]">{{errors[0]}}</span>
          </div>
        </ValidationProvider>

        <ValidationProvider rules="required" name="姓名" v-slot="{ errors }">
          <div class="form-group">
              <label for="username">收件人姓名</label>
              <input type="text" class="form-control" name="name" id="username"
                v-model="form.user.name" placeholder="輸入姓名"
                :class="{'is-invalid':errors[0]}">
              <span class="text-danger" v-if="errors[0]">{{ errors[0] }}</span>
            </div>
        </ValidationProvider>

        <ValidationProvider rules="required|numeric|digits:10" name="電話" v-slot="{ errors }">
          <div class="form-group">
            <label for="usertel">收件人電話</label>
            <input type="tel" class="form-control" id="usertel" v-model="form.user.tel"
            placeholder="請輸入電話" :class="{'is-invalid':errors[0]}">
            <span class="text-danger" v-if="errors[0]">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <ValidationProvider rules="required" name="地址" v-slot="{ errors }">
          <div class="form-group">
            <label for="useraddress">收件人地址</label>
            <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address"
              placeholder="請輸入地址" :class="{'is-invalid':errors[0]}">
            <span class="text-danger" v-if="errors[0]">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>
          <div class="form-group">
              <label for="comment">留言</label>
              <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
          </div>
          <div class="form-group text-right">
              <button class="btn btn-danger" @click.prevent="createOrder" :disabled="invalid">送出訂單</button>
          </div>
      </form>
      </div>
    </ValidationObserver>


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
            <div class="modal-header bg-danger">
              <h5 class="modal-title text-light" id="exampleModalLabel">刪除確認</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <h5>是否刪除</h5>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-danger" @click="dropcart(tempCart.id)">確認</button>
            </div>
          </div>
        </div>
      </div>

</div>
</template>

<script>
import $ from 'jquery';
import { ValidationObserver } from 'vee-validate';
import { ValidationProvider } from 'vee-validate';

export default {
  data(){
    return{
      products:[],
      product:{},
      pagination:{},
      cartlist:{},
      tempCart:{},
      cuponCode:'',
      status:{
        loadingItem:'',
      },
      isLoading:false,
      form:{
        user:{
          name:'',
          email:'',
          tel:'',
          address:'',
        },
        message:''
      }
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
          vm.status.loadingItem = '';
          vm.cartlist = response.data.data;
      })
    },
    getCoupon(){
      const vm = this;
      const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const cupon = {
        code:vm.cuponCode
      };
      this.$http.post(api, {data:cupon}).then((response) =>{
        if(response.data.success){
          alert(response.data.message);
        }else{
          alert(response.data.message);
          vm.cuponCode='';
        }
        vm.getCart();
      })
    },
    opendropModal(item){
      const vm = this;
      vm.tempCart = item;
      console.log(vm.tempCart)
      // console.log(vm.tempCart);
      $("#dropcartModal").modal('show');
    },
    dropcart(id){
      const vm = this;
      const Url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(Url).then((response) => {
        vm.isLoading = false;
        if(response.data.success){
          console.log(response.data.message)
        }else{
          console.log("刪除失敗！")
        }
        vm.getCart();
        $("#dropcartModal").modal('hide');
      })
    },
    createOrder(){
      const vm = this;
      const order = vm.form;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      // const isValid = this.$refs.observer.validate();
      this.$http.post(api, {data:order}).then((response) =>{
        console.log(response.data);
        if(response.data.success){
          vm.$router.push(`/CustomorderCheckout/${response.data.orderId}`);
        }
        else{
          alert(response.data.message)
          vm.getProducts();
          vm.getCart();
        }
      })
    }
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
