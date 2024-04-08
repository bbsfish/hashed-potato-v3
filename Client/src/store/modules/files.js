import fhStore from '@/lib/fh-store';

export default {
  namespaced: true,
  state: {
    fileList: await fhStore.fetch(),
  },
  mutations: {
    async add(state, value) {
      if (!value) return;

      const fh = value; // FileSystemFileHandle

      const storeData = await fhStore.fetch();

      if (storeData.length === 0) {
        await fhStore.push(fh);
        state.fileList = fhStore;
        return;
      }

      // If isSameEntry isn't available, we can't store the file handle
      if (!('isSameEntry' in fh) || !fh.isSameEntry) {
        console.warn('Saving of recents is unavailable.');
        return;
      }

      // Loop through the list of recent files and make sure the file we're
      // adding isn't already there. This is gross.
      const inList = await Promise.all(storeData.map((fhInStore) => fh.isSameEntry(fhInStore)));
      if (inList.some((val) => val)) return;

      // Add the new file handle to the top of the list, and remove any old ones.
      await fhStore.push(fh);
      state.fileList = fhStore;
    },
  },
  getters: {
    fileList: (state) => state.fileList,
    lastUsed: (state) => state.fileList[0],
  },
  actions: {
  },
};
