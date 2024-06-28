// History Mode: https://router.vuejs.org/guide/essentials/history-mode
// WebHistory Mode
// import { createRouter, createWebHistory } from 'vue-router';

// WebHashHistory Mode
import { createRouter, createWebHashHistory } from 'vue-router';
import IndexView from '@/views/IndexView.vue';
import SignInView from '@/views/SignInView.vue';
import SignUpView from '@/views/SignUpView.vue';
import StartView from '@/views/StartView.vue';
// import ContentView from '@/views/ContentView.vue';
import ServiceGenView from '@/views/ServiceGenView.vue';
import ConfigView from '@/views/ConfigView.vue';
import DevelopperView from '@/views/DevelopperView.vue';
import ReferenceView from '@/views/ReferenceView.vue';
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
    path: '/reference',
    name: 'ReferencePage',
    component: ReferenceView,
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
        name: 'SignUpPage',
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
  history: createWebHashHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
