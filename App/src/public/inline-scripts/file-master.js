import {
  getFileHandle, getNewFileHandle, readFile, writeFile, verifyPermission,
} from './fs-helper';

import {
  decrypt, encrypt
} from './security';

/**
 * Device file を取り扱うための基本クラス
 */
class FileMaster {
  #file = {
    handle: null,
    fname: null,
    content: null
  };

  #history = {
    recentFiles: null
  };

  /**
   * FilePicker を表示し、ユーザの選択したデバイスファイルの FileSystemFileHandle を返します
   * @return {!Promise<FileSystemFileHandle>}
   */
  static async selectFile () {
    return await getFileHandle();
  }
  /**
   * FilePicker を表示し、デバイスファイルを作成します
   * 成功した場合、そのデバイスファイルの FileSystemFileHandle を返します
   * @param {string} suggestedName ファイル名の提案
   * @return {!Promise<FileSystemFileHandle>} 作成したファイルの FileSystemFileHandle
   */
  static async createFile (suggestedName = 'My-Account-Store.txt') {
    return await getNewFileHandle(suggestedName);
  }

  /**
   * *** ファイルハンドル ***
   */

  /**
   * ファイルハンドルを設定します
   * @param {Object<FileSystemFileHandle>} fileHandle 設定するファイルハンドル
   */
  async setFileHandle(fileHandle) {
    this.#file.handle = fileHandle;
    this.#file.fname = fileHandle.name;
    (await this.#refreshFileContent());
  }

  /**
   * *** メタデータ ***
   */

  /**
   * ファイルに DeviceFileId を設定します
   * @param {string} id 設定する DeviceFileId
   * @param {boolean} overWrite DeviceFileId が設定済みの場合のための上書き設定
   */
  setDeviceFileId (id, overWrite = false) {
    if (!this.#file.content) {
      console.error('File is not attached.');
      return;
    }
    if (this.#file.content.meta.devicefileid && !overWrite) {
      console.error('File has id.');
      return;
    }
    this.#file.content.meta.devicefileid = id;
  }

  /**
   * *** ファイルコンテンツ ***
   */

  /**
   * ファイルコンテンツを取得します
   * @return {object} ファイルコンテンツオブジェクト
   */
  getFileContent () {
    if (!this.#file.handle) {
      return;
    }
    console.log('this.#file.content', this.#file.content);
    return this.#file.content;
  }
  /**
   * ファイルコンテンツにテンプレートを展開します
   */
  copyFileContentTemplate () {
    if (this.#file.content) {
      console.error('file has content');
      return;
    }
    this.#file.content = {
      '?xml version=\'1.0\' encoding=\'UTF-8\'': null,
      'application': {
        'name': 'Account-Store',
        'group': 'hashed-potato.com'
      },
      'meta': {
        'version': 1,
        'devicefileid': ''
      },
      'data': ''
    };
    console.log(this.#file.content);
  }
  /**
   * ファイルコンテンツの'データ'が Empty かどうかを調べます
   * @return {boolean}
   */
  isDataEmpty () {
    return this.#file.content.data == '';
  }
  /**
   * ファイルコンテンツをファイルに書き込みます
   */
  async writeOut () {
    const xmlb = new XMLBuilder({
      format: true,
    });
    const xml = xmlb.build(this.#file.content);
    myEvent('file master', 'writeout', xml);
    await writeFile(this.#file.handle, xml);
  }
  /**
   * 設定中の FileSystemFileHandle から
   * すなわち、デバイスファイルからコンテンツを取得します
   */
  async #refreshFileContent () {
    if (!this.#file.handle) {
      return;
    }
    if (await verifyPermission(this.#file.handle, true) === false) {
      console.error(`User did not grant permission to '${this.#file.fname}'`);
      return;
    }
    const file = await this.#file.handle.getFile();
    const fileText = await readFile(file);
    const parser = new XMLParser();
    this.#file.content = parser.parse(fileText);
  }

  /**
   * *** 環境 ***
   */

  /**
   * FileSystemAccessAPI が利用可能か確認します
   * @return {boolean}
   */
  hasFSAccess () {
    return 'chooseFileSystemEntries' in window ||
      'showOpenFilePicker' in window;
  }
  /**
   * デバイスが Mac かどうか確認します
   * @return {boolean}
   */
  isMac () {
    return navigator.userAgent.includes('Mac OS X');
  }

  /**
   * ファイル履歴を取得します
   * @return {Array<FileSystemFileHandle>}
   */
  async getRecentFiles () {
    if (!this.#history.recentFiles) {
      (await this.#refreshRecentFiles());
    }
    return this.#history.recentFiles;
  }
  /**
   * ファイル履歴のうち、最も新しい FileSystemFileHandle を取得します
   * @return {Object<FileSystemFileHandle>}
   */
  async getLastFile () {
    const recentFiles = await this.getRecentFiles();
    if (recentFiles.length == 0) {
      return null;
    }
    return recentFiles[0];
  }
  /**
   * ファイル履歴に、現在の FileSystemFileHandle を登録します
   * 重複する場合は登録しません
   * 最大登録個数は 5 です
   */
  async setRecentFiles () {
    const fileHandle = this.#file.handle;
    if (!fileHandle) {
      return;
    }
    const recentFiles = await this.getRecentFiles();

    // If isSameEntry isn't available, we can't store the file handle
    if (!fileHandle.isSameEntry) {
      console.warn('Saving of recents is unavailable.');
      return;
    }

    // Loop through the list of recent files and make sure the file we're
    // adding isn't already there. This is gross.
    const inList = await Promise.all(recentFiles.map((f) => {
      return fileHandle.isSameEntry(f);
    }));
    if (inList.some((val) => val)) {
      return;
    }

    // Add the new file handle to the top of the list, and remove any old ones.
    recentFiles.unshift(fileHandle);
    if (recentFiles.length > 5) {
      recentFiles.pop();
    }

    // Save the list of recent files.
    idbKeyval.set('recentFiles', recentFiles);
    (await this.#refreshRecentFiles());
  }
  /**
   * ファイル履歴 recentFiles を更新します
   */
  async #refreshRecentFiles () {
    this.#history.recentFiles = await idbKeyval.get('recentFiles') || [];
  }

  /**
   * *** 暗号化 **
   */

  /**
   * ファイルコンテンツの'データ'を取得し、コンストラクトされた Secrets を返します
   * @return {Object<Secrets>} 
   */
  getSecrets () {
    const cipher = (this.#file.content.data == '') ?
      null : base64ToArrayBuffer(this.#file.content.data);
    return new Secrets(cipher, this.#file.content.meta.devicefileid);
  }
  /**
   * ArrayBuffer の暗号化データを文字列に変換してファイルコンテンツの'データ'に設定します
   * @param {ArrayBuffer} cipher 暗号化データ
   */
  setCipherAsString (cipher) {
    this.#file.content.data = arrayBufferToBase64(cipher);
    console.log('this.#file.content.data', this.#file.content.data);
  }
}

/**
 * XML Parser 用
 * 常に配列にするキー
 */
const ALWAYS_ARRAY_KEYS = [
  'services',
  'services.accounts'
];
/**
 * XML Parser 用
 * オプションオブジェクト
 */
const XML_PARSER_OPTION = {
  ignoreAttributes: false,
  isArray: (name, jpath, isLeafNode, isAttribute) => {
    if (ALWAYS_ARRAY_KEYS.indexOf(jpath) !== -1) return true;
  }
};

/**
 * Device file の'データ'を取り扱うためのクラス
 */
class Secrets {
  /**
   * 基本設定
   * @param {ArrayBuffer} cipher ArrayBuffer の暗号文
   * @param {String} deviceFileId Device File ID
   */
  constructor (cipher, deviceFileId) {
    this.#cipher = cipher;
    this.#fileId = deviceFileId;
  }

  #cipher = null;
  #masked = null;
  #plain = null;
  #fileId = null;

  /**
   * cipher を password で複合化します
   * @param {String} password 複合化用パスワード
   */
  async decrypt (password) {
    if (!this.#cipher) {
      console.log('cipher is null');
      return;
    }
    const cryptokey = await idbKeyval.get(`CryptoKeys::${this.#fileId}`)||null;
    if (!cryptokey) {
      console.error('no crypto key for', this.#fileId);
      return;
    }
    const xml = await decrypt(cryptokey, this.#cipher, password);

    const xmlp = new XMLParser(XML_PARSER_OPTION);
    this.#masked = xmlp.parse(xml);
    this.#cipher = null;
    console.log(cryptokey, this.#cipher, this.#masked, password);
  }
  /**
   * cipher を password で暗号化します
   * @param {String} password 暗号化用パスワード
   * @return {ArrayBuffer} 暗号文
   */
  async encrypt (password) {
    const xmlb = new XMLBuilder();
    const xml = xmlb.build(this.#masked);
    const crypto = await encrypt(xml, password);
    await idbKeyval.set(
        'CryptoKeys::' + this.#fileId,
        {salt: crypto.salt, iv: crypto.iv}
    );
    this.#cipher = crypto.cipher;
    this.#masked = null;
    return this.#cipher;
  }

  /**
   * Service ID が存在するかどうか確認します
   * @param {String} serviceId 検索対象の Service ID
   * @return {Int} 存在しない場合は -1, 存在する場合は'services'の index
   */
  isExistService (serviceId) {
    return this.#masked.services
        .map((service) => service.id)
        .indexOf(serviceId);
  }

  /**
   * 新しい Service を登録します
   * @param {Object} {} Service ID と Account オブジェクト
   *  -> {serviceid: String, account: Object}
   */
  pushAccount({serviceid, account}) {
    // if data is null: fill the #masked
    console.log('this.#masked', (!this.#masked));
    if (!this.#masked) {
      this.#masked = {
        services: [{
          id: serviceid,
          accounts: [account]
        }]
      }
    } else {
      const index = this.isExistService(serviceid);
      if (index == -1) {
        this.#masked.services.push({
          id: serviceid,
          accounts: [account]
        });
      } else {
        const targetService = this.#masked.services[index];
        targetService.accounts.push(account);
      }
    }
    console.log('this.#masked', this.#masked);
  }

  /**
   * cipher を取得します
   * @return {ArrayBuffer} cipher
   */
  getCipher () {
    return this.#cipher;
  }
};

