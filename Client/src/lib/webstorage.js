/**
 * ローカルストレージを使ったデータベース
 * localStorage.setItem(<DatabaseName>, <JSON>)
 * <JSON> は { Key1: <JSON>, Key2: <JSON>,... } の構造
 * 上記の例の場合、webStorage.keys() では ['Key1', 'Key2', ...] が取得できる
 */

const DatabaseName = 'hashedpotato';

const logger = (message, ...args) => console
  .debug('[WS] DB Name:', DatabaseName, '=>', message, args);

const webStorage = ((dbname) => {
  let database;
  const saveDatabase = () => {
    if (database !== undefined) {
      localStorage.setItem(dbname, JSON.stringify(database));
      logger('saved', database);
    }
  };
  const getDatabase = () => {
    if (!database) database = JSON.parse(localStorage.getItem(dbname) ?? '{}');
    return database;
  };
  const get = (key, ifUndefined) => getDatabase()[key] ?? ifUndefined;
  const set = (key, value) => {
    database[key] = value;
    logger('set', key, value);
    saveDatabase();
  };
  const del = (key) => {
    delete database[key];
    saveDatabase(key);
  };
  const clear = () => {
    localStorage.removeItem(dbname);
    database = undefined;
  };
  const clearAll = () => localStorage.clear();
  const keys = () => {
    if (!database) database = JSON.parse(localStorage.getItem(dbname) ?? '{}');
    return Object.keys(database);
  };

  // 初期化
  (() => {
    if (!localStorage.getItem(dbname)) {
      console.info(`There is no database named "${dbname}"`);
      localStorage.setItem(dbname, '{}');
      console.info(`A database named "${dbname}" has been created.`);
    }
    database = getDatabase();
    logger('Initial State:\n', database);
  })();

  return {
    get, set, del, clear, clearAll, keys,
  };
})(DatabaseName);

export default webStorage;
