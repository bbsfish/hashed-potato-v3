import { encrypt, decrypt } from './cypto';
import { XMLParser } from './fxparser.min';
import { XMLBuilder } from './fxbuilder.min';
import { base64ToArrayBuffer, arrayBufferToBase64 } from './string_to_buffer';
import idbKeyval from './idb-keyval-iife';
import SecretsMasked from './secrets-masked';

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

class Secrets {
  masked = null;

  static createNewSecrets() {
    const secrets = new Secrets();
    secrets.masked = new SecretsMasked();
    return secrets;
  }

  /**
   * 暗号文字列をインポート
   * @param {String} text 暗号文字列
   * @param {String} fileId File ID
   * @param {String} password パスワード
   */
  async importEncyptedString(text, fileId, password) {
    // text を cipher に変換
    const cipher = base64ToArrayBuffer(text);
    // 保存された CryptKeys 取得
    const cryptokey = await idbKeyval.get(`CryptoKeys::${fileId}`)
      || null;
    if (!cryptokey) { console.log('暗号鍵がありません'); return; }
    // 複合化
    const plainString = await decrypt(cryptokey, cipher, password);
    // 平文配列に変換 して、SecretsMasked をコンストラクトする
    if (plainString) {
      const plainObject = fastXML.parser.parse(plainString);
      this.masked = new SecretsMasked(plainObject);
    } else {
      this.masked = new SecretsMasked();
    }
    console.log('text, fileId, password', text, fileId, password);
    console.log('cryptokey', cryptokey);
    console.log('plainString', plainString);
  }

  /**
   * masked を password で暗号化します
   * @param {String} password 暗号化用パスワード
   * @return {ArrayBuffer} 暗号文
   */
  async exportAsEncryptedString(fileId, password) {
    const plainString = fastXML.builder.build(this.masked.exportAsObject());
    const crypto = await encrypt(plainString, password);
    await idbKeyval.set(
      `CryptoKeys::${fileId}`,
      { salt: crypto.salt, iv: crypto.iv },
    );
    console.log('fileId, password', fileId, password);
    console.log('crypto', crypto);
    return arrayBufferToBase64(crypto.cipher);
  }
}

export default Secrets;
