/* eslint-disable */

export default {
  install: (app, options) => {
    app.config.globalProperties.$dialog = {
      
      alert: async ({
        message = 'This is alert.',
      }) => {
        return await window.alert(message);
      },

      confirm: async ({
        message = 'This is confirm. ok?',
      }) => {
        return await window.confirm(message);
      },

      prompt: async ({
        message = 'This is prompt',
      }) => {
        return new Promise((resolve, reject) => {
          const input = window.prompt(message);
          resolve(input);
        });
      },

    }
  },
};
