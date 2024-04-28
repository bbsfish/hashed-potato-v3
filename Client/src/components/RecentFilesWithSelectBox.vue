<template>
  <label for='recent-files-select-box'>
    {{ label }}
    <select
      name='recent-files-select-box'
      @change='selectedRecentFiles'
      v-model='userSelected'
      >
      <option disabled selected class="initial-option" key='init'>選択してください</option>
      <option
        v-for='(history, idx) of histories'
        :value='idx'
        :key='idx'
        >{{ history.name }}</option>
    </select>
  </label>
</template>

<script>
export default {
  name: 'RecentFilesWithSelectBox',
  props: ['label'],
  data() {
    return {
      histories: [],
    };
  },
  methods: {
    // selectedRecentFiles() {
    //   const idx = Number(this.userSelected);
    //   this.$store.commit('user/file', this.histories[idx]);
    // },
  },
  async mounted() {
    this.$log.info(await this.$store.commit('datastore/_pullRecentFiles'));
    const recents = this.$store.getters['datastore/recentFiles'];
    console.log('recents', recents);
    this.histories = recents;
  },
};
</script>

<style lang="scss" scoped>
  // select {
  //   -webkit-appearance: none;
  //   -moz-appearance: none;
  //   appearance: none;
  //   display: block;
  //   width: 100%;
  //   height: 40px;
  //   margin: 10px 0;
  //   padding: 8px;
  //   font-size: 16px;
  // }
</style>
