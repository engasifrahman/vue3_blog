import axios from "axios";

export default {
    data: () => ({
        authUser: {},
        authToken: '',
    }),
    created() {
        // console.log(`Auth mixin initiated from - ${this.$route.name} - route`);

        this.reloadAuthData();
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