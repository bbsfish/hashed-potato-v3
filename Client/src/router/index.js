import { createRouter, createWebHistory } from 'vue-router';
import IndexView from '@/views/IndexView.vue';
import SignInView from '@/views/SignInView.vue';
import SignUpView from '@/views/SignUpView.vue';
import StartView from '@/views/StartView.vue';
// import ContentView from '@/views/ContentView.vue';
import ServiceGenView from '@/views/ServiceGenView.vue';
import ConfigView from '@/views/ConfigView.vue';
import DevelopperView from '@/views/DevelopperView.vue';
import ContentEditorView from '@/views/ContentEditorView.vue';
import PubkeyView from '@/views/PubkeyView.vue';

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
    path: '/signin',
    name: 'SignInPageWithoutID',
    component: SignInView,
    children: [
      {
        path: '/signin/:id',
        name: 'SignInPage',
        component: SignInView,
      },
    ],
  },
  {
    path: '/signup',
    name: 'SignUpPageWithoutID',
    component: SignUpView,
    children: [
      {
        path: '/signup/:id',
        name: 'SignInPage',
        component: SignUpView,
      },
    ],
  },
  {
    path: '/content',
    name: 'ContentPage',
    component: ContentEditorView,
  },
  {
    path: '/sg',
    name: 'SGPage',
    component: ServiceGenView,
    props: { mode: 'generate' },
  },
  {
    path: '/sg/redirect',
    name: 'SGRedirectPage',
    component: ServiceGenView,
    props: { mode: 'redirect' },
  },
  {
    path: '/pubkey',
    component: PubkeyView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
