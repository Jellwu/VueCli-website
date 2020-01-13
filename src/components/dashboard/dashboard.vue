<template>
    <div class="m-4">
    <Alert/>
      <Navbar/>
      <div class="container-fluid">
        <div class="row">
          <Sidebar/>
          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <router-view/>
            <Pagenation/>
          </main>
        </div>
      </div>

  </div>
</template>

<script>
import Navbar from './navbar.vue';
import Sidebar from './sidebar.vue';
import Alert from './alertMsg.vue';
import Pagenation from './pagination.vue';

export default{
  components:{
    Navbar,
    Sidebar,
    Alert,
    Pagenation
  }
}

</script>
