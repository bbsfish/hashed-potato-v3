<template>
  <div className="content-editor">
    <AppMainHeader title="Content Editor"/>
    <p>
      ファイル内容の参照および編集ができます.
    </p>
    <div>
      <SelectRecents />
      <button @click="doCheckUp">Check Up</button>
      <button @click="doDecrypt">複合化</button>
    </div>
    <div>
      <XMLEditor :xmlstring="xmlString" :key="editorKey" />
    </div>
  </div>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
import XMLEditor from '@/components/XMLEditor.vue';
import SelectRecents from '@/components/SelectRecents.vue';
import webStorage from '@/lib/webstorage';
import { keys as keysIDB, get as getIDB } from 'idb-keyval';

export default {
  name: 'ContentEditorView',
  components: {
    AppMainHeader, SelectRecents, XMLEditor,
  },
  data() {
    return {
      xmlString: '',
      editorKey: 0,
    };
  },
  methods: {
    async doCheckUp() {
      this.$log.info('WebStorage Keys:', webStorage.keys());
      webStorage.keys().forEach((key) => {
        this.$log.info('WebStorage [', key, ']', webStorage.get(key));
      });
      this.$log.info('FileState', this.$store.getters['datastore/fileState']);
      this.$log.info('keysIDB', await keysIDB());
      Promise.all(
        (await keysIDB()).map(async (key) => {
          this.$log.info('WebStorage [', key, ']', await getIDB(key));
        }),
      );
    },
    async doDecrypt() {
      const { handle } = this.$store.getters['datastore/fileState'];
      if (!handle) return;
      const password = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Decrypt' });
      try {
        const { xtext, xobject } = await this.$store.dispatch('datastore/decryptContent', { password });
        this.$log.debug('decResult', { xtext, xobject });
        this.xmlString = xtext;
      } catch (error) {
        this.$log.info('decResult', error);
      }
    },
  },
  watch: {
    xmlString() {
      this.editorKey += 1;
    },
  },
  async mounted() {
    this.$store.watch(
      (state, getters) => getters['datastore/fileState'],
      ({ handle }) => {
        if (handle) {
          this.currentFileName = handle.name;
        }
      },
    );
  },
};

</script>

<style lang="scss" scoped>
  button {
    font-size: 1rem;
    width: 200px;
    padding: .2rem 1rem;
    &:hover {
      box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
    }
  }
</style>
