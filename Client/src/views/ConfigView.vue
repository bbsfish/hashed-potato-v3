<template>
  <div className="config">
    <AppMainHeader title="Config"/>
    <div>
      <p>
        各種設定.
      </p>
      <button @click="clearIndexDB">Clear IndexedDB</button>
      <button @click="clearLocalStorage">Clear Local Storage</button>
      <button @click="doSelectFile">Select File</button>
      <button @click="doCreateFile">Create File</button>
      <button @click="doInitFile">Init File</button>
      <button @click="doGetContent">Get Content</button>
      <button @click="doEncryptContent">Encrypt Content</button>
      <button @click="doDecryptContent">Decrypt Content</button>
      <button @click="doPutContentMan">Put Content Manually</button>
      <button @click="doCommitFile">Commit File</button>
      <button @click="doCheckUp">Check Up</button>
    </div>
  </div>
</template>

<script>
import { clear } from 'idb-keyval';
import AppMainHeader from '@/components/AppMainHeader.vue';
import webStorage from '@/lib/webstorage';

export default {
  name: 'ContentView',
  components: {
    AppMainHeader,
  },
  methods: {
    async doSelectFile() {
      try {
        const result = await this.$store.dispatch('datastore/selectFile');
        this.$log.info('doSelectFile', result);
      } catch (error) {
        this.$log.info(error);
      }
    },
    async doCreateFile() {
      try {
        const result = await this.$store.dispatch('datastore/createFile');
        this.$log.info('doCreateFile', result);
      } catch (error) {
        this.$log.info(error);
      }
    },
    async doInitFile() {
      try {
        const result = await this.$store.dispatch('datastore/initializeFile');
        this.$log.info('doInitFile', result);
      } catch (error) {
        this.$log.info(error);
      }
    },
    async doGetContent() {
      try {
        const result = await this.$store.dispatch('datastore/getFileContent');
        this.$log.info('doGetContent', result);
      } catch (error) {
        this.$log.info(error);
      }
    },
    async doEncryptContent() {
      try {
        const content = await this.$store.dispatch('datastore/getFileContent');
        if (typeof content.data === 'string' && content.data === '') throw new Error('No data');
        const passwd = await this.$dialog.prompt({ message: 'Input pass for ENcrypt' });
        const result = await this.$store.dispatch('datastore/encryptContent', passwd);
        this.$log.info('doEncryptContent', result);
      } catch (error) {
        this.$log.info(error);
      }
    },
    async doDecryptContent() {
      try {
        const content = await this.$store.dispatch('datastore/getFileContent');
        if (typeof content.data === 'string' && content.data === '') throw new Error('No data');
        const passwd = await this.$dialog.prompt({ message: 'Input pass for DEcrypt' });
        const result = await this.$store.dispatch('datastore/decryptContent', passwd);
        this.$log.info('Decrypt Success!!, doDecryptContent:', result);
      } catch (error) {
        this.$log.info(error);
      }
    },
    async doPutContentMan() {
      try {
        const fileContent = await this.$store.dispatch('datastore/getFileContent');
        let privateData;
        if (fileContent.data !== '') {
          const passwd = await this.$dialog.prompt({ message: 'Input pass for DEcrypt' });
          privateData = await this.$store.dispatch('datastore/decryptContent', passwd);
        } else {
          privateData = {
            services: [],
          };
        }
        const servId = await this.$dialog.prompt({ message: 'Input Service ID' });
        const key = await this.$dialog.prompt({ message: 'Input Key' });
        const value = await this.$dialog.prompt({ message: 'Input Value' });
        const consent = await this.$dialog.confirm({ message: `[SID] "${servId}"\n[Key] "${key}"\n[Value] ${value}\nOK?` });
        if (consent) {
          const idx = privateData.services.indexOf(servId);
          if (idx === -1) privateData.services.push({ [key]: value });
          else privateData.services[idx][key] = value;
          const result = await this.$store.dispatch('datastore/putPrivateData', privateData);
          this.$log.info('doPutContentMan', result);
        } else {
          this.$log.info('PutContent is canceled');
        }
      } catch (error) {
        this.$log.info(error);
      }
    },
    async doCommitFile() {
      try {
        if (await this.$dialog.confirm({ message: 'Commit OK?' })) {
          const result = await this.$store.dispatch('datastore/commitFile');
          this.$log.info(result);
        } else {
          this.$log.info('CommitFile is canceled');
        }
      } catch (error) {
        this.$log.info(error);
      }
    },
    doCheckUp() {
      webStorage.keys().forEach((key) => this.$log.info(`WebStorage[${key}]`, webStorage.get(key)));
      this.$log.info('State', 'file', this.$store.getters['datastore/fileState']);
      this.$log.info('State', 'Key', this.$store.getters['datastore/fileKey']);
      this.$store.commit('datastore/_pullFileIds');
      this.$log.info('State', 'fileIds', this.$store.getters['datastore/fileIds']);
      this.$store.commit('datastore/_pullRecentFiles');
      this.$log.info('State', 'recentFiles', this.$store.getters['datastore/recentFiles']);
    },
    async clearIndexDB() {
      clear();
      this.$log.info('IndexedDB is cleared');
    },
    async clearLocalStorage() {
      await webStorage.clear();
      this.$log.info('LocalStorage is cleared');
    },
  },
};

</script>

<style lang="scss" scoped>
  .selected-file-name-view {
    color: white;
    background-color: black;
    padding: 4px 6px;
  }
</style>
