import { get as getIDB, set as setIDB } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import {
  getNewFileHandle, verifyPermission, writeFile, readFile, getFileHandle,
} from '@/lib/fs-helper';
import { XMLBuilder } from '@/lib/fxbuilder.min';
import { XMLParser } from '@/lib/fxparser.min';
import axios from '@/lib/axios.min.js';
import { base64ToArrayBuffer, arrayBufferToBase64 } from '@/lib/string_to_buffer';
import webStorage from '@/lib/webstorage';
import { encrypt, decrypt } from '@/lib/cypto';

/**
 * XML Parser 設定
 */
const ALWAYS_ARRAY_KEYS = [
  'root.services.service',
  'root.services.service.account',
  'root.services.service.scope',
  'root.youare.info',
];
const fastXML = {
  // 常に配列にするキーリスト
  // コンストラクト
  parser: new XMLParser({
    ignoreAttributes: false,
    isArray: (name, jpath) => (ALWAYS_ARRAY_KEYS.indexOf(jpath) !== -1),
  }),

  builder: new XMLBuilder(),
};

/**
 * FileHandle からテキストを取得し、オブジェクトに変換する.
 * 変換時には XML Parser 設定を使う.
 * @param {object<FileSystemFileHandle>} fileHandle
 * @returns {object|error}
 */
const fileParser = async (fileHandle) => {
  if (verifyPermission(fileHandle)) {
    const startTime = performance.now();
    const file = await fileHandle.getFile();
    const fileText = await readFile(file);
    const object = fastXML.parser.parse(fileText);
    const endTime = performance.now();
    console.log('ファイルのパースにかかった時間: %s ミリ秒', endTime - startTime);
    return object;
  }
  return new Error('File access is denied');
};

/**
 * datastore.default.XML からテンプレートの XML データを取得し、オブジェクトに変換する
 */
const DatastoreDefaultXML = await (async () => {
  const response = await axios.get('/datastore.default.XML');
  // console.info('DatastoreDefaultXML', DatastoreDefaultXML);
  return fastXML.parser.parse(response.data);
})();

const initState = () => ({
  isModified: false,
  file: {
    handle: null,
    id: null,
    meta: null,
    data: null,
  },
  editor: {
    isEmpty: false,
    xtext: null,
    xobject: null,
  },
});

export default {
  namespaced: true,
  state: initState(),
  mutations: {
    addFileKeys: (state, {
      id, iv, salt, override = false,
    }) => {
      const { fileKeys } = state;
      const idx = fileKeys.map((keyset) => keyset.id).indexOf(id);
      if (idx === -1) fileKeys.push({ id, iv, salt });
      else if (override) fileKeys[idx] = { id, iv, salt };
    },
    putFile: (state, {
      handle = undefined,
      id = undefined,
      meta = undefined,
      data = undefined,
    }) => {
      const res = {};
      if (handle) res.handle = handle;
      if (id) res.id = id;
      if (meta) res.meta = meta;
      if (data) res.data = data;
      Object.assign(state.file, res);
      return state.file;
    },
    /**
     * state.editor を上書きする.
     * xobject > xtext の順で優先される.
     * @param {{ xobject: object, xtext: string }}
     */
    putEditor: (state, {
      init = false,
      xobject = undefined,
      xtext = undefined,
    }) => {
      const editorState = {};
      if (init) {
        // 初期化する
        editorState.xtext = null;
        editorState.xobject = null;
        editorState.isEmpty = false;
      } else if (xobject) {
        editorState.xobject = xobject;
        editorState.xtext = fastXML.builder.build(xobject);
      } else if (xtext) {
        editorState.xtext = xtext;
        editorState.xobject = fastXML.parser.parse(xtext);
        if (xtext === '') editorState.isEmpty = true;
      } else {
        return;
      }
      Object.assign(state.editor, editorState);
    },
    isModified: (state, isModified = true) => {
      state.isModified = isModified;
    },
  },
  getters: {
    isExistFileId: (state) => (fileId) => state.fileIds.includes(fileId),
    isModified: (state) => state.isModified,
    isEmptyData: (state) => (!state.file.data || state.file.data === ''),
    fileContentAsXML: (state) => {
      const clone = DatastoreDefaultXML;
      Object.assign(clone, { meta: state.file.meta, data: state.file.data });
      return fastXML.builder.build(clone);
    },
    fileState: (state) => state.file,
    editorState: (state) => {
      const { xtext, xobject } = state.editor;
      if (!xtext) return { xtext: null, xobject: null };
      return {
        xtext: xtext
          .replace(/\n+/g, '')
          .replace(/　+/g, '') // eslint-disable-line no-irregular-whitespace
          .replace(/\s{2,}/g, ''),
        xobject,
      };
    },
  },
  actions: {
    /**
     * Webstorage から、特定の値を取り出し、state に格納します
     * @param {object<VuexContext>}
     * @returns {{ recentFiles: function, fileKeys: function }}
     */
    fetch() {
      const fetch = {};

      /** @type {object<File>[]} 保管している File オブジェクトのリスト */
      fetch.recentFiles = async () => {
        const data = (await getIDB('recentFiles')) ?? [];
        return data;
      };

      /**  @type {{ id: string, iv: string, salt: string }[]} iv, salt は Base64 文字列 */
      fetch.fileKeys = () => {
        const data = webStorage.get('fileKeys', []);
        return data;
      };

      /** @type {string[]} 持っている鍵のIDだけのリスト */
      fetch.fileIds = () => {
        const data = fetch.fileKeys().map((keyset) => keyset.id);
        return data;
      };

      /**
       * 持っている Key Set のリスト
       * @param {string} id File ID
       * @returns {{ index: number, iv: string, salt: string }} iv, salt は Base64 文字列
       */
      fetch.getKeySet = (id) => {
        const keyList = fetch.fileKeys();
        const index = keyList.map((keyset) => keyset.id).indexOf(id);
        if (index === -1) return { index, iv: null, salt: null };
        return { index, iv: keyList[index].iv, salt: keyList[index].salt };
      };
      return fetch;
    },
    push() {
      const push = {};
      push.recentFiles = async (next) => {
        await setIDB('recentFiles', next);
      };
      push.fileKeys = (next) => {
        webStorage.set('fileKeys', next);
      };
      return push;
    },
    async writeOutFile({ getters, commit }) {
      const { handle } = getters.fileState;
      if (await verifyPermission(handle, true)) {
        const startTime = performance.now();
        await writeFile(handle, getters.fileContentAsXML);
        const endTime = performance.now();
        console.log('ファイルの書き込みにかかった時間: %s ミリ秒', endTime - startTime);
        commit('isModified', { isModified: false });
        return true;
      }
      return false;
    },
    /**
     * recentFiles に新しい File オブジェクトを追加します
     * @param {object<VuexContext>}
     * @param {{ handle: object<FileSystemFileHandle> }}
     */
    async addRecent({ dispatch }, { handle }) {
      // WS から recents を取得
      const recents = await (await dispatch('fetch')).recentFiles();
      // recents に追加する
      recents.unshift(handle);
      // WS に recents を保存
      await (await dispatch('push')).recentFiles(recents);
    },
    /**
     * ファイルを選択させ、state.file を上書きします.
     * @param {object<VuexContext>}
     * @returns {{ id: string, meta: {}, data: {} }|error} object(XML コンテンツ) か、エラーを返します
     */
    async selectFile({ commit, getters, dispatch }) {
      if (getters.isModified) throw new Error('File is modified');
      const handle = await getFileHandle();
      const { meta, data } = await fileParser(handle);
      // 選択されたファイルの Device File ID をもとに、既知のファイルか確認する
      // 既知のファイルでなければ、利用できない
      const id = meta.devicefileid;
      // WS から DeviceFileID のリストを取得
      const fileIds = (await dispatch('fetch')).fileIds();
      if (!fileIds.includes(id)) {
        throw new Error('That file is not available in this browser.');
      }
      // 既知のファイルなら state.file に上書きする
      commit('putFile', {
        handle, id, meta, data,
      });
      return { id, meta, data };
    },
    /**
     * Handle を state.file に差し込みます.
     * recentFiles 等、Handle だけ持っているときに使います.
     * @param {object<VuexContext>}
     * @param {object<FileSystemFileHandle>} handle
     * @returns {{ id: string, meta: {}, data: string|null }}
     */
    async plugFile({ dispatch, getters, commit }, { handle }) {
      if (getters.isModified) throw new Error('File is modified');
      // 当該 FileHandle に対する権限を確認
      const verification = await verifyPermission(handle, false);
      // 権限あり
      if (verification) {
        const { meta, data } = await fileParser(handle);
        // 選択されたファイルの Device File ID をもとに、既知のファイルか確認する
        // 既知のファイルでなければ、利用できない
        const id = meta.devicefileid;
        // WS から DeviceFileID のリストを取得
        const fileIds = (await dispatch('fetch')).fileIds();
        if (!fileIds.includes(id)) {
          throw new Error('That file is not available in this browser.');
        }
        // 既知のファイルなら state.file に上書きする
        commit('putFile', {
          handle, id, meta, data,
        });
        return { id, meta, data };
      }
      // 権限なし
      return new Error('No permissions on this file');
    },
    /**
     * ファイルを作成し、DeviceFileID を発行して、state.file に上書きします.
     * これと同時に putFileKey の操作が必要.
     * @param {object<VuexContext>}
     * @returns {{ handle: object<FileSystemFileHandle>, id: string }|error}
     */
    async createFile({ getters, commit }) {
      if (getters.isModified) throw new Error('File is modified');
      // ファイルを作成し、DeviceFileID を発行して、state.file に上書きする
      const handle = await getNewFileHandle('AccountStore_by_hashed-potato.xml');
      const id = uuidv4();
      commit('putFile', {
        handle, id, meta: null, data: null,
      });
      return { handle, id };
    },
    /**
     * DeviceFileID, IV, SALT を WS に登録します.
     * IV, SALT が ArrayBuffer であることに注意.
     * @param {object<VuexContext>}
     * @param {{ id: string, iv: object<ArrayBuffer>, salt: object<ArrayBuffer> }}
     */
    async putFileKey({ dispatch }, { id, iv, salt }) {
      if (!id || id === '') throw new Error('The value you tried to put in WS/fileKeys is invalid.');
      const ivAsString = (iv) ? arrayBufferToBase64(iv) : '';
      const saltAsString = (salt) ? arrayBufferToBase64(salt) : '';
      // WS から FileKey の一覧を取得し、該当する DeviceFileID の KeySet を探す
      const fileKeys = (await dispatch('fetch')).fileKeys();
      const index = fileKeys.map((keyset) => keyset.id).indexOf(id);
      if (index === -1) {
        // KeySet がみつからないとき、fileKeys の先頭に新しい要素を追加する
        fileKeys.unshift({ id, iv: ivAsString, salt: saltAsString });
      } else {
        // KeySet があったとき、新しい IV と SALT を入れる
        Object.assign(fileKeys[index], { iv: ivAsString, salt: saltAsString });
      }
      // WS に新しい FileKey のリストを記録する
      (await dispatch('push')).fileKeys(fileKeys);
    },
    /**
     * state.file のファイルをテンプレート XML で上書きします
     * @param {object<VuexContext>}
     * @returns {{ handle: object<FileSystemFileHandle>, id: string }|error}
     */
    async initializeFile({ getters }) {
      if (getters.isModified) throw new Error('File is modified');
      const { handle, id } = getters.fileState;
      // 当該 FileHandle に対する権限を確認
      // 権限あり
      if (verifyPermission(handle, true)) {
        const newXML = DatastoreDefaultXML;
        Object.assign(newXML, { meta: { devicefileid: id } });
        await writeFile(handle, fastXML.builder.build(newXML));
        return { handle, id };
      }
      // 権限なし
      throw new Error('File cannot be initialized');
    },
    // /**
    //  * state.file のファイルの中身(XML)を取り出し、パースして state.file に入れます
    //  * @param {object<VuexContext>}
    //  * @returns {{ meta: {}, data: {} }|error} object(XML コンテンツ) か、エラーを返します
    //  */
    // async getFileContent({ getters, commit }, { isForce = false }) {
    //   const { content, handle, isModified } = getters.fileState;
    //   if (isModified) throw new Error('File is modified');
    //   if (!isModified && content && !isForce) return content;
    //   const { meta, data } = await fileParser(handle);
    //   commit('putFile', { meta, data, isModified: false });
    //   return { meta, data };
    // },
    /**
     * state.file ファイルのプライベートデータを複合化します.
     * 複合化したデータは state.editor に保存されます.
     * @param {object<VuexContext>}
     * @param {string} password
     * @returns {{ xtext: object, xobject: object }|error} 複合化&パースされたプライベートデータ
     */
    async decryptContent({ getters, dispatch, commit }, { password }) {
      const {
        id, data,
      } = getters.fileState;
      if (data === null || data === '') {
        // 新規ファイル等の理由でプライベートデータがない場合、カラデータを state.editor に入れる
        commit('putEditor', { xobject: {} });
      } else {
        // プライベートデータがある場合
        // WS から当該 IV, SALT を取得
        const { index, iv, salt } = (await dispatch('fetch')).getKeySet(id);
        if (index === -1) throw new Error('No cypto key');
        // プライベートデータ と、取得した Keys は base64 エンコードされているため、ArrayBuffer に変換する
        const ivAB = base64ToArrayBuffer(iv);
        const saltAB = base64ToArrayBuffer(salt);
        const cipher = base64ToArrayBuffer(data);
        // 複合化して、state.editor に入れる
        const startTime = performance.now();
        const xtext = await decrypt({ iv: ivAB, salt: saltAB }, cipher, password);
        const endTime = performance.now();
        console.log('複合化にかかった時間: %s ミリ秒', endTime - startTime);
        commit('putEditor', { xtext });
      }
      return id;
    },
    /**
     * state.editor ファイルのプライベートデータを暗号化し、state.file に上書きします
     * 取得した key セットは上書きされます.
     * state.editor は初期化されます.
     * @param {object<VuexContext>}
     * @param {string} password
     * @returns {{ handle: object<FileSystemFileHandle>, id: string,
     *  data: {{ handle: object<FileSystemFileHandle>, id: string, data: string }} }|error}
     */
    async encryptContent({ getters, commit, dispatch }, { password }) {
      if (!getters.isModified) throw new Error('No change');
      const { handle, id } = getters.fileState;
      const { xtext } = getters.editorState;
      // xtext がカラのとき、暗号化するものはない
      if (!xtext || xtext === '') {
        throw new Error('No content');
      }
      // 暗号化する
      const startTime = performance.now();
      const crypto = await encrypt(xtext, password);
      const endTime = performance.now();
      console.log('暗号化にかかった時間: %s ミリ秒', endTime - startTime);
      // 暗号化で使用した IV, SALT を WS に記録する
      await dispatch('putFileKey', { id, iv: crypto.iv, salt: crypto.salt });
      // 暗号化されたデータ(ArrayBuffer) を Base64 でエンコードして state.file に入れる
      const data = arrayBufferToBase64(crypto.cipher);
      commit('putFile', { data });
      commit('putEditor', { init: true });
      if (await dispatch('writeOutFile')) {
        return { handle, id, data };
      }
      throw new Error('File cannot be output');
    },
  },
};
