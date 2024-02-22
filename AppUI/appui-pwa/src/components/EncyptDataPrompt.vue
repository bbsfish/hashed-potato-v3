<template>
  <div>
    <button @click="showPrompt">{{ label }}</button>
    <div v-if='visible'>
      <label for='prompt-input-passphrase'>
        Enter PASSPHRASE for File Encrypt
        <input
          type='text'
          id='prompt-input-passphrase'
          placeholder='PASSPHRASE for File Encrypt'
          v-model='inputPassphrase'
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
      default: 'ファイルにカギをかける',
    },
  },
  emits: ['pullPassPhrase'],
  data() {
    return {
      visible: false,
      inputPassphrase: '',
    };
  },
  methods: {
    showPrompt() {
      if (this.visible) return;
      this.inputPassphrase = '';
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    submit() {
      const passphrase = this.inputPassphrase;
      this.$emit('pullPassphrase', passphrase);
      this.close();
    },
    cancel() {
      this.$emit('pullPassphrase', null);
      this.close();
    },
  },
};
</script>
