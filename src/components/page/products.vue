<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mb-4">
      <button type="button" class="btn btn-primary" @click="openPdcModal(true)">
        新增產品
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
          <td class="text-right">{{item.origin_price | currency }} </td>
          <td class="text-right">{{item.price | currency }} </td>
          <td v-if="item.is_enabled" class="text-success">啟用</td>
          <td v-else="item.is_enabled" class="text-danger">未啟用</td>
          <td>
            <button class="btn btn-outline-dark" @click="openPdcModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger"@click="opendropModal(item)">刪除</button>
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
                placeholder="請輸入圖片連結" v-model="tempProducts.imageUrl">
            </div>
            <div class="form-group">
              <label for="customFile">或 上傳圖片
                <i class="fas fa-sync fa-spin text-success" v-if="status.preuploadFile"></i>
              </label>
              <input type="file" id="customFile" class="form-control"
                ref="files" @change="uploadFile">
            </div>
            <img :src="tempProducts.imageUrl"
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
                  id="is_enabled" v-model="tempProducts.is_enabled" :true-value="1" :false-value="0">
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

<!-- dropModel -->
    <div class="modal fade" id="dropModel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">刪除確認</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="p-2" v-model="tempProducts.title">
                <span class="text-danger font-weight-bold">是否刪除{{tempProducts.title}}?</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="dropProducts(tempProducts)">刪除</button>
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
      isLoading:false,
      status:{
        preuploadFile:false,
      },
      pagination:{},  //用來接回傳的分頁資料
    };
  },

  methods:{
    //ES6方法：預設參數，在未有參數傳入前，此函式的page變數皆為"1"
    getProducts(page){
      const vm = this;
        // 將api以環境變數取代
        vm.isLoading = true;
        //將api後方加上?page=頁數，即可直接轉跳到指定頁數
      const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`
        this.$http.get(api).then((response) =>{
          vm.isLoading = false;
          vm.products = response.data.products;
          vm.pagination = response.data.pagination;
          console.log(vm.products);
          //  將外層拿到的參數丟到$bus準備給內層取用
          this.$bus.$emit('page:push',vm.pagination.total_pages,vm.pagination.current_page,vm.pagination.has_pre,vm.pagination.has_next);
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
      opendropModal(item){
        $('#dropModel').modal('show');
        this.tempProducts = item;
        // console.log(this.tempProducts);
      },
      updateProducts(){
        const vm = this;
        let api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
        //此段是讓api呼叫的方式可以因不同條件修改，原本新增的本身就為put
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
      },

      // 刪除產品Function
      dropProducts(item){
        const vm = this;
        let api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${item.id}`;
        // console.log(item.id);
        this.$http.delete(api, item.id).then((response) =>{
          if(response.data.success){
            alert(`已成功刪除 ${item.title}`);
          }else{
            alert("刪除失敗!!");
          }
          vm.getProducts();
          $('#dropModel').modal('hide');
        })
      },

      // 上傳圖片Funtion
     uploadFile(){
       const uploadedFile = this.$refs.files.files[0];
       const vm = this;
       const formData = new FormData();
       formData.append('file-to-file',uploadedFile);
       vm.status.preuploadFile = true;
       // console.log(formData);
       const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
       //post(網址, 檔案本身, 格式物件)
       this.$http.post(api, formData, {
         headers:{
           'Content-Type':'multipart/form-data'
         }
       }).then((response)=>{
         vm.status.preuploadFile = false;
         if(response.data.success){
           // formData直接塞入值會無法雙向綁定(set,get方法未正常)，需要用$set強制寫入
           // vm.tempProducts.imageUrl = response.data.imageUrl;
           // vm.$set(要寫入的變數, 要寫入的欄位, 寫入的值)
           vm.$set(vm.tempProducts,'imageUrl',response.data.imageUrl);
         }else if(response.data.message.message === 'File too large'){
           this.$bus.$emit('message:push','檔案格式錯誤','success');
         }else{
           this.$bus.$emit('message:push',response.data.message,'success');
         }
       })
     }
    },
  //在created階段的時候呼叫methods，記得要加this
  created(){
    const vm = this;
    // 取用內層給的page:pages，將參數丟到getProducts
    this.$bus.$on('page:pages' ,(page) =>{
      vm.getProducts(page);
    })
    vm.getProducts();
  }
}
</script>

<style lang="css" scoped>
</style>
