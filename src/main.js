import axios from "axios";
import { createApp } from "vue";
import { createPinia } from "pinia";
import 'bootstrap/dist/css/bootstrap.min.css';

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";


axios.defaults.headers.common['Content-Type'] = 'application/json';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.config.globalProperties.$axios = axios;

app.mount("#app");

import 'bootstrap/dist/js/bootstrap.min.js';
