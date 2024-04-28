import { get as getIDB, set as setIDB } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import {
  getNewFileHandle, verifyPermission, writeFile, readFile, getFileHandle,
} from '@/lib/fs-helper';
import { XMLBuilder } from '@/lib/fxbuilder.min';
// import { XMLParser } from '@/lib/fxparser.min';
import devTemplate from '@/formats/device-file-template.json';
import { XMLParser } from '@/lib/fxparser.min';
import { base64ToArrayBuffer, arrayBufferToBase64 } from '@/lib/string_to_buffer';
import webStorage from '@/lib/webstorage';
import { encrypt, decrypt } from '@/lib/cypto';

/**
 * XML Parser 設定
 */
const ALWAYS_ARRAY_KEYS = ['services.service'];
const fastXML = {
  // 常に配列にするキーリスト
  // コンストラクト
  parser: new XMLParser({
    ignoreAttributes: false,
    isArray: (name, jpath) => (ALWAYS_ARRAY_KEYS.indexOf(jpath) !== -1),
  }),

  builder: new XMLBuilder(),
};

const fileParser = async (fileHandle) => {
  if (verifyPermission(fileHandle)) {
    const file = await fileHandle.getFile();
    const fileText = await readFile(file);
    const object = fastXML.parser.parse(fileText);
    return object;
  }
  return new Error('file access is banned');
};

const initState = () => ({
  /**
   * 操作対象
   */
  file: {
    handle: null,
    id: null,
    isModified: false,
    meta: null,
    data: null,
  },
  editor: {
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
      isModified = undefined,
      meta = undefined,
      data = undefined,
    }) => {
      const res = {};
      if (handle) res.handle = handle;
      if (id) res.id = id;
      if (isModified) res.isModified = isModified;
      if (meta) res.meta = meta;
      if (data) res.data = data;
      Object.assign(state.file, res);
      return state.file;
    },
    putEditor: (state, {
      xtext = undefined,
      xobject = undefined,
    }) => {
      const res = { xtext, xobject };
      if (xtext) res.xobject = fastXML.parser.parse(xtext);
      else if (xobject) res.xtext = fastXML.builder.build(xobject);
      Object.assign(state.editor, res);
      return state.editor;
    },
    modified: (state) => {
      if (!state.file.isModified) state.file.isModified = true;
    },
  },
  getters: {
    isExistFileId: (state) => (fileId) => state.fileIds.includes(fileId),
    isFileModified: (state) => state.file.isModified,
    fileContentAsXML: (state) => {
      const clone = devTemplate;
      Object.assign(clone, { meta: state.file.meta, data: state.file.data });
      console.log('fileContentAsXML', clone);
      return fastXML.builder.build(clone);
    },
    fileState: (state) => state.file,
    editorState: (state) => {
      const { xtext, xobject } = state.editor;
      return {
        xtext: xtext.replace(/[\n\s　]+/g, ''), // eslint-disable-line no-irregular-whitespace
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

      /**  @type {{ id: string, iv: string, salt: string: }} iv, salt は Base64 文字列 */
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
        await writeFile(handle, getters.fileContentAsXML);
        commit('putFile', { isModified: false });
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
      const fileHandle = handle;
      if (!fileHandle) return;
      // If isSameEntry isn't available, we can't store the file handle
      if (!fileHandle.isSameEntry) {
        console.warn('Saving of recents is unavailable.');
        return;
      }
      const recents = await (await dispatch('fetch')).recentFiles();
      // Loop through the list of recent files and make sure the file we're
      // adding isn't already there. This is gross.
      const inList = await Promise.all(recents.map((f) => fileHandle.isSameEntry(f)));
      if (inList.some((val) => val)) return;
      // Add the new file handle to the top of the list, and remove any old ones.
      recents.unshift(handle);
      await (await dispatch('push')).recentFiles(recents);
    },
    /**
     * ファイルを選択させ、state.file を上書きします.
     * @param {object<VuexContext>}
     * @returns {{ id: string, meta: {}, data: {} }|error} object(XML コンテンツ) か、エラーを返します
     */
    async selectFile({ commit, getters, dispatch }) {
      const file = getters.fileState;
      if (file.isModified) throw new Error('File is modified');
      const handle = await (async () => {
        try {
          return await getFileHandle();
        } catch (error) {
          return null;
        }
      })();
      if (!handle) throw new Error('No file selected');
      const { meta, data } = await fileParser(handle);
      const id = meta.devicefileid;
      const fileIds = (await dispatch('fetch')).fileIds();
      if (!fileIds.includes(id)) {
        throw new Error('Unknown File ID in this browser');
      }
      commit('putFile', {
        handle, id, isModified: false, meta, data,
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
    async plugFile({ dispatch, commit }, { handle }) {
      if (!handle) throw new Error('No file selected');
      const verification = await verifyPermission(handle, false);
      if (verification) {
        const { meta, data } = await fileParser(handle);
        const id = meta.devicefileid;
        const fileIds = (await dispatch('fetch')).fileIds();
        if (!fileIds.includes(id)) {
          throw new Error('Unknown File ID in this browser');
        }
        commit('putFile', {
          handle, id, isModified: false, meta, data,
        });
        return { id, meta, data };
      }
      return new Error('File cannot be set');
    },
    /**
     * ファイルを作成し、state.file を上書きします.
     * ファイル ID 新規作成、recentFIles への登録など.
     * ファイルへの書き込みはしません.
     * @param {object<VuexContext>}
     * @returns {{ handle: object<FileSystemFileHandle>, id: string }|error}
     */
    async createFile({ getters, dispatch, commit }) {
      if (getters.isFileModified) throw new Error('File is modified');
      const handle = await (async () => {
        try {
          return await getNewFileHandle('AccountStore_by_hashed-potato.xml');
        } catch (error) {
          return null;
        }
      })();
      if (!handle) throw new Error('No file created');
      const id = uuidv4();
      commit('putFile', {
        handle, id, isModified: false, meta: null, data: null,
      });
      // もしファイルが初期化されない場合、ファイルにIDが書き込まれないので注意
      dispatch('addRecent', { handle });
      const fileKeys = (await dispatch('fetch')).fileKeys();
      fileKeys.unshift({ id, iv: null, salt: null });
      (await dispatch('push')).fileKeys(fileKeys);
      return { handle, id };
    },
    /**
     * state.file のファイルをテンプレート XML で上書きします
     * @param {object<VuexContext>}
     * @returns {{ handle: object<FileSystemFileHandle>, id: string }|error}
     */
    async initializeFile({ getters }) {
      const file = getters.fileState;
      if (!file.handle) throw new Error('No file selected');
      if (file.isModified) throw new Error('File is modified');
      if (verifyPermission(file.handle, true)) {
        const temp = devTemplate;
        temp.meta.devicefileid = file.id;
        await writeFile(file.handle, fastXML.builder.build(temp));
        return { handle: file.handle, id: file.id };
      }
      throw new Error('File cannot be initialized');
    },
    /**
     * state.file のファイルの中身(XML)を取り出し、パースして state.file に入れます
     * @param {object<VuexContext>}
     * @returns {{ meta: {}, data: {} }|error} object(XML コンテンツ) か、エラーを返します
     */
    async getFileContent({ getters, commit }, { isForce = false }) {
      const { content, handle, isModified } = getters.fileState;
      if (!handle) throw new Error('No file selected');
      if (isModified) throw new Error('File is modified');
      if (!isModified && content && !isForce) return content;
      const { meta, data } = await fileParser(handle);
      commit('putFile', { meta, data, isModified: false });
      return { meta, data };
    },
    /**
     * state.file ファイルのプライベートデータを複合化します.
     * 複合化のための iv, salt は state.file に保存されます
     * 複合化したデータは state.editor に保存されます.
     * @param {object<VuexContext>}
     * @param {string} password
     * @returns {object|error} 複合化&パースされたプライベートデータ
     */
    async decryptContent({ getters, dispatch, commit }, { password }) {
      const {
        handle, id, data, // meta,
      } = getters.fileState;
      if (!handle) throw new Error('No file selected');
      if (!data || data === '') {
        commit('putEditor', { xtext: '' });
        return {};
      }
      const { index, iv, salt } = (await dispatch('fetch')).getKeySet(id);
      const ivAB = base64ToArrayBuffer(iv);
      const saltAB = base64ToArrayBuffer(salt);
      if (index === -1) throw new Error('No cypto key');
      const cipher = base64ToArrayBuffer(data);
      const plainText = await decrypt({ iv: ivAB, salt: saltAB }, cipher, password);
      const plainObject = fastXML.parser.parse(plainText);
      commit('putEditor', { xtext: plainText, xobject: plainObject });
      return { xtext: plainText, xobject: plainObject };
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
      const {
        handle, id, isModified,
      } = getters.fileState;
      const {
        xtext,
      } = getters.editorState;
      if (!handle) throw new Error('No file selected');
      if (!isModified) throw new Error('No change');
      if (!xtext || xtext === '') {
        throw new Error('No content');
      }
      const crypto = await encrypt(xtext, password);
      (async () => {
        const fileKeys = (await dispatch('fetch')).fileKeys();
        const { index } = (await dispatch('fetch')).getKeySet(id);
        Object.assign(fileKeys[index], {
          iv: arrayBufferToBase64(crypto.iv),
          salt: arrayBufferToBase64(crypto.salt),
        });
        (await dispatch('push')).fileKeys(fileKeys);
      })();
      const newData = arrayBufferToBase64(crypto.cipher);
      commit('putFile', {
        data: newData,
        isModified: true,
      });
      commit('putEditor', {
        xtext: null,
        xobject: null,
      });
      if (await dispatch('writeOutFile')) {
        return { handle, id, data: newData };
      }
      throw new Error('File cannot be output');
    },
    // async putPrivateData({ getters, commit }, nextPrivateData) {
    //   const file = getters.fileState;
    //   if (!file.handle || !file.content) throw new Error('No file selected');
    //   if (file.content.data !== '' && typeof file.content.data === 'string') {
    //     throw new Error('Private data is locked');
    //   }
    //   file.content.data = nextPrivateData;
    //   commit('_putFileContent', file.content);
    //   commit('setModified', true);
    //   return { handle: file.handle, id: file.id, data: nextPrivateData };
    // },
    // async commitFile({ getters, commit }) {
    //   const file = getters.fileState;
    //   if (!file.handle) throw new Error('No file selected');
    //   if (!file.isModified) throw new Error('No change');
    //   await writeFile(file.handle, fastXML.builder.build(file.content));
    //   commit('setModified', false);
    //   commit('_putFileContent', null);
    //   return { handle: file.handle, id: file.id };
    // },
  },
};
