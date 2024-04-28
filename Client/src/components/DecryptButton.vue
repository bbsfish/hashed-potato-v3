<template>
  <button @click="doDecrypt">{{ label }}</button>
</template>

<script>
export default {
  name: 'DecryptButton',
  props: {
    label: {
      type: String,
      default: '複合化',
    },
  },
  emits: ['ondecrypted'],
  methods: {
    async doDecrypt() {
      const { handle } = this.$store.getters['datastore/fileState'];
      console.log('handle', handle);
      if (!handle) return;
      const password = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Decrypt' });
      try {
        const { xtext, xobject } = await this.$store.dispatch('datastore/decryptContent', { password });
        this.$log.debug('decResult', { xtext, xobject });
        this.$emit('ondecrypted', xobject);
      } catch (error) {
        this.$log.info('decResult', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
