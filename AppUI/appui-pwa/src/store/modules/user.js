import fileMaster from '@/lib/file-master';

const getDefaultState = () => ({
  file: null,
});

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    file(state, value) {
      if (value) state.file = value;
      console.log('mutation: file to', value);
    },
  },
  getters: {
    file: (state) => state.file,
    fileContent: (state) => {
      if (state.file) return fileMaster.getContent(state.file);
      return null;
    },
  },
  actions: {},
};
