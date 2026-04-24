import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import App from './app/App.vue';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
