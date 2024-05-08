// eslint-disable-next-line import/no-extraneous-dependencies
import { createStore } from 'vuex';
// eslint-disable-next-line import/no-extraneous-dependencies
// import createPersistedState from 'vuex-persistedstate';

import datastore from './modules/datastore';
import xmlobject from './modules/xmlobject';

export default createStore({
  modules: {
    datastore, xmlobject,
  },
  plugins: [
    // createPersistedState({
    //   storage: window.localStorage,
    // }),
  ],
});
