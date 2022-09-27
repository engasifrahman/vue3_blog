<template>
    <ul class="list-group">
        <li v-if="isSuperAdmin" class="list-group-item">
            <RouterLink class="nav-link text-center" to="/dashboard/users">Users</RouterLink>
        </li>
        <li class="list-group-item">            
            <RouterLink class="nav-link text-center" to="/dashboard/posts">Posts</RouterLink>
        </li>
        <li class="list-group-item">
            <RouterLink class="nav-link text-center" to="/dashboard/comments">Comments</RouterLink>
        </li>
    </ul>
</template>

<script>
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';
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
        data: () => ({
            // 
        }),
        created() {
            if (!this.authToken) {
                this.$router.push({name: 'login'});
            }
        },
        computed: {
            isSuperAdmin: function(){
                let roles = this.authUser?.roles || [];
                // console.log('roles :>> ', roles);

                let superAdmin = false;
                roles.forEach((item) => {
                    // console.log(item);

                    if(item?.name == 'Super Admin'){
                        superAdmin = true;
                    }
                });

                return superAdmin;
            }
        }
    }
</script>