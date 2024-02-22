import { encrypt, decrypt } from '@/lib/crypto';

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
  cipher = null;
  masked = null;
  plain = null;
  fileId = null;

  /**
   * cipher を password で複合化します
   * @param {String} password 複合化用パスワード
   */
  async decrypt (password) {
    if (!this.cipher) {
      console.log('cipher is null');
      return;
    }
    const cryptokey = await idbKeyval.get(`CryptoKeys::${this.fileId}`)||null;
    if (!cryptokey) {
      console.error('no crypto key for', this.fileId);
      return;
    }
    const xml = await decrypt(cryptokey, this.cipher, password);

    const xmlp = new XMLParser(XML_PARSER_OPTION);
    this.masked = xmlp.parse(xml);
    this.cipher = null;
    console.log(cryptokey, this.cipher, this.masked, password);
  }
  /**
   * cipher を password で暗号化します
   * @param {String} password 暗号化用パスワード
   * @return {ArrayBuffer} 暗号文
   */
  async encrypt (password) {
    const xmlb = new XMLBuilder();
    const xml = xmlb.build(this.masked);
    const crypto = await encrypt(xml, password);
    await idbKeyval.set(
        'CryptoKeys::' + this.fileId,
        {salt: crypto.salt, iv: crypto.iv}
    );
    this.cipher = crypto.cipher;
    this.masked = null;
    return this.cipher;
  }

  /**
   * Service ID が存在するかどうか確認します
   * @param {String} serviceId 検索対象の Service ID
   * @return {Int} 存在しない場合は -1, 存在する場合は'services'の index
   */
  isExistService (serviceId) {
    return this.masked.services
        .map((service) => service.id)
        .indexOf(serviceId);
  }

  /**
   * 新しい Service を登録します
   * @param {Object} {} Service ID と Account オブジェクト
   *  -> {serviceid: String, account: Object}
   */
  pushAccount({serviceid, account}) {
    // if data is null: fill the masked
    console.log('this.masked', (!this.masked));
    if (!this.masked) {
      this.masked = {
        services: [{
          id: serviceid,
          accounts: [account]
        }]
      }
    } else {
      const index = this.isExistService(serviceid);
      if (index == -1) {
        this.masked.services.push({
          id: serviceid,
          accounts: [account]
        });
      } else {
        const targetService = this.masked.services[index];
        targetService.accounts.push(account);
      }
    }
    console.log('this.masked', this.masked);
  }

  /**
   * cipher を取得します
   * @return {ArrayBuffer} cipher
   */
  getCipher () {
    return this.cipher;
  }
};

export default Secrets;
