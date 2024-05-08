<template>
  <div className="SignUp">
    <AppMainHeader title="SignUp"/>
    <p>Reception ID: {{ id }}</p>
    <p>Check: {{ (check) ? 'OK' : 'ERROR' }}</p>
    <LinkFieldShow :fields='req' :key="req" />
    よければ、ファイルを選択
    <SelectRecents />
    <DecryptButton @onDecrypted='getService' />
    <pre>
      {{ req }}
    </pre>
    <pre>
      {{ newAccount }}
    </pre>
    <button @click="recordeNewData">この内容でアカウントを作成する</button>
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
import poster from '@/lib/http-poster.js';

// エージェント URL
const ENDPOINT = 'https://script.google.com/macros/s/'
  + 'AKfycbyUVtwxdl5rHLM1TTeLsSVidti3OdsHZQVEH1D_Z7hpFNwQ_CPK_Gi0WlUC7Dki7IJQ/exec';

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
       * self_request_auth_value: string, self_request_auth: string,
       * requester_id: string}}
       * Link Request オプション */
      req: null,
      /** @type {boolean} ID 検証結果 */
      check: false,
      /** @type {{id: string, password: string}} 新しいアカウント */
      newAccount: null,
    };
  },
  methods: {
    /**
     * ファイルの複合化が終わったら呼ばれる.
     * state.editor から xmlobject に XML コンテンツを移動
     * Resuester ID から Service を取得する
     */
    getService() {
      const id = this.req.ID; // Resuester ID
      const { xobject } = this.$store.getters['datastore/editorState'];
      this.$store.commit('xmlobject/putXmlObject', xobject);
      const service = this.$store.getters['xmlobject/getServiceById'](id);
      if (!service) {
        // 新規サービス
        this.onNewService();
      } else if (this.$dialog.confirm({
        message: 'アカウントをすでに持っているようです. サインインするために、元のウェブサービスに戻りますか?',
      })) {
        poster.signup.cancel(this.req.RedirectURI);
      } else {
        this.$log.debug('キャンセル');
      }
    },
    /**
     * getService でアカウント情報がないとき、新規サービスを登録する
     */
    onNewService() {
      const id = this.req.ID; // Resuester ID
      this.$store.dispatch('xmlobject/addService', { id });
      this.createAccount();
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
    /**
     * サインアップ情報を datastore/editorState におく
     */
    async recordeNewData() {
      const createdAccount = this.newAccount;
      if (!createdAccount) return;
      this.$store.dispatch('xmlobject/addCredential', {
        id: this.req.ID, credential: createdAccount,
      });
      const xmlObject = this.$store.getters['xmlobject/xmlObject'];
      this.$store.commit('datastore/putEditor', {
        xobject: xmlObject,
      });
      this.$store.commit('datastore/modified');
      const password = await this.$dialog
        .prompt({ message: 'Enter PASSPHRASE for Data Encrypt' });
      await this.$store.dispatch('datastore/encryptContent', { password });
      if (await this.$dialog.confirm({ message: 'リダイレクトします' })) {
        this.doRedirect();
      } else {
        this.$log.info('キャンセルされました');
      }
    },
    async doRedirect() {
      const createdAccount = this.newAccount;
      poster.signup.send(this.req.RedirectURI, createdAccount);
    },
  },
  watch: {
    async req(next) {
      this.$log.debug('Requestオプション(req) アップデート', next);
      try {
        if ('error' in next) throw next.error;
        await vs.applySchemaObject(signupvs, next);
        this.check = true;
      } catch (err) {
        this.$log.info(err);
        this.check = false;
      }
    },
  },
  async mounted() {
    const logger = this.$log;
    logger.info('Endpoint', ENDPOINT);
    // 受付 ID 入力
    this.id = this.$route.params.id;
    /**
     * エージェントから Link Request を取得する
     * @param {string} 受付ID
     * @returns {{
      * RedirectURI: string, Scope: string[], Type: string,
      * ID: string
     * }|null}
     */
    this.req = await (async (id) => {
      try {
        const response = await fetch(`${ENDPOINT}?reception_id=${id}`);
        /**
         * @type {{
          * redirect_uri: string, scope: string[], type: string,
          * self_request_auth_value: string, self_request_auth: string,
          * requester_id: string
         * }}
         */
        const data = await response.json();
        logger.debug('リクエストデータ', data);
        return {
          RedirectURI: data.redirect_uri,
          Scope: data.scope,
          Type: data.type,
          ID: data.requester_id,
        };
      } catch (error) {
        logger.info(error);
        return null;
      }
    })(this.id);
  },
};

</script>
