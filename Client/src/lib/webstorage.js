const DatabaseName = 'hashedpotato';

const logger = (message, ...args) => console
  .debug('[database] @', DatabaseName, '=>', message, args);

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
    logger('Initial', database);
  })();

  return {
    get, set, del, clear, clearAll, keys,
  };
})(DatabaseName);

export default webStorage;
