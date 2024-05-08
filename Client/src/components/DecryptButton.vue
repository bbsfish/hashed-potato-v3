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
      if (!handle) {
        this.$log.debug('Handle is null');
        return;
      }
      const password = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Decrypt' });
      try {
        const xmlThings = await this.$store.dispatch('datastore/decryptContent', { password });
        this.$log.debug('Result of decryption', xmlThings);
        this.$emit('onDecrypted');
      } catch (error) {
        this.$log.info('Error on decryption', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
