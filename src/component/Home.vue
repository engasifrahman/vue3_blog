<template>
    <div v-for="(post, index) of posts" :key="index">
        <h4>{{ post.title }}</h4>
        <p>{{ post.body }}</p>
    </div>
</template>

<script>
import { useFetch } from '../composables/fetch.js';
import { ref, computed } from 'vue';

export default {
    setup() {
        let fetch_method = ref('get')
        let fetch_url = ref('http://localhost:8000/api/v1/posts');

        let { posts, errors } = useFetch(fetch_method, fetch_url);

        setTimeout(function() {
            console.log('posts :>> ', posts);
            console.log('errors :>> ', errors);
        }, 2000);

        return { posts, errors };
    },
    data: () => ({
        // posts: {}
    }),
    created() {
        var _this = this;
        setTimeout(function() {
            console.log(_this.posts);
        }, 2000);
    },
    mounted() {
        var _this = this;
        setTimeout(function() {
            console.log(_this.posts);
        }, 2000);
    },
    updated() {
        // 
    },
    methods: {
        init: function(){
            var _this = this;
            console.log('Hello');
            this.$axios.get('http://localhost:8000/api/v1/posts')
            .then(function(res) {
                console.log('res', res);

                _this.posts = Object.assign({}, res.data.data);
                console.log('_this.posts', _this.posts);
            });
        }
    },
    computed: {
        // 
    }
}
</script>

