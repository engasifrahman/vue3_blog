<template>
    <div class="row">
        <div class="col-12 rounded-top py-2 bg-info text-white">
            <div class="row">
                <h5 class="col-sm-6 pe-0 mb-0">{{ actionTitle }}</h5>
                <h5 v-if="actionType !== 'comments'" class="col-sm-6 ps-0 float-end text-end mb-0">
                    <span role="button" @click="closeForm"><font-awesome-icon icon="fa-regular fa-times-circle" /></span>
                </h5>
            </div>
        </div>
        <div v-if="actionType === 'comments'" class="col-12 border border-info rounded-bottom mb-3">
            <table class="table table-hover table-responsive">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Comment</th>
                        <th scope="col">Post Title</th>
                        <th scope="col">Created at</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(comment, index) in comments" :key="index">
                        <td>{{ index+1 }}</td>
                        <td>{{ truncate(comment.comment, 50) }}</td>
                        <td>{{ truncate(comment?.post?.title, 50) }}</td>
                        <td>{{ comment.created_at }}</td>
                        <td class="text-center">
                            <span role="button" class="text-info me-1" @click="showComment(comment)"><font-awesome-icon icon="fa-regular fa-eye" /></span>
                            <span role="button" class="text-warning me-1" @click="editComment(comment)"><font-awesome-icon icon="fa-regular fa-pen-to-square" /></span>
                            <span role="button" class="text-danger" @click="deleteConfirmation(index, comment.id)"><font-awesome-icon icon="fa-regular fa-trash-can" /></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="col-12 border border-info rounded-bottom mb-3">
            <div v-if="actionType === 'show_comment'">
                <p>
                    <strong>Comment: </strong>
                    {{ comment.comment }}
                </p>

                <p>
                    <strong>Post Title: </strong>
                    {{ comment?.post?.title }}
                </p>
            </div>
            <div v-else>
                <form class="row g-3 mt-0 mb-3">
                    <div class="col-12">
                        <label for="comment" class="form-label text-secondary">Comment</label>
                        <textarea class="form-control" id="comment" name="comment" rows="4" v-model="comment.comment" placeholder="Enter Post Comment"></textarea>
                    </div>
                    <div class="col-12 text-center">
                        <button type="reset" class="btn btn-warning text-white me-2" @click.prevent="resetForm">Reset</button>
                        <button type="submit" class="btn btn-primary" @click.prevent="saveComment">Update</button>
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
        name: "Comments",
        async setup(){
            let req_url = ref('/comment');
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
            comments: [],
            comment: {},
            cachedComment: {},
            actionType: '',
            defaultType: 'comments',
            editedItemIndex: -1
        }),
        created() {
            console.log('Comments Created');

            this.$emitter.emit('loadingStatus', true);

            this.actionType = this.defaultType;

            if (this.isSuperAdmin) {
                this.$router.push({name: 'dashboard.comments'});
            } else {
                this.$router.push({name: 'dashboard.comments'});
            }
        },
        watch: {
            axios_result: {
                handler(newValue, oldValue) {
                    console.log('Comments response :>> ', newValue);
                    this.comments = newValue?.data ? [...newValue.data] : [];
                    this.$emitter.emit('loadingStatus', false);
                },
                deep: true
            },
            axios_errors: {
                handler(newValue, oldValue) {
                    console.log('Comments response error :>> ', newValue);

                    this.reqErrorMessage = newValue?.message;
                    this.$emitter.emit('loadingStatus', false);
                },
                deep: true
            }
        },
        methods: {
            resetForm() {
                this.comment = Object.assign({}, this.cachedComment);
            },
            closeForm() {
                this.editedItemIndex = -1;
                this.actionType = this.defaultType;
                this.comment = {};
            },
            showComment(item) {
                this.actionType = 'show_comment';
                this.comment = Object.assign({}, item);
            },
            editComment(item) {
                this.editedItemIndex =  this.comments.indexOf(item);
                
                if(this.editedItemIndex !== -1){
                    this.actionType = 'edit_comment';
                    this.comment = Object.assign({}, item);
                    this.cachedComment = Object.assign({}, item);
                } else{
                    myToast('error', 'Something went wrong!');
                }
            },
            deleteConfirmation(index, id){
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

                            _this.deleteComment(index, id);

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
            async deleteComment(index, id){
                console.log('Delete comment');

                let req_url = `comment/${id}`;
                let req_config = { method: 'DELETE'};

                const { result, errors, is_finished } = await this.excecuteAxios(req_url, req_config);
                this.reqErrorMessage = errors?.message;

                if(is_finished){
                    this.$emitter.emit('loadingStatus', false);

                    console.log('Comment delete response :>> ', result);

                    if(!errors){
                        this.comments.splice(index, 1);
                    }
                }
            },
            async saveComment(){
                this.$emitter.emit('loadingStatus', true);

                console.log('Update comment');

                let req_url = `comment/${this.comment?.id}`;
                let req_config = { method: 'PUT', data: this.comment};

                const { result, errors, is_finished } = await this.excecuteAxios(req_url, req_config);
                this.reqErrorMessage = errors?.message;

                if(is_finished){
                    this.$emitter.emit('loadingStatus', false);

                    console.log('Comment update response :>> ', result);

                    if(!errors){
                        this.comments[this.editedItemIndex] = this.comment;
                        this.closeForm();
                    }
                }
            },
            truncate: function (str, n){
                if(str){
                    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
                }
            }
        },
        computed: {
            actionTitle(){
                // console.log('this.actionType :>> ', this.actionType);

                let title;

                if(this.actionType === 'show_comment'){
                    title = 'Show Comment';
                } else if(this.actionType === 'edit_comment'){
                    title = 'Edit Comment';
                } else{
                    title = 'Comments';
                }

                return title;
            }
        }
    }
</script>