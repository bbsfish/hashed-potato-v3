<template>
  <div>
    <button @click="showPrompt">{{ label }}</button>
    <div v-if='visible'>
      <label for='prompt-input-uid'>
        User ID for Login
        <input
          type='text'
          id='prompt-input-uid'
          placeholder='User ID for Login'
          v-model='inputId'
          />
      </label>
      <label for='prompt-input-password'>
        User ID for Login
        <input
          type='text'
          id='prompt-input-password'
          placeholder='Password for Login'
          v-model='inputPass'
          />
      </label>
      <button @click='submit'>OK</button>
      <button @click='cancel'>Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'データを追加する',
    },
  },
  emits: ['pullInputData'],
  data() {
    return {
      visible: false,
      inputId: '',
      inputPass: '',
    };
  },
  methods: {
    showPrompt() {
      if (this.visible) return;
      this.inputId = '';
      this.inputPass = '';
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    submit() {
      const uid = this.inputId;
      const password = this.inputPass;
      this.$emit('pullInputData', uid, password);
      this.close();
    },
    cancel() {
      this.$emit('pullInputData', null);
      this.close();
    },
  },
};
</script>
