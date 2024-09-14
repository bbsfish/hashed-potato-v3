class PrivateData {
  /**
   * XML オブジェクトデータ から、必要な情報を取り出すことができる.
   * なお、他のデータには一切影響を与えない.
   * @param {object} xmlobject XML オブジェクトデータ
   */
  constructor(data) {
    this.data = data;
    if (!XMLObject.checkFormat(xmlobject)) {
      throw new Error('無効なファイルです');
    }
    this.xmlRawData = xmlobject;
    this.root = xmlobject.root;
  }

  /**
   * XML オブジェクトが適切かどうか検証する. 対象は root/youare/services
   * @param {object} xmlobject XML オブジェクトデータ
   * @returns {boolean} 検証結果. 良: true / 不可: false.
   */
  static checkFormat(xmlobject) {
    if (typeof xmlobject !== 'object') return false;
    if (!('root' in xmlobject)) return false;
    const rightfulness = [
      ('youare' in xmlobject.root),
      ('services' in xmlobject.root),
    ];
    if (rightfulness.includes(false)) return false;
    return true;
  }

  /**
   * XML オブジェクトデータを出力する.
   * @returns {object} XML オブジェクトデータ
   */
  getData() {
    return this.xdata;
  }

  setRootFromXMLRawData() {
    this.root = this.xmlRawData.root;
  }

  /**
   * タグ名から個人情報を取得する
   * @param {string} tagName 検索対象のタグ名
   * @returns {object|undefined} タグ値. なければ undefined.
   */
  getPersonalInfoByTagName(tagName) {
    if (tagName in this.root.youare) {
      return this.root.youare[tagName];
    }
    console.debug('指定されたキーはありません');
    return undefined;
  }

  /**
   * Service ID からサービス情報を取得する
   * @param {string} serviceId 検索対象の Service ID
   * @returns {object|undefined} 検索結果. なければ undefined.
   */
  getServiceInfoByServiceId(serviceId) {
    if (!('service' in this.root.services)) {
      throw new Error('services データが破損しています');
    }
    if (typeof this.root.services.service !== 'object') {
      throw new Error('service データが破損しています');
    }
    if (this.root.services.service.length === 0) return undefined;
    const targetService = this.root.services.service
      .find((serv) => serv.id === serviceId);
    if (targetService === undefined) return undefined;
    return targetService;
  }

  /**
   * Service ID から配列の Index を取得.
   * 情報を挿入するときなどに使う.
   * @param {string} serviceId 検索対象の Service ID
   * @returns {number} 検索結果. なければ -1.
   */
  getServiceIndexByServiceId(serviceId) {
    if (!('service' in this.root.services)) {
      throw new Error('services データが破損しています');
    }
    if (typeof this.root.services.service !== 'object') {
      throw new Error('service データが破損しています');
    }
    if (this.root.services.service.length === 0) return -1;
    return this.root.services.service
      .findIndex((serv) => serv.id === serviceId);
  }

  /**
   * サービスブロックを作成します
   * @param {string} serviceId
   */
  createService(serviceId) {
    const idx = this.getServiceIndexByServiceId(serviceId);
    if (idx !== -1) throw new Error('サービスがすでにあります');
    this.root.services.service.push({
      id: serviceId,
    });
    this.setRootFromXMLRawData();
  }

  addServiceAccount(serviceId, account) {
    const idx = this.getServiceIndexByServiceId(serviceId);
    if (idx === -1) throw new Error('サービスが見つかりません');
    if ('account' in this.root.services.service[idx]) {
      this.root.services.service[idx].account.push(account);
    } else {
      this.root.services.service[idx].account = account;
    }
    this.setRootFromXMLRawData();
  }

  addServiceScope(serviceId, scopes) {
    const idx = this.getServiceIndexByServiceId(serviceId);
    if (idx === -1) throw new Error('サービスが見つかりません');
    if ('scope' in this.root.services.service[idx]) {
      this.root.services.service[idx].scope.push(scopes);
    } else {
      this.root.services.service[idx].scope = scopes;
    }
    this.setRootFromXMLRawData();
  }
}

export default XMLObject;
