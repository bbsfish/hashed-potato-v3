import Vue from 'vue';
import Router from 'vue-router';
import IndexView from '@/views/IndexView';
import LinkView from '@/views/LinkView';
import StartView from '@/views/StartView';
import ContentView from '@/views/ContentView';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexView',
      component: IndexView,
    },
    {
      path: '/start',
      name: 'IndexView',
      component: StartView,
    },
    {
      path: '/link',
      name: 'IndexView',
      component: LinkView,
    },
    {
      path: '/view',
      name: 'ContentView',
      component: ContentView,
    },
  ],
});
