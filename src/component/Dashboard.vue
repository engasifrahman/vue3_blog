<template>
    <div class="row mt-3">
        <div class="col-sm-2">
            <SideMenu />
        </div>
        <div class="col-sm-10">
            <RouterView />
        </div>
    </div>

</template>

<script>
    import { RouterView } from 'vue-router';
    import SideMenu from '@/component/SideMenu.vue';

    export default {
        name: "Dashboard",
        async setup(){
            // 
        },
        components: {
            SideMenu
        },
        data: () => ({
            user: {
                email: "eng.asifrahman@gmail.com",
                password: "12345678",
                device_name: "Default Device"
            },
        }),
        created() {
            console.log('Dashboard Created');

            if(!this.authToken){
                this.$router.push({name: 'login'});
            }
        }
    }
</script>