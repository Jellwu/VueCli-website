<template>
  <div>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': pagination.has_pre === false}">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pagination.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="pages in pagination.total_pages" :key="pages"
        :class="{'active':pagination.current_page === pages}">
          <a class="page-link" href="#" @click.prevent="getProducts(pages)">{{ pages }}</a>
        </li>
        <li class="page-item" :class="{'disabled': pagination.has_next === false}">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="getProducts(pagination.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default{
  name:'Pagination',
  data() {
    return {
      pagination:{},
      products:[],
    };
  },
  // 函式區
  methods: {
      updatePage(total_pages,current_page,has_pre,has_next){
        this.pagination = {
          total_pages,
          current_page,
          has_pre,
          has_next,
        };
        console.log(this.pagination);
      },
      // 預設page為1，設定為參數丟到$bus準備給外層取用
      getProducts(page = 1){
        const vm = this;
        vm.$bus.$emit('page:pages',(page))
        }
    },
// 頁面建立時呼叫
  created(){
      const vm = this;
      // 取用外部給的page:push，取完之後丟到內部的pagination(on監聽方法)
      vm.$bus.$on('page:push',(total_pages,current_page,has_pre,has_next) => {
        vm.updatePage(total_pages,current_page,has_pre,has_next);
     });
     // 在頁面開始時就先呼叫預設分頁為1的產品列表function
     vm.getProducts();
    }
  }

</script>
