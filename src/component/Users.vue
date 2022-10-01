<template>
    <div class="row">
        <div class="py-2 bg-info text-white">
            <h5 class="mb-0">Users</h5>
        </div>
        <table class="table table-bordered table-responsive">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Created at</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in users" :key="index">
                    <td>{{ index+1 }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.created_at }}</td>
                    <td>
                        <span role="button" class="text-danger" @click="deleteUser(index, user.id)"><font-awesome-icon icon="fa-regular fa-trash-can" /></span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { useAxios } from '@/composables/useAxios.js';
    
    export default {
        name: "Users",
        async setup(){
            let req_url = ref('/user');
            let req_config = ref({
                method: 'GET',
                data: {}
            });

            const { excecuteAxios } = useAxios();
            
            // return { req_url, req_config, excecuteAxios };

            const { axios_result, axios_errors, is_axios_finished } = await useAxios(req_url, req_config);

            return { req_url, req_config, axios_result, axios_errors, is_axios_finished, excecuteAxios };
            },
        data: () => ({
            users: []
        }),
        created() {
            console.log('Users Created');

            this.$emitter.emit('loadingStatus', true);

            if (this.isSuperAdmin) {
                this.$router.push({name: 'dashboard.users'});
            } else {
                this.$router.push({name: 'dashboard.posts'});
            }
        },
        watch: {
            axios_result: {
                handler(newValue, oldValue) {
                    console.log('Users response :>> ', newValue);
                    this.users = newValue?.data || [];
                    this.$emitter.emit('loadingStatus', false);
                },
                deep: true
            },
            axios_errors: {
                handler(newValue, oldValue) {
                    console.log('Users response error :>> ', newValue);

                    this.reqErrorMessage = newValue?.message;
                },
                deep: true
            }
        },
        methods: {
            async deleteUser(index, id){
                this.req_url = `user/${id}`;
                this.req_config.method = 'DELETE';
                this.req_config.data = {};

                const { result, errors, is_finished } = await this.excecuteAxios(this.req_url, this.req_config);
                this.reqErrorMessage = errors?.message;

                if(is_finished){
                    this.$emitter.emit('loadingStatus', false);

                    console.log('User delete response :>> ', result);

                    if(!errors){
                        delete this.users[index];
                    }
                }
            }
        }
    }
</script>