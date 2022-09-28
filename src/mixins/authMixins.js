import axios from "axios";

export default {
    data: () => ({
        authUser: {},
        authToken: '',
    }),
    created() {
        this.reloadAuthData();
    },
    methods: {
        reloadAuthData: function(){
            this.authUser = JSON.parse(localStorage.getItem("auth_user"));
            this.authToken = localStorage.getItem("auth_token");

            if (this.authToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
            }

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