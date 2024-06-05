const initState = ({
  prompt: null,
});

export default {
  namespaced: true,
  state: initState,
  mutations: {
    ref: (state, { prompt }) => {
      if (prompt) state.prompt = prompt;
    },
  },
  getters: {
    ref: (state) => (key) => state[key],
  },
};
