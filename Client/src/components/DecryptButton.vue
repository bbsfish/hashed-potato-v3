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
    /**
     * store の file を複合化する.
     * file がなければエラーを返す.
     * エラー以外で処理が完了したら、'ondecrypted' を emit する.
     */
    async doDecrypt() {
      const { handle } = this.$store.getters['datastore/fileState'];
      // handle チェック
      if (!handle) throw new Error('Handle is null');
      // 複合化 不要
      if (this.$store.getters['datastore/isEmptyData']) {
        this.$log.debug('Data is none');
        this.$emit('ondecrypted');
        return;
      }
      // 複合化 要
      const password = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Decrypt' });
      await this.$store.dispatch('datastore/decryptContent', { password });
      this.$emit('ondecrypted');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
