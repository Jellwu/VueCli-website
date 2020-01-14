<template>
<div>
  <loading :active.sync="isLoading"></loading>
  <div class="text-right mb-4">
    <button type="button" class="btn btn-primary" @click="openCouponModal(true)">
      新增優惠券
    </button>
    <div class="container mt-5">
      <div class="row mt-5 justify-content-md-center">
        <div class="col-md-10 mt-2">
          <table class="table">
            <thead class="bg-secondary text-white">
              <tr>
                <td width="65px" class="text-center">功能</td>
                <td class="text-left">標題</td>
                <td width="150px">折扣數</td>
                <td width="230px">折扣碼</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(items) in coupon" :key="items.id">
                <td>
                  <button class="btn btn-outline-danger form-control" @click="opendelCoupon(items)">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button class="btn btn-outline-success form-control mt-1" @click="openCouponModal(false, items)">
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
                <td class="text-left align-middle h6">{{ items.title }}</td>
                <td class="align-middle h6">{{ items.percent}}</td>
                <td class="align-middle h6">{{ items.code}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>

  <!-- CouponModal -->
  <div class="modal fade" id="CouponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">新增優惠券</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="category">標題</label>
              <input type="text" class="form-control" id="title" v-model="tempCoupon.title" placeholder="請輸入標題">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="price">優惠折扣數</label>
              <input type="number" class="form-control" id="percent" v-model="tempCoupon.percent" placeholder="百分比數值">
            </div>
            <div class="form-group col-md-6">
              <label for="origin_price">優惠碼</label>
              <input type="text" class="form-control" id="code" v-model="tempCoupon.code" placeholder="請輸入優惠碼">
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="is_enabled" v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="addCoupon">送出</button>
        </div>
      </div>
    </div>
  </div>
  <!-- couponDel -->
  <div class="modal fade" id="couponDelModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">刪除視窗</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
              <h5>確認刪除  <span class="text-danger">{{ tempCoupon.title }}</span>？</h5>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="dropCoupon(tempCoupon.id)">確認</button>
          </div>
        </div>
      </div>
    </div>

</div>
</div>
</div>
</div>
</template>

<script>
import $ from 'jquery';
export default {
  data() {
    return {
      coupon: [],
      tempCoupon: {},
      isNew:false,
      isLoading: false,
      pagination: {},
    }
  },
  methods: {
    openCouponModal(isNew ,item) {
      if(isNew){
        this.tempCoupon = {};
        this.isNew = true;
      }else{
        this.tempCoupon = Object.assign({},item);
        this.isNew = false;
      }
      $('#CouponModal').modal('show');
    },
    opendelCoupon(items){
      const vm = this;
      vm.tempCoupon = items;
      $('#couponDelModal').modal('show');
    },
    addCoupon() {
      const vm = this;
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      const timestamp = Date.now();
      vm.tempCoupon.due_date = timestamp;
      let httpMethod = 'post'
      if(!vm.isNew){
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        // 修改呼叫api的行為，設定為'put'
        httpMethod = 'put';
      }
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          vm.showCoupon();
        } else {
          alert('新增失敗！')
          vm.showCoupon();
        }
      })
      $('#CouponModal').modal('hide');
    },
    showCoupon(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        // console.log(response.data.coupons);
        vm.isLoading = false;
        vm.coupon = response.data.coupons;
        vm.pagination = response.data.pagination;
        console.log(response.data)
        //  將外層拿到的參數丟到$bus準備給內層取用
        this.$bus.$emit('page:push', vm.pagination.total_pages, vm.pagination.current_page, vm.pagination.has_pre, vm.pagination.has_next);
      })
    },
    dropCoupon(id){
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${id}`;
      vm.isLoading = true;
      this.$http.delete(api).then((response) =>{
        vm.isLoading = false;
        vm.showCoupon();
        if(response.data.success){
          alert(response.data.message)
        }else{
          alert("刪除失敗！")
        }
      })
      $('#couponDelModal').modal('hide');
    }
  },
  created() {
    const vm = this;
    this.$bus.$on('page:pages', (page) => {
      vm.showCoupon(page);
    })
    vm.showCoupon();
  }
}
</script>

<style lang="css" scoped>
</style>
