<template>
  <button @click="doDecrypt">{{ label }}</button>
</template>

<script>
export default {
  name: 'DecryptFileButton',
  props: {
    label: {
      type: String,
      default: '複合化',
    },
  },
  methods: {
    /**
     * store の file を複合化する.
     * file がなければエラーを返す.
     */
    async doDecrypt() {
      const { handle } = this.$store.getters['datastore/fileState'];
      if (!handle) return;
      // Empty チェック
      if (this.$store.getters['datastore/isEmptyData']) {
        this.$log.info('This file has no data.');
        return;
      }
      // 複合化
      const password = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Decrypt' });
      try {
        await this.$store.dispatch('datastore/decryptContent', { password });
      } catch (error) {
        this.$log.error('[DecryptFileButton]', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
