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
                <RouterLink class="nav-link" to="/">Home</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="authToken ? '/dashboard' : '/login'">{{ authToken ? 'Dashboard' : 'Login' }}</RouterLink>
              </li>
            </ul>
          </div>
          <div v-if="authToken" class="d-flex me-3">
            <ul class="navbar-nav">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {{ authUser?.name }}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a class="dropdown-item" href="#" @click="logout">Logout</a>
                  </li>
                </ul>
              </li>
            </ul>
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
          Suspense Loader...
        </template>
      </Suspense>
    </div>
</div>

</template>

<script>
  import { ref } from 'vue';
  import { useAxios } from '@/composables/axios.js';
  import { RouterLink, RouterView } from 'vue-router';

  export default {
    name: "App",
    data: () => ({
      loadingStatus: false,
    }),
    setup(){
      let req_url = ref('/login');
      let req_config = ref({
          method: 'POST',
          data: {}
      });

      const { excecuteAxios } = useAxios();
      
      return { req_url, req_config, excecuteAxios };
    },
    created() {
      console.log('App Created');

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
          document.title = to.meta.title || 'Blog';
        }
      },
    },
    methods: {
      async logout () {
        this.loadingStatus = true;

        this.req_url = '/logout';
        this.req_config.method = 'GET';

        const { result, errors, is_finished } = await this.excecuteAxios(this.req_url, this.req_config);

        if(is_finished){
          this.loadingStatus = false;

          if(errors){
              alert('Something went wrong!');
          } else {
            console.log('logout response :>> ', result);

            if (result?.success) {
              localStorage.removeItem("auth_user");
              localStorage.removeItem("auth_token");

              this.$axios.defaults.headers.common['Authorization'] = ``;

              this.reloadAuthData();

              if (this.$route.name !== 'blog'){
                this.$router.push({name: 'blog'});
              }
            } else {
              alert('Something went wrong!');
            }
          }
        }
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
  .router-link-active,
  .router-link-exact-active{
    color: black;
  }
</style>
