import { ulid } from 'ulid';
import { encrypt, decrypt } from './cypto';
import { XMLParser } from './fxparser.min';
import { XMLBuilder } from './fxbuilder.min';
import { base64ToArrayBuffer, arrayBufferToBase64 } from './string_to_buffer';
import idbKeyval from './idb-keyval-iife';

/**
 * XML Parser 用
 * 常に配列にするキー
 */
const ALWAYS_ARRAY_KEYS = [
  'services',
  'services.accounts',
];

/**
 * XML Parser 用
 * オプションオブジェクト
 */
const XML_PARSER_OPTION = {
  ignoreAttributes: false,
  isArray: (name, jpath) => (ALWAYS_ARRAY_KEYS.indexOf(jpath) !== -1),
};

/**
 * Device file の'データ'を取り扱うためのクラス
 */
class Secrets {
  constructor(inputCipher = null) {
    this.cipher = inputCipher;
    this.masked = null;
    this.fileId = null;
  }

  /**
   * ファイルコンテンツの'データ'を取得し、コンストラクトされた Secrets を返します
   * @param {String} encryptedText 暗号化された文字列
   * @return {Object<Secrets>} Secrets オブジェクト
   */
  static importEncyptedData(encryptedText) {
    const cipher = (encryptedText)
      ? base64ToArrayBuffer(encryptedText)
      : new ArrayBuffer();
    return new Secrets(cipher);
  }

  /**
   * masked を取得し、ファイルコンテンツ用の'データ'を生成します
   * @return {Object<Secrets>} Secrets オブジェクト
   */
  exportEncyptedDataAsString() {
    if (this.cipher === null) return '';
    return arrayBufferToBase64(this.cipher);
  }

  /**
   * Device File ID を設定します。暗号化において重要です。
   * @param {String} deviceFileId
   */
  setDeviceFileId(deviceFileId) {
    this.fileId = deviceFileId;
  }

  /**
   * cipher を password で複合化します
   * @param {String} password 複合化用パスワード
   */
  async decryptCipher(password) {
    if (!this.cipher || !this.fileId) return;
    const cryptokey = await idbKeyval.get(`CryptoKeys::${this.fileId}`)
      || null;
    if (!cryptokey) return; // CryptoKey なし
    const xmlStr = await decrypt(cryptokey, this.cipher, password);
    this.masked = new XMLParser(XML_PARSER_OPTION).parse(xmlStr);
    this.cipher = null;
  }

  /**
   * masked を password で暗号化します
   * @param {String} password 暗号化用パスワード
   * @return {ArrayBuffer} 暗号文
   */
  async encryptMasked(password) {
    if (!this.masked || !this.fileId) return;
    const xmlStr = new XMLBuilder().build(this.masked);
    const crypto = await encrypt(xmlStr, password);
    await idbKeyval.set(
      `CryptoKeys::${this.fileId}`,
      { salt: crypto.salt, iv: crypto.iv },
    );
    this.cipher = crypto.cipher;
    this.masked = null;
    console.log('option, c, m:', crypto, this.cipher, this.masked);
  }

  /**
   * Service ID が存在するかどうか確認します
   * @param {String} serviceId 検索対象の Service ID
   * @return {Int} 存在しない場合は -1, 存在する場合は'services'の index
   */
  lookupService(serviceId) {
    if (!this.masked) return -1;
    return this.masked.services
      .map((service) => service.id)
      .indexOf(serviceId);
  }

  /**
   * masked を初期化します.
   * もし masked が null でない場合、初期化されません.
   */
  initMasked() {
    if (this.masked === null) {
      this.masked = { services: [] };
    }
  }

  /**
   * Service ID を指定して Account を登録します
   * もし Service ID が新規の場合、新しい Service として登録されます。
   * @param {Object} {} Service ID と Account オブジェクト
   *  -> {serviceid: String, account: Object}
   */
  pushAccount(userId, userPassword, _serviceId = null) {
    if (this.masked === null) return;
    const serviceId = _serviceId ?? ulid();
    const newAccount = {
      uid: userId,
      password: userPassword,
    };

    const lookupIndex = this.lookupService(serviceId);
    if (lookupIndex === -1) {
      // 新規
      this.masked.services.push({
        id: serviceId,
        accounts: [newAccount],
      });
    } else {
      // 追記
      this.masked.services[lookupIndex]
        .accounts.push(newAccount);
    }

    console.log('Account update:', serviceId, newAccount);
  }

  /**
   * masked データを取得します
   * @return {Object}
   */
  getMaskedAsObject() {
    return this.masked.services;
  }
}

export default Secrets;
