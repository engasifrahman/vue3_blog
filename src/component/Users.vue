<template>
    <div class="row">
        Users will come here
    </div>

</template>

<script>
    export default {
        name: "Users",
        async setup(){
            // 
        },
        data: () => ({
            // 
        }),
        created() {
            console.log('Users Created');

            if(!this.authToken){
                this.$router.push({name: 'login'});
            }
        }
    }
</script>