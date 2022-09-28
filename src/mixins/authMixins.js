import { ref } from 'vue';
import { useAxios } from '@/composables/axios.js';

export default {
    setup(){
        let req_url = ref('/login');
        let req_config = ref({
            method: 'POST',
            data: {}
        });

        const { excecuteAxios } = useAxios();
        
        return { req_url, req_config, excecuteAxios };
    },
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