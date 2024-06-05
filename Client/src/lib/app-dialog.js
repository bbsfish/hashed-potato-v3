/* eslint-disable */
import AppDialogPrompt from '@/components/AppDialogPrompt.vue';

export default {
  install: (app, options) => {
    app.config.globalProperties.$dialog = {
      setup: async (diralogRef) => {
        console.log(AppDialogPrompt);
      },
      
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
        comp,
      }) => {
        return new Promise((resolve, reject) => {
          // console.log(this.$store.getters['dialog/ref']('prompt'));
          const input = window.prompt(message);
          resolve(input);
        });
      },

    }
  },
};
