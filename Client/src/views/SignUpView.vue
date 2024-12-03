<template>
  <div className="SignUp">
    <AppMainHeader title="SignUp"/>
    <p>Reception ID: {{ id }}</p>
    <p>Check: {{ (check) ? 'OK' : 'ERROR' }}</p>
    <LinkFieldShow :fields='req' :key="req" />
    よければ、ファイルを選択
    <SelectRecents @onselected="isFileSelected = true" />
    <DecryptFileButton v-if="isFileSelected" @ondecrypted='getService' />
    <h3>リクエスト内容</h3>
    <pre>
      {{ req }}
    </pre>
    <h3>作成するアカウント</h3>
    <pre>
      {{ newAccount }}
    </pre>
    <h3>送信する情報</h3>
      {{ postData }}
    <button @click="recordeNewData">この内容でアカウントを作成する</button>
  </div>
</template>

<script>
import vs from 'value-schema';
import AppMainHeader from '@/components/AppMainHeader.vue';
import SelectRecents from '@/components/SelectRecents.vue';
import LinkFieldShow from '@/components/LinkFieldShow.vue';
import DecryptFileButton from '@/components/DecryptFileButton.vue';
import signupvs from '@/formats/signup.vschema.js';
import genPassword from '@/lib/random.js';
import HttpPoster from '@/lib/http-poster.js';

export default {
  name: 'SignUpView',
  components: {
    AppMainHeader,
    SelectRecents,
    LinkFieldShow,
    DecryptFileButton,
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
      /** @type {{ id: string, password: string }|null} 作成した認証情報 */
      newAccount: null,
      /** @type {object|null} 送信情報 */
      postData: {
        identity: null,
        credential: null,
      },
      /**
       * XML Object の root 以下
       * @type {{
       *  services: { service: object<ServiceElement>[] },
       *  youare: object<PersonalInfosElement>[]
       * }}
       */
      xoRoot: null,
      // ファイルが選択されているか
      isFileSelected: false,
    };
  },
  methods: {
    /**
     * ファイルの複合化が終わったら呼ばれる.
     * state.editor から xmlobject に XML コンテンツを移動
     * Resuester ID から Service を取得する
     */
    async getService(editorState) {
      const rqID = this.req.ID;

      if (!this.$store.getters['datastore/isEmptyData']) {
        const { xobject } = editorState;
        // Data ありのとき: アカウントの所持を確認
        console.log('xobject', xobject);
        this.$store.commit('xmlobject/putXmlObject', xobject);
        const service = this.$store.getters['xmlobject/getServiceById'](rqID);
        console.log('service', service);
        if (service) {
          // アカウントあり
          const consent = await this.$dialog.confirm({
            message: 'アカウントをすでに持っているようです. サインインするために、元のウェブサービスに戻りますか?',
          });
          if (consent) {
            const poster = new HttpPoster(this.req.RedirectURI);
            poster.postWithJSON(HttpPoster.RESULT.CANCELED);
            window.location.href = this.req.RedirectURI;
            return;
          }
          this.$log.info('キャンセルされました');
        } else {
          this.onNewService();
        }
      } else {
        // Data なしのとき: xmlobject store を初期化
        this.$store.commit('xmlobject/initXmlObject');
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
      this.$store.commit('datastore/isModified');
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
      const poster = new HttpPoster(this.req.RedirectURI);
      poster.postWithJSON(HttpPoster.RESULT.AGREED, {
        credential: createdAccount,
        info: this.personalInfo,
      });
      window.location.href = this.req.RedirectURI;
    },
  },
  watch: {
    async req(next) {
      this.$log.debug('Requestオプション(req) アップデート', next);
      try {
        if ('error' in next) throw next.error;
        vs.applySchemaObject(signupvs, next);
        this.check = true;
      } catch (err) {
        this.$log.info(err);
        this.check = false;
      }
    },
  },
  async mounted() {
    const logger = this.$log;
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
        const startTime = performance.now();
        console.log('Fetching from %s', `https://hashed-potato.mydns.jp/data/${id}`);
        const response = await fetch(`https://hashed-potato.mydns.jp/data/${id}`);
        const endTime = performance.now();
        console.log('エージェントサーバからの応答時間: %s ミリ秒', endTime - startTime);
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

    this.$store.watch(
      (state, getters) => getters['datastore/fileState'],
      ({ handle }) => {
        if (handle) this.isFileSelected = true;
      },
    );
  },
};

</script>
