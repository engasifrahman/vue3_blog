<template>
    <div class="row">
        Posts will come here
    </div>

</template>

<script>
    import { ref } from 'vue';
    import { useAxios } from '@/composables/axios.js';

    export default {
        name: "Posts",
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
            console.log('Posts Created');
        }
    }
</script>