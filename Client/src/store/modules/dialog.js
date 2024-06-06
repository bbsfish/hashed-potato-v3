const initState = ({
  ref: null,
});

export default {
  namespaced: true,
  state: initState,
  mutations: {
    ref: (state, ref) => {
      if (ref) state.ref = ref;
    },
  },
  getters: {
    ref: (state) => state.ref,
  },
};
