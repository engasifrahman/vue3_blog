<template>
    <div class="row">
        <div class="col-12 rounded-top py-2 bg-info text-white">
            <div class="row">
                <h5 class="col-sm-6 pe-0 mb-0">{{ actionTitle }}</h5>
                <h5 v-if="actionType !== 'users'" class="col-sm-6 ps-0 float-end text-end mb-0">
                    <span role="button" @click="closeForm"><font-awesome-icon icon="fa-regular fa-times-circle" /></span>
                </h5>
            </div>
        </div>
        <div v-if="actionType === 'users'" class="col-12 border border-info rounded-bottom mb-3">
            <table class="table table-hover table-responsive">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Created at</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="index">
                        <td>{{ index+1 }}</td>
                        <td><a class="" href="#" @click="showUserPosts(user.id)">{{ user.name }}</a></td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.created_at }}</td>
                        <td class="text-center">
                            <span role="button" class="text-warning me-1" @click="editUser(user)"><font-awesome-icon icon="fa-regular fa-pen-to-square" /></span>
                            <span role="button" class="text-danger" @click="deleteConfirmation(index, user.id)"><font-awesome-icon icon="fa-regular fa-trash-can" /></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="col-12 border border-info rounded-bottom mb-3">
            <form class="row g-3 mt-0 mb-3">
                <div class="col-md-6">
                    <label for="Name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" name="name" v-model="user.name" placeholder="Enter Name">
                </div>
                <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" name="email" v-model="user.email" placeholder="Enter Email">
                </div>
                <div class="col-12">
                    <label for="Phone" class="form-label">Phone</label>
                    <input type="text" class="form-control" id="phone" name="phone" v-model="user.phone" placeholder="Enter Phone">
                </div>
                <div class="col-12 text-center">
                    <button type="reset" class="btn btn-warning text-white me-2" @click.prevent="resetForm">Reset</button>
                    <button type="submit" class="btn btn-primary" @click.prevent="saveUser">Update</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { useAxios } from '@/composables/useAxios.js';
    
    export default {
        name: "Users",
        async setup(){
            let req_url = ref('/user');
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
            users: [],
            user: {},
            cachedUser: {},
            actionType: '',
            defaultType: 'users',
            editedItemIndex: -1
        }),
        created() {
            console.log('Users Created');

            this.$emitter.emit('loadingStatus', true);

            this.actionType = this.defaultType;

            if (this.isSuperAdmin) {
                this.$router.push({name: 'dashboard.users'});
            } else {
                this.$router.push({name: 'dashboard.posts'});
            }
        },
        watch: {
            axios_result: {
                handler(newValue, oldValue) {
                    console.log('Users response :>> ', newValue);
                    this.users = newValue?.data ? [...newValue.data] : [];
                    this.$emitter.emit('loadingStatus', false);
                },
                deep: true
            },
            axios_errors: {
                handler(newValue, oldValue) {
                    console.log('Users response error :>> ', newValue);

                    this.reqErrorMessage = newValue?.message;
                    this.$emitter.emit('loadingStatus', false);
                },
                deep: true
            }
        },
        methods: {
            resetForm() {
                this.user = Object.assign({}, this.cachedUser);
            },
            closeForm() {
                this.editedItemIndex = -1;
                this.actionType = this.defaultType;
                this.user = {};
            },
            showUserPosts(userId){
                this.$router.push({name: 'dashboard.posts',  params: { user_id: userId } });
            },
            editUser(item) {
                this.editedItemIndex =  this.users.indexOf(item);
                
                if(this.editedItemIndex !== -1){
                    this.actionType = 'edit_user';
                    this.user = Object.assign({}, item);
                    this.cachedUser = Object.assign({}, item);
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

                            _this.deleteUser(index, id);

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
            async deleteUser(index, id){
                console.log('Delete user');

                let req_url = `user/${id}`;
                let req_config = { method: 'DELETE'};

                const { result, errors, is_finished } = await this.excecuteAxios(req_url, req_config);
                this.reqErrorMessage = errors?.message;

                if(is_finished){
                    this.$emitter.emit('loadingStatus', false);

                    console.log('User delete response :>> ', result);

                    if(!errors){
                        this.users.splice(index, 1);
                    }
                }
            },
            async saveUser(){
                this.$emitter.emit('loadingStatus', true);

                console.log('Update user');

                let req_url = `user/${this.user?.id}`;
                let req_config = { method: 'PUT', data: this.user};

                const { result, errors, is_finished } = await this.excecuteAxios(req_url, req_config);
                this.reqErrorMessage = errors?.message;

                if(is_finished){
                    this.$emitter.emit('loadingStatus', false);

                    console.log('User update response :>> ', result);

                    if(!errors){
                        this.users[this.editedItemIndex] = this.user;
                        this.closeForm();
                    }
                }
            }
        },
        computed: {
            actionTitle(){
                // console.log('this.actionType :>> ', this.actionType);

                let title;

                if(this.actionType === 'show_user'){
                    title = 'Show User';
                } else if(this.actionType === 'edit_user'){
                    title = 'Edit User';
                } else{
                    title = 'Users';
                }

                return title;
            }
        }
    }
</script>