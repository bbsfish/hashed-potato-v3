// eslint-disable-next-line import/no-extraneous-dependencies
import { createStore } from 'vuex';
// eslint-disable-next-line import/no-extraneous-dependencies
// import createPersistedState from 'vuex-persistedstate';

import user from './modules/user';
import files from './modules/files';

export default createStore({
  modules: {
    user, files,
  },
  plugins: [
    // createPersistedState({
    //   storage: window.localStorage,
    // }),
  ],
});
