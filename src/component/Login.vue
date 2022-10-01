<template>
    <div class="col-sm-8 offset-sm-2 login-form">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title text-center">LOGIN</h5>
                <form>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email</label>
                        <input type="email" class="form-control" v-model="user.email" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" v-model="user.password" required>
                    </div>
                    <!-- <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1">
                        <label class="form-check-label" for="exampleCheck1">Check me out</label>
                    </div> -->
                    <div class=" text-center">
                        <button type="submit" class="btn btn-primary" @click.prevent="login">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
</template>

<script>
    import { ref } from 'vue';
    import { useAxios } from '@/composables/useAxios.js';

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
        },
        data: () => ({
            user: {
                email: "eng.asifrahman@gmail.com",
                password: "12345678",
                device_name: "Default Device"
            },
        }),
        created() {
            console.log('Login Created');
            
            if (this.authToken) {
                this.$router.push({name: 'dashboard'});
            }
        },
        methods: {
            async login() {
                this.$emitter.emit("loadingStatus", true);
                this.req_config.data = this.user;

                const { result, errors, is_finished } = await this.excecuteAxios(this.req_url, this.req_config);

                if(is_finished){
                    this.$emitter.emit('loadingStatus', false);

                    console.log('login response :>> ', result);

                    if(!errors){
                        this.user.email = '';
                        this.user.password = '';

                        let authUser = Object.assign({}, result?.data?.user);
                        let authToken = result?.data?.token || '';

                        localStorage.setItem("auth_user", JSON.stringify(authUser));
                        localStorage.setItem("auth_token", authToken);
            
                        this.$emitter.emit('reloadAuthData', true);
            
                        this.$router.push({name: 'dashboard'});
                    }
                }
            }
        }
    };
</script>

<style scoped>
    .login-form{
        height: calc(100vh - 100px);
        align-items: center;
        justify-content: center;
        /* margin: auto; */
        display: flex;
    }
</style>