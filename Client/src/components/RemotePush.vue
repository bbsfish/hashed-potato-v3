<template>
  <div class="remote-push">
    <button type="button" @click="onClick">{{ innerText }}</button>
  </div>
</template>

<script>
import CONSTS from '@/CONSTS.js';

export default {
  name: 'RemotePush',
  components: {},
  props: {
    innerText: {
      type: String,
      default: 'Temporarily save your datastore to Remote',
    },
  },
  data() {
    return {
    };
  },
  methods: {
    async onClick() {
      if (this.$store.getters['datastore/isModified']) {
        this.$dialog.alert({ message: 'ファイルが編集中です' });
        return;
      }
      const {
        handle, id,
      } = this.$store.getters['datastore/fileState'];
      if (!handle) {
        this.$dialog.alert({ message: 'ファイルを選択してください.' });
        return;
      }
      const content = this.$store.getters['datastore/fileContentAsXML'];
      const { iv, salt } = (await this.$store.dispatch('datastore/fetch')).getKeySet(id);
      const response = await this.doPost({
        devicefileid: id, content, iv, salt,
      });
      if ('error' in response) {
        this.$dialog.alert({ message: 'ファイルの同期に失敗しました.' });
        return;
      }
      this.$dialog.alert({ message: `ファイルがサーバに保存されました. 10分以内にファイルをインポートしてください. その時には以下の DeviceFileID が必要になります, \nDeviceFileID: ${id}` });
      this.$log.debug('response', response);
    },
    async doPost({
      devicefileid, content, iv, salt,
    }) {
      const formData = new FormData();
      formData.append('devicefileid', devicefileid);
      formData.append('content', content);
      formData.append('key_iv', iv);
      formData.append('key_salt', salt);
      this.$log.debug('Remote API - POST:', formData);
      const response = await fetch(CONSTS.REMOTE_API, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>

div {
  display: inline-block;
}

</style>
