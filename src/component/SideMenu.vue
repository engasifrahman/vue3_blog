<template>
    <ul class="list-group">
        <li v-if="isSuperAdmin" class="list-group-item">
            <RouterLink class="nav-link text-center" to="/dashboard/users">Users</RouterLink>
        </li>
        <li class="list-group-item">            
            <RouterLink class="nav-link text-center" to="/dashboard/posts">Posts</RouterLink>
        </li>
        <li class="list-group-item">
            <RouterLink class="nav-link text-center" to="/dashboard/comments">Comments</RouterLink>
        </li>
    </ul>
</template>

<script>
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';

    export default {
        name: "SideMenu",
        async setup(){
            // 
        },
        data: () => ({
            // 
        }),
        created() {
            console.log('Side Menu Created');
        }
    }
</script>

<style scoped>
.router-link-exact-active{
    color: #0DCAF0;
}
</style>