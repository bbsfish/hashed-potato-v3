<template>
  <div class="create-datastore">
    <button @click="createFile">{{ label }}</button>
  </div>
</template>

<script>
export default {
  name: 'CreateDatastore',
  props: {
    label: {
      type: String,
      default: 'Create Datastore',
    },
  },
  methods: {
    async createFile() {
      try {
        const createRes = await this.$store.dispatch('datastore/createFile');
        this.$log.debug('result: datastore/createFile', createRes);
        const isInit = await this.$dialog.confirm({ message: 'ファイルを初期化しますか?' });
        if (isInit) {
          const initRes = await this.$store.dispatch('datastore/initializeFile');
          this.$log.debug('datastore/initializeFile', initRes);
        }
      } catch (error) {
        this.$log.info(error);
      }
    },
  },
  async mounted() {
    const recentFiles = await (await this.$store.dispatch('datastore/fetch')).recentFiles();
    console.log('recentFiles', recentFiles);
  },
};
</script>
<style lang="scss" scoped>
button {
  font-size: 1rem;
  width: 200px;
  padding: .2rem 1rem;
  &:hover {
    box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
  }
}
</style>
