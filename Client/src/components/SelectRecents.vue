<template>
  <div class="select-recents">
    <label for='recent-files-select-box'>
      {{ label }}
      <select
        name='recent-files-select-box'
        @change='selectedRecentFiles'
        v-model='userSelected'
        >
        <option disabled key='disabled'>{{ disabledValue }}</option>
        <option
          v-for='(history, idx) of histories'
          :value='idx'
          :key='idx'
          >{{ history.name }}</option>
      </select>
    </label>
  </div>
</template>

<script>
export default {
  name: 'RecentFilesWithSelectBox',
  props: {
    label: {
      type: String,
      default: 'Recent Files',
    },
    disabledValue: {
      type: String,
      default: '--- Select Recent Files:',
    },
  },
  data() {
    return {
      histories: [],
      userSelected: null,
    };
  },
  methods: {
    async selectedRecentFiles() {
      const idx = Number(this.userSelected);
      const selectedHistoryItem = this.histories[idx];
      this.$log.debug('selectedHistoryItem', selectedHistoryItem);
      try {
        const result = await this.$store.dispatch('datastore/plugFile', { handle: selectedHistoryItem });
        this.$log.debug('datastore/plugFile, result', result);
      } catch (error) {
        this.$log.info(error);
      }
    },
  },
  async mounted() {
    const recentFiles = await (await this.$store.dispatch('datastore/fetch')).recentFiles();
    this.histories = recentFiles;
  },
};
</script>
