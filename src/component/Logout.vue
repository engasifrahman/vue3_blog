<template>
    <div class="center-spinner">
    <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Logout",
        data: () => ({

        }),
        created() {
            if (!this.authToken) {
                this.$router.push({name: 'blog'});
            } else{
                this.logout();
            }
        },
        methods: {
            logout: function() {
                localStorage.removeItem("auth_user");
                localStorage.removeItem("auth_token");

                this.authUser = {};
                this.authToken = '';

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