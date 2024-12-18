// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue';

// eslint-disable-next-line
import logger from '@/logger/vue.plugin.js';
import dialog from '@/lib/app-dialog';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

app.use(logger);
app.use(router);
app.use(store);
app.use(dialog, { test: 'ok' });

app.mount('#app');
