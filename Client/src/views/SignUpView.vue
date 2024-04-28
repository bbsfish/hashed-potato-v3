<template>
  <div className="SignUp">
    <AppMainHeader title="SignUp"/>
    <p>Reception ID: {{ id }}</p>
    <p>Check: {{ (check) ? 'OK' : 'ERROR' }}</p>
    <LinkFieldShow :content='content' />
    よければ、ファイルを選択
    <SelectRecents />
    <DecryptButton @ondecrypted='lookupAccount' />
    <pre>
      {{ content }}
    </pre>
    <pre>
      {{ newAccount }}
    </pre>
    <button @click="doRedirect">この内容でアカウントを作成する</button>
  </div>
</template>

<script>
import vs from 'value-schema';
import AppMainHeader from '@/components/AppMainHeader.vue';
import SelectRecents from '@/components/SelectRecents.vue';
import LinkFieldShow from '@/components/LinkFieldShow.vue';
import DecryptButton from '@/components/DecryptButton.vue';
import signupvs from '@/formats/signup.vschema.js';
import genPassword from '@/lib/random.js';

export default {
  name: 'SignUpView',
  components: {
    AppMainHeader,
    SelectRecents,
    LinkFieldShow,
    DecryptButton,
  },
  data() {
    return {
      /** @type {string} 受付ID */
      id: null,
      /** @type {{redirect_uri: string, scope: string[], type: string,
       * self_request_auth_value: string, self_request_auth: string, requester_id: string}}
       * Link Request オプション */
      content: null,
      /** @type {boolean} ID 検証結果 */
      check: false,
      /** @type {{id: string, password: string}} 新しいアカウント */
      newAccount: null,
    };
  },
  methods: {
    /**
     * エージェントから Link Request を取得する
     * @param {string} 受付ID
     * @returns {Promise<{redirect_uri: string, scope: string[], type: string,
       * self_request_auth_value: string, self_request_auth: string, requester_id: string}>|null}
     */
    async setContent(id) {
      try {
        const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyUVtwxdl5rHLM1TTeLsSVidti3OdsHZQVEH1D_Z7hpFNwQ_CPK_Gi0WlUC7Dki7IJQ/exec';
        const response = await fetch(`${ENDPOINT}?reception_id=${id}`);
        const resData = await response.json();
        return resData;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    /**
     * データストアから該当のサービスを探し、
     * あればサインイン、なければアカウント作成の処理に進む
     */
    lookupAccount(xobject) {
      const cont = this.content;
      if (!('services' in xobject)) {
        console.debug('無効なファイルです');
        return;
      }
      const index = xobject.services.service
        .map((srv) => srv.id).indexOf(cont.requester_id);
      if (index === -1) {
        // アカウント作成
        this.createAccount();
      } else if (this.$dialog.confirm({ message: 'アカウントがあります。サインインしますか？' })) {
        // アカウント存在
        const account = xobject.services.service[index];
        console.debug('サインインします', account);
      }
      console.debug('キャンセルされました');
    },
    /**
     * アカウント情報を作成し、newAccount に保存する
     */
    createAccount() {
      this.newAccount = {
        id: 'hogehoge',
        password: genPassword(),
      };
    },
    async doRedirect() {
      const cont = this.content;
      const { xobject } = this.$store.getters['datastore/editorState'];
      console.log('xobject', xobject);
      xobject.services.service.push({
        id: cont.requester_id,
        scope: cont.scope,
      });
      this.$store.commit('datastore/putEditor', { xobject });
      this.$store.commit('datastore/modified');
      const password = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Encrypt' });
      await this.$store.dispatch('datastore/encryptContent', { password });
      if (this.$dialog.confirm({ message: 'サインインしますか？' })) {
        window.location.href = cont.redirect_uri;
        return;
      }
      console.debug('キャンセルされました');
    },
  },
  watch: {
    async content(next) {
      try {
        if ('error' in next) throw next.error;
        await vs.applySchemaObject(signupvs, next);
        this.check = true;
      } catch (err) {
        console.log(err);
        this.check = false;
      }
    },
    async newAccount(next) {
      console.log('newAccount next', next);
      return next;
    },
  },
  async mounted() {
    this.id = this.$route.params.id;
    this.content = await this.setContent(this.id);
  },
};

</script>
