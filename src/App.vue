<template>
  <div id="app">
    <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a href="#" class="nav-link" @click.prevent="singout" >logout</a>
          </li>
        </ul>
      </div>
    </nav> -->
    <div class="pt-3">
      <!-- <HelloWorld></HelloWorld> -->
      <router-view/>
    </div>
  </div>
</template>


<script>
export default {
  name: 'App',
  methods:{
    singout(){
      const api = `${process.env.APIPATH}/logout`;
      const vm = this;
      this.$http.post(api).then((response) =>{
        if(response.data.success){
          alert(response.data.message);
          this.$router.push('/login');
        }
      })
    }
  }
  // created(){
  //   //API伺服器路徑/api/申請的路徑/products
  //   // const api='https://vue-course-api.hexschool.io/api/jfswujfs/products'
  //   // 將api以環境變數取代
  //   // const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`
  //   // this.$http.get(api).then((response) =>{
  //   //   console.log(response.data);
  //   // })
  // }
}
</script>

<style lang="scss">
@import "./assets/all";
</style>
<!-- #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} -->
