<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-primary flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
      <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">
        <ul class="navbar-nav px-3">
          <li class="nav-item text-nowrap">
            <a class="nav-link" href="#" @click.prevent="singOut" >Sign out</a>
          </li>
        </ul>
    </nav>
  </div>
</template>


<script>

export default {
name:'Navbar',
methods:{
  singOut(){
    const vm = this;
    const api = `${process.env.APIPATH}/logout`;
    this.$http.post(api).then((response) => {
      if(response.data.success){
        alert(response.data.message);
        vm.$router.push('/singin');
      }
    })
  }
}
}

</script>
