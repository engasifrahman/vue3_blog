import mitt from 'mitt';
import axios from 'axios';
import App from '@/App.vue';
import router from '@/router';
import iziToast from 'izitoast';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
/* import specific icons */
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faClock, faTrashCan, faTrashAlt, faPenToSquare, faTimesCircle, faSquarePlus, faPlusSquare, faEye } from '@fortawesome/free-regular-svg-icons';

import authMixins from '@/mixins/authMixins.js';

import { myToast } from '@/assets/myToast.js';

import 'izitoast/dist/css/iziToast.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/assets/main.css';

/* add icons to the library */
library.add(faClock, faTimes, faTrashCan, faTrashAlt, faPenToSquare, faTimesCircle, faSquarePlus, faPlusSquare, faEye);

router.beforeEach((to, from, next) => {
    // axios.defaults.headers.common['Authorization'] = 'Bearer ';
    document.title = to.meta.title || 'Blog';

    next();
});

axios.defaults.baseURL = 'http://localhost:8000/api/v1';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const emitter = mitt();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mixin(authMixins);

app.config.globalProperties.$axios = axios;
app.config.globalProperties.$emitter = emitter;
app.config.globalProperties.$iziToast = iziToast;
app.config.globalProperties.$myToast = myToast;


app.mount("#app");

import 'bootstrap/dist/js/bootstrap.min.js';
