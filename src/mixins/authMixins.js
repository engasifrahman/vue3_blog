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
        }
    }
}