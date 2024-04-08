import { createRouter, createWebHistory } from 'vue-router';
import IndexView from '@/views/IndexView.vue';
import LinkView from '@/views/LinkView.vue';
import StartView from '@/views/StartView.vue';
import ContentView from '@/views/ContentView.vue';
import ServiceGenView from '@/views/ServiceGenView.vue';
import ConfigView from '@/views/ConfigView.vue';
import DevelopperView from '@/views/DevelopperView.vue';

const routes = [
  {
    path: '/',
    name: 'IndexPage',
    component: IndexView,
  },
  {
    path: '/start',
    name: 'StartPage',
    component: StartView,
  },
  {
    path: '/config',
    name: 'ConfigPage',
    component: ConfigView,
  },
  {
    path: '/dev',
    name: 'DevelopperPage',
    component: DevelopperView,
  },
  {
    path: '/link/:id',
    name: 'LinkPage',
    component: LinkView,
    children: [
      {
        path: '',
        component: LinkView,
      },
    ],
  },
  {
    path: '/view',
    name: 'ContentPage',
    component: ContentView,
  },
  {
    path: '/sg/:id',
    name: 'ServiceGenPage',
    component: ServiceGenView,
    children: [
      {
        path: 'generate',
        component: ServiceGenView,
        props: { mode: 'generate' },
      },
      {
        path: 'redirect',
        component: ServiceGenView,
        props: { mode: 'redirect' },
      },
      {
        path: '',
        component: ServiceGenView,
        props: { mode: 'generate' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
