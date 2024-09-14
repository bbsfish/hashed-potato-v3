<template>
  <div class="remote-fetch">
    <button type="button" @click="onClick">{{ innerText }}</button>
  </div>
</template>

<script>
import CONSTS from '@/CONSTS.js';
import { getNewFileHandle, writeFile } from '@/lib/fs-helper.js';
import { base64ToArrayBuffer } from '@/lib/string_to_buffer';

export default {
  name: 'RemoteFetch',
  props: {
    innerText: {
      type: String,
      default: 'Fetch your datastore from Remote',
    },
  },
  methods: {
    async onClick() {
      const devId = await this.$dialog.prompt({ message: 'Device File ID を入力', forceNull: true });
      if (devId === null) {
        return;
      }
      const response = await this.doGet(devId);
      if ('error' in response) {
        this.$dialog.alert({ message: response.error });
        return;
      }
      await this.downloadFile(response);
      this.$dialog.alert({ message: 'インポートが完了しました.' });
    },
    async doGet(devicefileid) {
      const url = `${CONSTS.REMOTE_API}?devicefileid=${devicefileid}`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    },
    async downloadFile({
      // eslint-disable-next-line camelcase
      key_iv, key_salt, content, devicefileid,
    }) {
      // const blob = new Blob([content], { type: 'text/xml' });
      // document.getElementById('download').href = window.URL.createObjectURL(blob);
      const handle = await getNewFileHandle('AccountStore_by_hashed-potato.xml');
      await writeFile(handle, content);
      await this.$store.dispatch('datastore/putFileKey', {
        id: devicefileid,
        iv: base64ToArrayBuffer(key_iv),
        salt: base64ToArrayBuffer(key_salt),
      });
      await this.$store.dispatch('datastore/plugFile', { handle });
    },
  },
};
</script>

<style lang="scss" scoped>

div {
  display: inline-block;
}

</style>
