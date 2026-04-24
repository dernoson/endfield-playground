import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import ui from '@nuxt/ui/vue-plugin';
import App from './app/App.vue';
import router from './router';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ui);
app.mount('#app');
