/**
 * Vuex 用ロガープラグイン
 * @/store/index.js でインポート
 */

const logger = (store) => {
  store.subscribe((mutation, state) => {
    // それぞれのミューテーションの後に呼ばれます
    const { type, payload } = mutation;
    console.group('Store Mutation');
    console.debug('type:', type);
    console.debug('payload:', payload);
    console.debug('state:', state);
    console.groupEnd();
  });
};

export default logger;
