import idbKeyval from '@/lib/idb-keyval-iife';

const TABLE = 'recentFiles';

const fhStore = {
  async fetch() {
    return await idbKeyval.get(TABLE) || [];
  },

  async push(pushedValue) {
    const values = await this.fetch();
    values.unshift(pushedValue);
    if (values.length > 10) values.pop();
    idbKeyval.set(TABLE, values);
  },

  update(objectWithFh) {
    const fhArray = objectWithFh.map((f) => f.fh);
    idbKeyval.set(TABLE, fhArray);
  },

};

export default fhStore;
