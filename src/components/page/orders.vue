<template>
  <div>
    <div class="text-right mb-4">
      <button type="button" class="btn btn-primary" @click="openPdcModal(true)">
         新增訂單
        </button>
    </div>
    <table class="table mt-4">

    </table>
  </div>

</template>

<script>
export default {
  data(){
    return{
      orders:[],
    }
  },
    methods:{
      getorder(page = 1){
        const vm = this;
        const Url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/orders?page=${page}`;
        this.$http.get(Url).then((response) =>{
          vm.orders = response.data.orders;
          console.log(vm.orders);
        })
      }
    },
  created(){
    const vm = this;
    vm.getorder();
  }
}
</script>

<style lang="css" scoped>
</style>
