/* eslint-disable */

export default {
  install: (app, options) => {
    app.config.globalProperties.$dialog = {
      
      alert: async ({
        message = 'This is alert.',
      }) => {
        return window.alert(message);
      },

      confirm: async ({
        message = 'This is confirm. ok?',
      }) => {
        return window.confirm(message);
      }

    }
  },
};
