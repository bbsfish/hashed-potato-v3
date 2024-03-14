<template>
  <main>
    <AppMainHeader title="Link"/>
    <p>{{ receptionId }}</p>
    <section>
      ログインを試行します.
      <RecentFilesWithSelectBox label='最近のファイル' />
      <SelectDeviceFileButton label='ファイルを選択' />
      <button v-if='fileHandle !== null' @click='showContentData'>ログイン試行</button>
    </section>
    <section>
      <AddDataPrompt @pullInputData='addDataIntoFile' v-if="enableInputForm"/>
    </section>
    <pre>
      {{ requestedData }}
    </pre>
  </main>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
import SelectDeviceFileButton from '@/components/SelectDeviceFileButton.vue';
import RecentFilesWithSelectBox from '@/components/RecentFilesWithSelectBox.vue';
import AddDataPrompt from '@/components/AddDataPrompt.vue';
import secrets from '@/lib/secrets-v1';
import { writeFile, verifyPermission } from '@/lib/fs-helper';
import { XMLBuilder } from '@/lib/fxbuilder.min';

const fxb = new XMLBuilder();

export default {
  name: 'LinkView',
  components: {
    AppMainHeader,
    SelectDeviceFileButton,
    RecentFilesWithSelectBox,
    AddDataPrompt,
  },
  data() {
    return {
      content: null,
      plainObject: null,
      receptionId: '',
      requestedData: null,
      enableInputForm: false,
    };
  },
  methods: {
    async fetchRequestedData() {
      try {
        const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyUVtwxdl5rHLM1TTeLsSVidti3OdsHZQVEH1D_Z7hpFNwQ_CPK_Gi0WlUC7Dki7IJQ/exec';
        const response = await fetch(`${ENDPOINT}?reception_id=${this.receptionId}`);
        const resData = await response.json();
        this.requestedData = resData;
      } catch (error) {
        console.error(error);
      }
    },
    async showContentData() {
      // 複合化
      this.content = await this.$store.getters['user/fileContent'];
      if (!this.content) { console.log('ファイルが選択されていません'); return; }
      const fileId = this.content.meta.devicefileid;
      const inputPassword = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Decrypt' });
      if (inputPassword) {
        this.plainObject = await secrets
          .importEncyptedString(this.content.data, fileId, inputPassword);
      }
      const find = this.plainObject.services
        .find((srv) => srv.id === this.requestedData.requester_id);
      if (find && this.$dialog.confirm({ message: 'ログイン情報があります. ログインしますか?' })) {
        // ログイン
        window.location.href = `${this.requestedData.redirect_uri}
          +?type=login&id=${find.accounts[0].uid}&pwd=${find.accounts[0].password}`
          .replace(/\s+/g, '');
      } else if (this.$dialog.confirm({ message: 'ログイン情報がありません. サインインしますか?' })) {
        console.log('ok');
        this.enableInputForm = true;
      }
    },
    async addDataIntoFile(uId, password) {
      const newData = {
        id: this.requestedData.requester_id,
        accounts: [{
          uid: uId, password,
        }],
      };
      this.plainObject.services.push(newData);
      // ロックする
      const pass = await this.$dialog.prompt({ message: 'Enter new PASSPHRASE for Data Encrypt' });
      const plainString = await secrets
        .exportAsEncryptedString(this.plainObject, this.content.meta.devicefileid, pass);
      this.content.data = plainString;
      if (verifyPermission(this.$store.getters['user/file'], true)) {
        await writeFile(this.$store.getters['user/file'], fxb.build(this.content));
        console.log('write contents', this.plainObject, plainString, this.content);
        this.plainObject = null;
        window.location.href = `${this.requestedData.redirect_uri}
          +?type=new&id=${newData.accounts[0].uid}&pwd=${newData.accounts[0].password}`
          .replace(/\s+/g, '');
      }
    },
  },
  mounted() {
    this.receptionId = this.$route.params.id;
    if (this.receptionId) {
      this.fetchRequestedData();
    }
  },
};
</script>
