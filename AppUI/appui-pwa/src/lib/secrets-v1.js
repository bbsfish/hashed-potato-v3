/* eslint-disable */
import { encrypt, decrypt } from './cypto';
import { XMLParser } from './fxparser.min';
import { XMLBuilder } from './fxbuilder.min';
import { base64ToArrayBuffer, arrayBufferToBase64 } from './string_to_buffer';
import idbKeyval from './idb-keyval-iife';

/**
 * 以下において、次のように名称を定義する.
 * + 暗号配列   - 暗号出力結果(ArrayBuffer) (EncryptedObject)
 * + 暗号文字列 - 暗号配列を Base64 出力したもの (EncryptedString)
 * + 平文配列   - 平文のオブジェクト (PlainObject)
 * + 平文文字列 - XML にパースされた平文配列 (PlainString)
 */

/**
 * XML Parser 設定
 */
const ALWAYS_ARRAY_KEYS = ['services', 'services.accounts'];
const fastXML = {
  // 常に配列にするキーリスト
  // コンストラクト
  parser: new XMLParser({
    ignoreAttributes: false,
    isArray: (name, jpath) => (ALWAYS_ARRAY_KEYS.indexOf(jpath) !== -1),
  }),

  builder: new XMLBuilder(),
};

const secrets = (() => {
  /**
   * 暗号文字列をインポート
   * @param {String} text 暗号文字列
   * @param {String} fileId File ID
   * @param {String} password パスワード
   */
  async function importEncyptedString(text, fileId, password) {
    // text を cipher に変換
    const cipher = base64ToArrayBuffer(text);
    // 保存された CryptKeys 取得
    const cryptokey = await idbKeyval.get(`CryptoKeys::${fileId}`)
      || null;
    if (!cryptokey) { console.log('暗号鍵がありません'); return; }
    // 複合化
    const plainString = await decrypt(cryptokey, cipher, password);
    if (plainString) {
      return fastXML.parser.parse(plainString);
    }
    
    return {
      services: [],
    };
  }

  /**
   * masked を password で暗号化します
   * @param {String} password 暗号化用パスワード
   * @return {ArrayBuffer} 暗号文
   */
  async function exportAsEncryptedString(object, fileId, password) {
    const plainString = fastXML.builder.build(object);
    const crypto = await encrypt(plainString, password);
    await idbKeyval.set(
      `CryptoKeys::${fileId}`,
      { salt: crypto.salt, iv: crypto.iv },
    );
    return arrayBufferToBase64(crypto.cipher);
  }

  return {
    importEncyptedString, exportAsEncryptedString,
  }
})();


export default secrets;
