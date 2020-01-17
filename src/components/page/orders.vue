<template>
  <div>
    <h4 class="mb-5 text-center">訂購清單</h4>
    <table class="table mt-5">
      <thead class="bg-primary text-white" >
          <td width="200px">訂購時間</td>
          <td width="150px">訂購人姓名</td>
          <td>訂購品項</td>
          <td width="150px">價格</td>
          <td width="100px">是否付款</td>
      </thead>
      <tbody>
        <tr v-for = "order in orders" :key="order.id">
          <td>{{ order.create_at|timeTranse }}</td>
          <td>{{ order.user.name }}</td>
          <td>
            <!-- 陣列下的第二層物件，包兩個v-for -->
            <div v-for ="items in order.products" :key="items.id">
              {{items.product.title}} / {{items.product.num}} {{items.product.unit}}
            </div>
          </td>
          </td>
          <td>{{ order.total|currency }}</td>
          <td v-if="order.is_paid" class="text-success"> 完成付款</td>
          <td v-else class="text-danger">尚未付款</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
export default {
  data(){
    return{
      orders:{},
      pagination:{}
    }
  },
    methods:{
      getorder(page = 1){
        const vm = this;
        const Url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/orders?page=${page}`;
        this.$http.get(Url).then((response) =>{
          vm.orders = response.data.orders;
          vm.pagination = response.data.pagination
          this.$bus.$emit('page:push',vm.pagination.total_pages,vm.pagination.current_page,vm.pagination.has_pre,vm.pagination.has_next);
        })
      }
    },
  created(){
    const vm = this;
    this.$bus.$on('page:pages' ,(page) =>{
      vm.getorder(page);
    })
    vm.getorder();
    let timestamp = 1513598707
    let date = new Date(timestamp * 1000)
    console.log(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
  }
}
</script>

<style lang="css" scoped>
</style>
