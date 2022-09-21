<template>
    <div v-for="(post, index) of posts" :key="index">
        <h4>{{ post.title }}</h4>
        <p>{{ post.body }}</p>
    </div>
</template>

<script>

export default {
    data: () => ({
        name: 'Asif',

        posts: {}
    }),
    created() {
        this.init();
    },
    mounted() {

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

    }

}
</script>

