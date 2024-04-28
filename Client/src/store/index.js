// eslint-disable-next-line import/no-extraneous-dependencies
import { createStore } from 'vuex';
// eslint-disable-next-line import/no-extraneous-dependencies
// import createPersistedState from 'vuex-persistedstate';

import datastore from './modules/datastore';

export default createStore({
  modules: {
    datastore,
  },
  plugins: [
    // createPersistedState({
    //   storage: window.localStorage,
    // }),
  ],
});
