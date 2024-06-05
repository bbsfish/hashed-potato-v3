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
        const { handle, id } = await this.$store.dispatch('datastore/createFile');
        this.$log.debug('Created file', '\nID:', id, '\nFileHandle:', handle);
        this.initFile();
        this.saveFileID(id);
        this.addHandleIntoRecentFiles(handle);
      } catch (error) {
        this.$log.error(error);
      }
    },
    async initFile() {
      try {
        const isInit = await this.$dialog.confirm({ message: 'ファイルを初期化しますか?' });
        if (isInit) {
          const { handle, id } = await this.$store.dispatch('datastore/initializeFile');
          this.$log.debug('Initialized file', '\nID:', id, '\nFileHandle:', handle);
        }
      } catch (error) {
        this.$log.error(error);
      }
    },
    async saveFileID(id) {
      try {
        await this.$store.dispatch('datastore/putFileKey', {
          id, iv: null, salt: null,
        });
      } catch (error) {
        this.$log.error(error);
      }
    },
    async addHandleIntoRecentFiles(handle) {
      await this.$store.dispatch('datastore/addRecent', { handle });
    },
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
