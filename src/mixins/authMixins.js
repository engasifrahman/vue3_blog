import axios from "axios";

export default {
    data: () => ({
        authUser: {},
        authToken: '',
        reqErrorMessage: ''
    }),
    created() {
        // console.log(`Auth mixin initiated from - ${this.$route.name} - route`);

        this.reloadAuthData();
    },
    watch: {
        reqErrorMessage: function(val, oldVal){
            if(val === 'You are unauthenticated'){
                localStorage.removeItem("auth_user");
                localStorage.removeItem("auth_token");

                this.reloadAuthData();

                this.$router.push({name: 'blog'});
            }
        }
    },
    methods: {
        reloadAuthData: function(){
            this.authUser = JSON.parse(localStorage.getItem("auth_user"));
            this.authToken = localStorage.getItem("auth_token");

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken || ''}`;
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
        },
        activeRoute: function () {
            return this.$route.name;
        }
    }
}