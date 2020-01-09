<template>
    <div class="m-4">
      <Navbar/>
      <div class="container-fluid">
        <div class="row">
          <Sidebar/>
          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <router-view/>
          </main>
        </div>
      </div>
  </div>
</template>

<script>
import Navbar from './navbar.vue';
import Sidebar from './sidebar.vue';

export default{
  components:{
    Navbar,
    Sidebar
  }
}

</script>
