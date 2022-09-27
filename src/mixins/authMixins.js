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
    },
    watch: {
        authToken: function(val, oldVal){
            if(val !== oldVal){
                console.log(`authToken watch from ${this.$route.name} route :>> `, val);

                if (!val && this.$route.name !== 'blog'){
                    this.$router.push({name: 'login'});
                }
            }
        }    
    }
}