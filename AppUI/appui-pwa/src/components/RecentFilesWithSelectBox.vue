<template>
  <label for='recent-files-select-box'>
    {{ label }}
    <select
      name='recent-files-select-box'
      @change='selectedRecentFiles'
      v-model='userSelected'
      >
      <option disabled>Please select one</option>
      <option value="0">hello</option>
      <!-- <option
        v-for='(history, idx) of recentFiles'
        value='idx'
        :key='idx'
        >hello</option> -->
    </select>
  </label>
</template>

<script>
import { idbKeyval } from '@/lib/idb-keyval-iife';

export default {
  name: 'RecentFilesWithSelectBox',
  props: ['label'],
  data() {
    return {
      recentFiles: [],
    };
  },
  methods: {
    /**
     * recentFiles を更新します
     */
    async refreshRecentFiles() {
      this.recentFiles = await idbKeyval.get('recentFiles') || [];
    },
    /**
     * recentFiles に、指定の FileSystemFileHandle を登録します
     * 重複する場合は登録しません
     * 最大登録個数は 5 です
     * @param {Object<FileSystemFileHandle>} fileHandle
     */
    async saveRecentFiles(fileHandle) {
      if (!fileHandle) return;
      (await this.refreshRecentFiles());
      // const history = this.recentFiles;

      // If isSameEntry isn't available, we can't store the file handle
      if (!fileHandle.isSameEntry) {
        console.warn('Saving of recents is unavailable.');
        return;
      }

      // Loop through the list of recent files and make sure the file we're
      // adding isn't already there. This is gross.
      const inList = await Promise.all(this.recentFiles.map((f) => fileHandle.isSameEntry(f)));
      if (inList.some((val) => val)) {
        return;
      }

      // Add the new file handle to the top of the list, and remove any old ones.
      this.recentFiles.unshift(fileHandle);
      if (this.recentFiles.length > 5) {
        this.recentFiles.pop();
      }

      // Save the list of recent files.
      idbKeyval.set('recentFiles', this.recentFiles);
      (await this.refreshRecentFiles());
      console.log('saved');
    },
    selectedRecentFiles() {
      const idx = Number(this.userSelected);
      this.$emit('pullRecentFile', this.recentFiles[idx]);
    },
    testMethod(arg) {
      console.log(arg);
    },
  },
  async mounted() {
    await this.refreshRecentFiles();
    console.log(this.recentFiles);
  },
};
</script>
