<template>
  <div>
    <div class="text-right">
      <button type="button" class="btn btn-primary" @click="openPdcModal(true)">
        建立新產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120px">分類</th>
          <th>產品名稱</th>
          <th width="120px" class="text-right">原價</th>
          <th width="120px" class="text-right">售價</th>
          <th width="80px">啟用</th>
          <th width="150px">功能</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price}}</td>
          <td class="text-right">{{item.price}}</td>
          <td v-if="item.is_enabled" class="text-success">啟用</td>
          <td v-else="item.is_enabled" class="text-danger">未啟用</td>
          <td>
            <button class="btn btn-outline-dark" @click="openPdcModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="pdcModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>新增產品</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label for="image">輸入圖片網址</label>
              <input type="text" class="form-control" id="image"
                placeholder="請輸入圖片連結" v-model="tempProducts.image">
            </div>
            <div class="form-group">
              <label for="customFile">或 上傳圖片
                <i class="fas fa-spinner fa-spin"></i>
              </label>
              <input type="file" id="customFile" class="form-control"
                ref="files">
            </div>
            <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
              class="img-fluid" alt="">
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title"
                placeholder="請輸入標題" v-model="tempProducts.title">
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input type="text" class="form-control" id="category"
                  placeholder="請輸入分類" v-model="tempProducts.category">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input type="unit" class="form-control" id="unit"
                  placeholder="請輸入單位" v-model="tempProducts.unit">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
              <label for="origin_price">原價</label>
                <input type="number" class="form-control" id="origin_price"
                  placeholder="請輸入原價" v-model="tempProducts.origin_price">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input type="number" class="form-control" id="price"
                  placeholder="請輸入售價" v-model="tempProducts.price">
              </div>
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea type="text" class="form-control" id="description"
                placeholder="請輸入產品描述" v-model="tempProducts.description"></textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea type="text" class="form-control" id="content"
                placeholder="請輸入產品說明內容" v-model="tempProducts.content"></textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                  id="is_enabled" v-model="tempProducts.is_enabled" :true_value="1" :false_value="0">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" @click="updateProducts">確認</button>
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
      products:[], //用來顯示產品列表的資料
      tempProducts:{}, //用來接使用者輸入的資料
      isNew:false,
    };
  },

  methods:{
    getProducts(){
      const vm = this;
        // 將api以環境變數取代
      const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`
        this.$http.get(api).then((response) =>{
          vm.products = response.data.products;
        })
      },

      // 此為開啟modal視窗的方法，利用此方法可以讓行為在任何生命週期內工作
      // 傳入isNew與item參數，如果傳入isNew=true就設定tempProducts為空物件，準備接使用者填寫資訊
      openPdcModal(isNew ,item){
        if(isNew){
          this.tempProducts = {};
          this.isNew = true;
      // 若傳入的isNew為false，就將參數傳入將參數指定給tempProdcust，準備讓使用者修改
        }else{
          // object.assign({},物件)是將物件丟到一個空的陣列，以解決因參考值影響兩個變數的問題
          this.tempProducts = Object.assign({},item);
          this.isNew = false;
        }
        $('#pdcModal').modal('show');
      },
      updateProducts(){
        const vm = this;
        let api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
        let httpMethod = 'post';
        // 如果isNew為false的話就是更新內容，需要跑更新的api
        if(!vm.isNew){
          api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProducts.id}`;
          // 修改呼叫api的行為，設定為'put'
          httpMethod = 'put';
        }
        // 在這一段會去連接api並傳入指定的參數，在這邊就是接使用者資料的tempProducts
        // api結構為物件包一個data物件，需注意api給的格式
          this.$http[httpMethod](api,{ data:vm.tempProducts }).then((response) =>{
            //用回傳值判斷須什麼動作
            if(response.data.success){
              alert(response.data.message);
              $('#pdcModal').modal('hide');
              vm.getProducts();
            }else{
              alert("新增失敗!!");
              $('#pdcModal').modal('hide');
              vm.getProducts();
            }
          })
      }
    },
  //在created階段的時候呼叫methods，記得要加this
  created(){
    this.getProducts();
  }
}
</script>

<style lang="css" scoped>
</style>
