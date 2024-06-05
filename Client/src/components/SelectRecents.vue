<template>
  <div class="select-recents">
    <label for="recent_files_select_box">
      <span>{{ label }}</span>
      <select
        v-model='userSelected'
        @change='onSelected'
        name="recent_files_select_box"
        id="recent_files_select_box"
      >
        <option disabled key='disabled' :value="disabledValue">{{ disabledValue }}</option>
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
    async onSelected() {
      const idx = Number(this.userSelected);
      const selectedFileHandle = this.histories[idx];
      this.$log.debug('Selected Recent File:', '\nIndex:', idx, '\nItem:', selectedFileHandle);
      this.setFileToState(selectedFileHandle);
    },
    async setFileToState(handle) {
      try {
        const { id, meta, data } = await this.$store.dispatch('datastore/plugFile', { handle });
        this.$log.debug('Set new FileHandle:', '\nID:', id, '\nMeta:', meta, '\nData:', data);
      } catch (error) {
        this.$log.error(error);
      }
    },
  },
  async mounted() {
    const recentFiles = await (await this.$store.dispatch('datastore/fetch')).recentFiles();
    this.histories = recentFiles;
    this.$log.debug('@SelectRecents/mounted', '\nFetched RecentFiles:', recentFiles);
  },
};
</script>

<style lang="scss" scoped>
  .select-recents {
    display: inline;
    span {
      margin-right: .5rem;
    }
    select {
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>
