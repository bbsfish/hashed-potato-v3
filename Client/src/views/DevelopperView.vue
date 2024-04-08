<template>
  <main>
    <AppMainHeader title="Developper"/>
    <div>
      <button @click="makeNewFile">ファイルを作成する</button>
    </div>
  </main>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
// import NewFileButton from '@/components/_NewFileButton.vue';

export default {
  name: 'DevelopperView',
  components: {
    AppMainHeader,
  },
  method: {
    async makeNewFile() {
      console.log('make file');
      const isOK = await (async () => {
        if (!this.$store.getters['datastore/file'].isModified) return true;
        return this.$dialog.confirm({ message: '保存されていない変更があります。廃棄してもよろしいですか。' });
      })();
      try {
        if (isOK) {
          const devId = await this.$store.dispatch('datastore/newFile');
          this.$dialog.alert({ message: `ファイルが作成されました: ${devId}` });
        }
      } catch (error) {
        console.info(error);
      }
    },
  },
};

</script>

<style lang="scss" scoped>
</style>
