class KeyValueStore {
  constructor(dbName = 'keyvaluedb') {
    this.dbName = dbName;
  }

  getDatabase() {
    const json = localStorage.getItem(this.dbName);
    console.log('json', json);
    if (!json) {
      console.info(`There is no database named "${this.dbName}"`);
      console.info(`A database named "${this.dbName}" has been created.`);
      localStorage.setItem(this.dbName, '');
      return {};
    }
    return JSON.parse(json);
  }

  refresh(payload) {
    localStorage.setItem(this.dbName, JSON.stringify(payload));
  }

  get(key, whenUndefined = undefined) {
    return this.getDatabase()[key] ?? whenUndefined;
  }

  set(key, value) {
    const data = this.getDatabase();
    data[key] = value;
    this.refresh(data);
  }

  del(key) {
    const data = this.getDatabase();
    if (key in data) delete data[key];
    this.refresh(data);
  }

  clear() {
    localStorage.removeItem(this.dbName);
  }

  keys() {
    const data = this.getDatabase(this.dbName);
    return Object.keys(data);
  }
}

export default KeyValueStore;
