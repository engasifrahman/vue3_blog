<template>
    <div class="row">
        <div class="col-12 rounded-top py-2 bg-info text-white">
            <div class="row">
                <h5 class="col-sm-6 pe-0 mb-0">{{ actionTitle }}</h5>
                <h5 v-if="actionType !== 'posts'" class="col-sm-6 ps-0 float-end text-end mb-0">
                    <span role="button" @click="closeForm"><font-awesome-icon icon="fa-regular fa-times-circle" /></span>
                </h5>
                <h5 v-else class="col-sm-6 ps-0 float-end text-end mb-0">
                    <span role="button" @click="addPost"><font-awesome-icon icon="fa-regular fa-square-plus" /></span>
                </h5>
            </div>
        </div>
        <div v-if="actionType === 'posts'" class="col-12 border border-info rounded-bottom mb-3">
            <table class="table table-hover table-responsive">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Slug</th>
                        <th scope="col">Title</th>
                        <th scope="col">Body</th>
                        <th scope="col">Created at</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(post, index) in posts" :key="index">
                        <td>{{ index+1 }}</td>
                        <td>{{ post.slug }}</td>
                        <td>{{ post.title }}</td>
                        <td>{{ truncate(post.body, 30) }}</td>
                        <td>{{ post.created_at }}</td>
                        <td class="text-center">
                            <span role="button" class="text-info me-1" @click="showPost(post)"><font-awesome-icon icon="fa-regular fa-eye" /></span>
                            <span role="button" class="text-warning me-1" @click="editPost(post)"><font-awesome-icon icon="fa-regular fa-pen-to-square" /></span>
                            <span role="button" class="text-danger" @click="deleteConfirmation(index, post.slug)"><font-awesome-icon icon="fa-regular fa-trash-can" /></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="col-12 border border-info rounded-bottom mb-3">
            <div v-if="actionType === 'show_post'">
                <p>
                    <strong>Slug: </strong>
                    {{ post.slug }}
                </p>

                <p>
                    <strong>Title: </strong>
                    {{ post.title }}
                </p>

                <p>
                    <strong>Body: </strong>
                    {{ post.body }}
                </p>
            </div>
            <div v-else>
                <form class="row g-3 mt-0 mb-3">
                    <div class="col-md-6">
                        <label for="slug" class="form-label">Slug</label>
                        <input type="text" class="form-control" id="slug" name="slug" v-model="post.slug" placeholder="Enter Slug">
                    </div>
                    <div class="col-md-6">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" class="form-control" id="title" name="title" v-model="post.title" placeholder="Enter Title">
                    </div>
                    <div class="col-12">
                        <label for="body" class="form-label text-secondary">Body</label>
                        <textarea class="form-control" id="body" name="body" rows="4" v-model="post.body" placeholder="Enter Post Body"></textarea>
                    </div>
                    <div class="col-12 text-center">
                        <button type="reset" class="btn btn-warning text-white me-2" @click.prevent="resetForm">Reset</button>
                        <button type="submit" class="btn btn-primary" @click.prevent="savePost">{{ actionType == 'edit_post' ? 'Update' : 'Save'}}</button>
                    </div>
                </form>
            </div>
            
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { useAxios } from '@/composables/useAxios.js';
    
    export default {
        name: "Posts",
        async setup(){
            let req_url = ref('/post');
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
            posts: [],
            post: {},
            cachedPost: {},
            actionType: '',
            defaultType: 'posts',
            editedItemIndex: -1
        }),
        created() {
            console.log('Posts Created');

            this.$emitter.emit('loadingStatus', true);

            this.actionType = this.defaultType;

            if (this.isSuperAdmin) {
                this.$router.push({name: 'dashboard.posts'});
            } else {
                this.$router.push({name: 'dashboard.posts'});
            }
        },
        watch: {
            axios_result: {
                handler(newValue, oldValue) {
                    console.log('Posts response :>> ', newValue);
                    this.posts = newValue?.data ? [...newValue.data] : [];
                    this.$emitter.emit('loadingStatus', false);
                },
                deep: true
            },
            axios_errors: {
                handler(newValue, oldValue) {
                    console.log('Posts response error :>> ', newValue);

                    this.reqErrorMessage = newValue?.message;
                    this.$emitter.emit('loadingStatus', false);
                },
                deep: true
            }
        },
        methods: {
            resetForm() {
                this.post = Object.assign({}, this.cachedPost);
            },
            closeForm() {
                this.editedItemIndex = -1;
                this.actionType = this.defaultType;
                this.post = {};
            },
            showPost(item) {
                this.actionType = 'show_post';
                this.post = Object.assign({}, item);
            },
            editPost(item) {
                this.editedItemIndex =  this.posts.indexOf(item);
                
                if(this.editedItemIndex !== -1){
                    this.actionType = 'edit_post';
                    this.post = Object.assign({}, item);
                    this.cachedPost = Object.assign({}, item);
                } else{
                    myToast('error', 'Something went wrong!');
                }
            },
            addPost() {
                this.actionType = 'add_post';

                let defaultItem = {
                    slug: '',
                    title: '',
                    body: ''
                }
                
                this.post = Object.assign({}, defaultItem);
                this.cachedPost = Object.assign({}, defaultItem);
            },
            deleteConfirmation(index, slug){
                let _this = this;

                this.$iziToast.show({
                    close: false,
                    overlay: true,
                    timeout: 5000,
                    displayMode: 'once',
                    id: 'question',
                    zindex: 999,
                    title: 'Hey',
                    message: 'Are you sure about that?',
                    position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
                    progressBarColor: 'rgb(0, 255, 184)',
                    buttons: [
                        ['<button><b>YES</b></button>', function (instance, toast) {
                
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                            _this.deletePost(index, slug);

                        }, true],
                        ['<button>NO</button>', function (instance, toast) {
                
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                
                        }],
                    ],
                    onClosing: function(instance, toast, closedBy){
                        // console.info('Closing | closedBy: ' + closedBy);
                    },
                    onClosed: function(instance, toast, closedBy){
                        // console.info('Closed | closedBy: ' + closedBy);
                    }
                });
            },
            async deletePost(index, slug){
                console.log('Delete post');

                let req_url = `post/${slug}`;
                let req_config = { method: 'DELETE'};

                const { result, errors, is_finished } = await this.excecuteAxios(req_url, req_config);
                this.reqErrorMessage = errors?.message;

                if(is_finished){
                    this.$emitter.emit('loadingStatus', false);

                    console.log('Post delete response :>> ', result);

                    if(!errors){
                        this.posts.splice(index, 1);
                    }
                }
            },
            async savePost(){
                this.$emitter.emit('loadingStatus', true);

                if(this.editedItemIndex !== -1){
                    console.log('Update post');

                    let req_url = `post/${this.cachedPost?.slug}`;
                    let req_config = { method: 'PUT', data: this.post};

                    const { result, errors, is_finished } = await this.excecuteAxios(req_url, req_config);
                    this.reqErrorMessage = errors?.message;

                    if(is_finished){
                        this.$emitter.emit('loadingStatus', false);

                        console.log('Post update response :>> ', result);

                        if(!errors){
                            this.posts[this.editedItemIndex] = this.post;
                            this.closeForm();
                        }
                    }
                } else{
                    console.log('Create post');

                    let req_url = `post`;
                    let req_config = { method: 'POST', data: this.post};

                    const { result, errors, is_finished } = await this.excecuteAxios(req_url, req_config);
                    this.reqErrorMessage = errors?.message;

                    if(is_finished){
                        this.$emitter.emit('loadingStatus', false);

                        console.log('Post create response :>> ', result);

                        if(!errors){
                            this.posts.push(result?.data);
                            this.closeForm();
                        }
                    } 
                }
            },
            truncate: function (str, n){
                return (str.length > n) ? str.slice(0, n-1) + '...' : str;
            }
        },
        computed: {
            actionTitle(){
                // console.log('this.actionType :>> ', this.actionType);

                let title;

                if(this.actionType === 'show_post'){
                    title = 'Show Post';
                } else if(this.actionType === 'add_post'){
                    title = 'Add Post';
                } else if(this.actionType === 'edit_post'){
                    title = 'Edit Post';
                } else{
                    title = 'Posts';
                }

                return title;
            }
        }
    }
</script>