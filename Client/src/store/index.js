// eslint-disable-next-line import/no-extraneous-dependencies
import { createStore } from 'vuex';
import logger from '@/logger/vuex.plugin.js';
// eslint-disable-next-line import/no-extraneous-dependencies
// import createPersistedState from 'vuex-persistedstate';

import datastore from './modules/datastore';
import xmlobject from './modules/xmlobject';
import dialog from './modules/dialog';

export default createStore({
  modules: {
    datastore, xmlobject, dialog,
  },
  plugins: [
    // createPersistedState({
    //   storage: window.localStorage,
    // }),
    logger,
  ],
});
