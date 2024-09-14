<template>
    <button class="select-file" @click="doSelect">{{ label }}</button>
</template>

<script>
export default {
  name: 'SelectFileButton',
  props: {
    label: {
      type: String,
      default: 'ファイルを選択',
    },
  },
  methods: {
    async doSelect() {
      try {
        await this.$store.dispatch('datastore/selectFile');
        const { handle } = await this.$store.getters['datastore/fileState'];
        const recents = await (await this.$store.dispatch('datastore/fetch')).recentFiles();
        const isAlreadyAdded = recents.find((fh) => fh.name === handle.name);
        if (!isAlreadyAdded) {
          await this.$store.dispatch('datastore/addRecent', { handle });
        }
      } catch (error) {
        console.error(error);
        await this.$dialog.alert({ message: error.message });
      }
    },
  },
};
</script>
