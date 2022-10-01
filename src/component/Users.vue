<template>
    <div class="row">
        <div class="rounded-top py-2 bg-info text-white">
            <div class="row">
                <h5 class="col-sm-6 pe-0 mb-0">{{ actionTitle }}</h5>
                <h5 v-if="actionType !== 'users'" class="col-sm-6 ps-0 float-end text-end mb-0">
                    <span role="button" @click="closeForm"><font-awesome-icon icon="fa-regular fa-times-circle" /></span>
                </h5>
            </div>
        </div>
        <table class="table table-bordered table-responsive" :class="{'d-none': actionType !== 'users'}">
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
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.created_at }}</td>
                    <td class="text-center">
                        <span role="button" class="text-info me-1" @click="editItem(user)"><font-awesome-icon icon="fa-regular fa-pen-to-square" /></span>
                        <span role="button" class="text-danger" @click="deleteItem(index, user.id)"><font-awesome-icon icon="fa-regular fa-trash-can" /></span>
                    </td>
                </tr>
            </tbody>
        </table>
        <form class="row g-3 mt-0" :class="{'d-none': actionType !== 'edit_user'}">
            <div class="col-md-6">
                <label for="Name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" name="name" v-model="editedItem.name" placeholder="Enter Name">
            </div>
            <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" v-model="editedItem.email" placeholder="Enter Email">
            </div>
            <div class="col-12">
                <label for="Phone" class="form-label">Phone</label>
                <input type="text" class="form-control" id="phone" name="phone" v-model="editedItem.phone" placeholder="Enter Phone">
            </div>
            <div class="col-12 text-center">
                <button type="reset" class="btn btn-warning text-white me-2" @click.prevent="resetForm">Reset</button>
                <button type="submit" class="btn btn-primary" @click.prevent="updateItem">Update</button>
            </div>
        </form>
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
            defaultTitle: 'Users',
            actionType: '',
            defaultType: 'users',
            editedItemIndex: -1,
            editedItem: {
                name: "",
                email: "",
                phone: "",
            },
            defaultItem: {
                name: "",
                email: "",
                phone: "",
            },
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
                this.editedItem = Object.assign(this.editedItem, this.defaultItem);
            },

            closeForm() {
                this.actionType = this.defaultType;
                this.editedItemIndex = -1;
                this.editedItem = Object.assign({}, this.defaultItem);
            },
            editItem(item) {
                this.actionType = 'edit_user';
                this.editedItemIndex =  this.users.indexOf(item);
                this.editedItem = Object.assign({}, item);
            },
            async deleteItem(index, id){
                console.log('Delete users');

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
            async updateItem(){
                this.$emitter.emit('loadingStatus', true);

                console.log('Update users');

                let req_url = `user/${this.editedItem?.id}`;
                let req_config = { method: 'PUT', data: this.editedItem};

                const { result, errors, is_finished } = await this.excecuteAxios(req_url, req_config);
                this.reqErrorMessage = errors?.message;

                if(is_finished){
                    this.$emitter.emit('loadingStatus', false);

                    console.log('User update response :>> ', result);

                    if(!errors){
                        this.users[this.editedItemIndex] = this.editedItem;
                        this.closeForm();
                    }
                }
            }
        },
        computed: {
            actionTitle: function(){
                // console.log('this.actionType :>> ', this.actionType);

                let title;

                if(this.actionType === 'show_user'){
                    title = 'Show User';
                } else if(this.actionType === 'edit_user'){
                    title = 'Edit User';
                } else{
                    title = this.defaultTitle;
                }

                return title;
            }
        }
    }
</script>