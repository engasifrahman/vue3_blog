import axios from "axios";
import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { createPinia } from "pinia";
import 'bootstrap/dist/css/bootstrap.min.css';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
/* import specific icons */
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

/* add icons to the library */
library.add(faClock, faTimes);

import "./assets/main.css";


axios.defaults.headers.common['Content-Type'] = 'application/json';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon)

app.config.globalProperties.$axios = axios;

app.mount("#app");

import 'bootstrap/dist/js/bootstrap.min.js';
