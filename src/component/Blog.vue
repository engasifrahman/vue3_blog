<template>
    <div class="accordion accordion-flush my-5" id="blog_accordion">
        <div class="accordion-item" v-for="(post, index) of posts" :key="index">
            <h2 class="accordion-header" :id="`flush_heading_${index}`">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush_collapse_${index}`" aria-expanded="false" :aria-controls="`flush_collapse_${index}`">
                    <span>{{ post.title }}</span>
                    <small class="text-muted" style="position: absolute; right: 60px;">{{ post?.user?.name }} <font-awesome-icon icon="fa-regular fa-clock" /> {{ post.created_at }} </small>
                </button>
            </h2>
            <div :id="`flush_collapse_${index}`" class="accordion-collapse collapse" :aria-labelledby="`flush_heading_${index}`" data-bs-parent="#blog_accordion">
                <p>{{ post.body }}</p>

                <h5>Comments</h5>
                <div class="ms-3"  v-for="(comment, idx) of post.comments" :key="idx" ref="comment">
                    <small class="text-muted">{{ comment?.user?.name }} <font-awesome-icon icon="fa-regular fa-clock" /> {{ comment.created_at }} </small>
                    <p>{{ comment.comment }}</p>
                </div>
                <div v-if="authToken && Object.keys(authUser).length" class="row p-0 ms-1">
                    <small class="text-muted">{{ authUser?.name }}</small>

                    <div class="mb-3">
                        <label :for="`write_comment_${index}`" class="form-label text-secondary"><small>Write a new comment</small></label>
                        <textarea class="form-control" :id="`write_comment_${index}`" rows="2" ref="write_comment"></textarea>

                        <div class="col-12 text-center">
                            <button type="button" class="btn btn-primary float-end mt-2" @click="saveComment(index, post?.slug)">Save</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { useAxios } from '@/composables/useAxios.js';

    export default {
    name: "Blog",
    async setup(){
        let req_url = ref('/posts');
        let req_config = ref({
            method: 'GET',
            data: {}
        });

        const { excecuteAxios } = useAxios();
        
        // return { req_url, req_config, excecuteAxios };

        const { axios_result, axios_errors, is_axios_finished } = await useAxios(req_url, req_config);

        return { req_url, req_config, axios_result, axios_errors, is_axios_finished, excecuteAxios };
    },
    data: () => ({
        posts: []
    }),
    created() {
        console.log('Blog Created');

        this.$emitter.emit('loadingStatus', true);

        // this.init();
    },
    mounted() {
        // 
    },
    updated() {
        // console.log('this.$refs :>> ', this.$refs);

        // if(this.$refs.write_comment){
        //     console.log('this.$refs.write_comment :>> ', this.$refs.write_comment);
        //     this.$refs.write_comment[0].value = 'Hey Asif';
        // }
    },
    watch:{
        axios_result: {
            handler(newValue, oldValue) {
                console.log('Blog response :>> ', newValue);

                this.posts = newValue?.data ? [...newValue.data] : [];
                this.$emitter.emit('loadingStatus', false);
            },
            deep: true
        },
        axios_errors: {
            handler(newValue, oldValue) {
                console.log('Blog response error :>> ', newValue);

                this.reqErrorMessage = newValue?.message;
                this.$emitter.emit('loadingStatus', false);
            },
            deep: true
        }
    },
    methods: {
        async init(){
            const { result, errors, is_finished } = await this.excecuteAxios(this.req_url, this.req_config);

            if(is_finished){
                this.$emitter.emit('loadingStatus', false);

                console.log('Blog response :>> ', result);

                if(!errors){
                    this.posts = result?.data || {};
                }
            }
        },
        async saveComment(index, postSlug){
                this.$emitter.emit('loadingStatus', true);

                console.log('Update comment');

                let req_url = `comment`;
                let req_config = { method: 'POST', data: {
                    post_slug: postSlug,
                    comment: this.$refs.write_comment[index].value,
                }};

                const { result, errors, is_finished } = await this.excecuteAxios(req_url, req_config);
                this.reqErrorMessage = errors?.message;

                if(is_finished){
                    this.$emitter.emit('loadingStatus', false);

                    console.log('Post Comment Create response :>> ', result);

                    if(!errors){
                        let comment = result?.data;
                        comment.user = this.authUser;
                        this.posts[index].comments.push(comment);
                        this.$refs.write_comment[index].value = '';
                    }
                }
            },
    },
    computed: {
        // 
    }
}
</script>

