<template>
  <div class="hello m-4">
    <h1>我是首頁</h1>
    <h2>{{msg}}</h2>
    <a href="#" class="btn btn-outline-primary" @click.prevent="singout" >logout</a>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Vue.js App'
    }
  },
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #62b980;
}
</style>
