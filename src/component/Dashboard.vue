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
    import { ref } from 'vue';
    import { RouterView } from 'vue-router';
    import SideMenu from '@/component/SideMenu.vue';
    import { useAxios } from '@/composables/axios.js';

    export default {
        name: "Login",
        async setup(){
            let req_url = ref('/login');
            let req_config = ref({
                method: 'POST',
                data: {}
            });

            const { excecuteAxios } = useAxios();
            
            return { req_url, req_config, excecuteAxios };

            // const { axios_result, axios_errors, is_axios_finished } = await useAxios(req_url, req_config);

            // return { req_url, req_config, axios_result, axios_errors, is_axios_finished, excecuteAxios };
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
            if (!this.authToken) {
                this.$router.push({name: 'login'});
            } else{
                this.$emitter.emit('loadingStatus', false);
            }
        },
    }
</script>