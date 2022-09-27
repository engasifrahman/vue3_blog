<template>
  <div v-if="loadingStatus" class="center-spinner">
    <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div :class="{'d-none': loadingStatus}">
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <RouterLink class="navbar-brand" to="/">Blog</RouterLink>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink class="nav-link" :to="authToken ? '/dashboard' : '/login'">{{ authToken ? 'Dashboard' : 'Login' }}</RouterLink>
              </li>
            </ul>
          </div>
          <div v-if="authToken" class="d-flex me-3">
            <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
          </div>
        </div>
      </nav>
    </header>

    <div class="container">
      <Suspense>
        <!-- main content -->
        <RouterView />

        <!-- loading state -->
        <template #fallback>
          Suspense Loading...
        </template>
      </Suspense>
    </div>
</div>

</template>

<script>
  import { RouterLink, RouterView } from 'vue-router';

  export default {
    name: 'App',
    data: () => ({
      loadingStatus: false,
    }),
    created() {
      this.reloadAuthData();

      this.$emitter.on("loadingStatus", payload => { 
        this.loadingStatus = payload;
      });

      this.$emitter.on("reloadAuthData", payload => { 
        if(payload){
          this.reloadAuthData();
        }
      });
    },
    watch: {
      $route: {
        immediate: true,
        handler(to, from) {
          document.title = to.meta.title || 'Blog page';
        }
      },
    },
    methods: {
      logout: function(){
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");

        this.reloadAuthData();

        this.$router.push({name: 'blog'});
      }
    }
  };
</script>

<style scoped>
  .center-spinner {
    display: flex;
    justify-content: center;
    align-items: center; 
    height: 100vh;
  }
</style>
