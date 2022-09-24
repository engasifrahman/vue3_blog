<template>
    <div class="accordion accordion-flush my-5" id="blog_accordion">
        <div class="accordion-item" v-for="(post, index) of posts" :key="index">
            <h2 class="accordion-header" :id="`flush_heading_${index}`">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush_collapse_${index}`" aria-expanded="false" :aria-controls="`flush_collapse_${index}`">
                    <span>{{ post.title }}</span>
                    <small class="text-muted" style="position: absolute; right: 60px;">{{ post.user.name }} <font-awesome-icon icon="fa-regular fa-clock" /> {{ post.created_at }} </small>
                </button>
            </h2>
            <div :id="`flush_collapse_${index}`" class="accordion-collapse collapse" :aria-labelledby="`flush_heading_${index}`" data-bs-parent="#blog_accordion">
                <p>{{ post.body }}</p>

                <h5>Comments</h5>
                <div class="ms-3"  v-for="(comment, index) of post.comments" :key="index">
                    <small class="text-muted">{{ comment.user.name }} <font-awesome-icon icon="fa-regular fa-clock" /> {{ comment.created_at }} </small>
                    <p>{{ comment.comment }}</p>
                </div>
                <div class="ms-3">
                    <small class="text-muted">Username</small>

                    <div class="mb-3">
                        <label for="write_comment" class="form-label text-secondary">Write a new comment</label>
                        <textarea class="form-control" id="write_comment" rows="3"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data: () => ({
        posts: {}
    }),
    created() {
        this.init();
    },
    mounted() {
        // 
    },
    updated() {
        // 
    },
    methods: {
        init: function(){
            var _this = this;
            this.$axios.get('http://localhost:8000/api/v1/posts')
            .then(function(res) {
                console.log('res :>> ', res);

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

