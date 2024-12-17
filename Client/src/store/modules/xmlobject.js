const initState = () => ({
  /** @type {object} XML Object */
  xo: null,
});

export default {
  namespaced: true,
  state: initState(),
  mutations: {
    initXmlObject(state) {
      console.log('initXmlObject', state);
      if (state.xo === null || !('root' in state.xo) || typeof state.xo.root === 'string') {
        state.xo = { root: {} };
      }
      console.debug('typeof state.xo.root', typeof state.xo.root);

      const r = state.xo.root;
      console.debug('typeof r.services', typeof r.services);
      if (!('services' in r) || typeof r.services === 'string') {
        r.services = { service: {} };
      }
      console.debug('typeof r.services.service', typeof r.services.service);
      if (!('service' in r.services) || typeof r.services.service === 'string') {
        r.services.service = [];
      }
      console.debug('typeof r.youare', typeof r.youare);
      if (!('youare' in r) || typeof r.youare === 'string') {
        r.youare = { info: {} };
      }
      console.debug('typeof r.youare', typeof r.youare);
      if (!('info' in r.youare) || typeof r.youare.info === 'string') {
        r.youare.info = [];
      }
      state.xo.root = r;
    },
    putXmlObject(state, object) {
      state.xo = object;
    },
    putServices(state, next) {
      state.xo.root.services.service = next;
    },
    putServiceById(state, { id, content }) {
      const idx = state.xo.root.services.service
        .findIndex((srv) => srv.id === id);
      if (idx > -1) state.xo.root.services.service[idx] = content;
    },
    putPersonalInfo(state, { key, value }) {
      const { info } = state.xo.root.youare;
      const existing = info.find((row) => (row.key === key && row.value === value));
      if (!existing) {
        info.push({ key, value });
        state.xo.root.youare.info = info;
      }
    },
    addKeyOfService(state) {
      state.xo.root.services.service = [];
    },
  },
  getters: {
    _xo: (state) => state.xo,
    xmlObject: (state) => state.xo,
    root: (state) => state.xo?.root,
    services: (state) => state.xo?.root?.services?.service,
    personalInfo: (state) => state.xo?.root?.youare.info,
    getServiceById: (state, getters) => (serviceId) => {
      const servs = getters.services;
      console.debug('getServiceById', serviceId, 'in', servs);
      if (!servs) return undefined;
      if (servs.length > 0) { // undefined
        return servs.find((srv) => srv.id === serviceId);
      }
      return undefined;
    },
    getPersonalInfoByKey: (state, getters) => (key) => {
      const info = getters.personalInfo;
      const target = info[key];
      return target;
    },
  },
  actions: {
    /**
     * Service ブロックを追加する. 重複する場合はエラー.
     * @param {{id: string, object: object}} 追加する Service ID とそのデータ
     * @returns {{id: string, object: object}} 追加した Service ID とそのデータ
     */
    addService: ({ getters, commit }, { id, object = {} }) => {
      const servs = (() => {
        if ('service' in getters.services) {
          return getters.services.service;
        }
        commit('addKeyOfService');
        return [];
      })();
      if (getters.getServiceById(id)) throw new Error('Service ID が重複しています');
      const newBlock = object;
      Object.assign(newBlock, { id });
      servs.push(newBlock);
      commit('putServices', servs);
      console.debug('Service ブロックを追加, 追加分:', newBlock, ', 結果:', servs);
      return { id, object };
    },
    /**
     * ServiceID を指定して Credential を追加する.
     * Service ブロックに Credential がすでにあれば結合し、なければ作成して代入する.
     * @param {{ id: string, credential: object }} 対象の Service ID とその認証データ
     * @returns {{ id: string, credential: object }}
     */
    addCredential: ({ getters, commit }, { id, credential }) => {
      const servs = getters.getServiceById(id); /** @type {object} Service ブロック */
      console.debug('Credential を追加, ServiceID:', id, ', Credential:', credential);
      if (!servs) throw new Error('Service ID が見つかりません');
      if ('credential' in servs) {
        Object.assign(servs.credential, credential);
      } else {
        servs.credential = credential;
      }
      commit('putServiceById', { id, content: servs });
      return { id, credential };
    },
    getCredentialByServiceId: ({ getters }, { id }) => {
      const servs = getters.getServiceById(id);
      if (!servs) throw new Error('Service ID が見つかりません');
      if (!('credential' in servs)) throw new Error('Credential がありません');
      return servs.credential;
    },
  },
};
