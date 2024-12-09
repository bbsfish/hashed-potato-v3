import { ulid } from 'ulid';

/**
 * 以下において、次のように名称を定義する.
 * + 暗号配列   - 暗号出力結果(ArrayBuffer)
 * + 暗号文字列 - 暗号配列を Base64 出力したもの
 * + 平文配列   - 平文のオブジェクト
 * + 平文文字列 - XML にパースされた平文配列
 */

class SecretsMasked {
  constructor(plainObject = { services: [] }) {
    this.data = plainObject;
    this.isChanged = false;
  }

  exportAsObject() {
    return this.data;
  }

  /**
   * Service ID が存在するかどうか確認します
   * @param {String} serviceId 検索対象の Service ID
   * @return {Int} 存在しない場合は -1, 存在する場合は'services'の index
   */
  lookupService(serviceId) {
    console.log('lookap, this.data', this.data);
    if (this.data.services.length === 0) return -1;
    return this.masked.services
      .map((service) => service.id)
      .indexOf(serviceId);
  }

  /**
   * Service を追加します. Service ID を識別子として、すでにある場合は追加しません.
   * @param {String} _serviceId 'auto' が指定された場合、自動で ID を割り振る. (Default: 'auto')
   * @returns {String} id 追加された Service ID
   */
  addService(_serviceId = 'auto') {
    const accounts = [];
    const id = (_serviceId !== 'auto')
      ? _serviceId : ulid();
    const lookupIndex = this.lookupService(id);
    if (lookupIndex === -1) {
      // 新規
      this.data.services.push({ id, accounts });
      this.isChanged = true;
    }
    return id;
  }

  addAccount(userId, userPassword, serviceId) {
    console.log('in addAccount', this.data.services);
    const lookupIndex = this.lookupService(serviceId);
    if (lookupIndex > -1) {
      this.data.services[lookupIndex]
        .accounts.push({
          uid: userId,
          password: userPassword,
        });
      this.isChanged = true;
    }
  }
}

export default SecretsMasked;
