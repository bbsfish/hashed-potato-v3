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
    <h3>送信情報</h3>
    <pre>
      {{ localServiceInfo }}
    </pre>
    <pre>
      {{ personalInfo }}
    </pre>
    <button @click="sendData">サインイン</button>
  </div>
</template>

<script>
import vs from 'value-schema';
import AppMainHeader from '@/components/AppMainHeader.vue';
import SelectRecents from '@/components/SelectRecents.vue';
import LinkFieldShow from '@/components/LinkFieldShow.vue';
import DecryptFileButton from '@/components/DecryptFileButton.vue';
import HttpPoster from '@/lib/http-poster.js';
import signupvs from '@/formats/signup.vschema.js';

export default {
  name: 'SignInView',
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
      /** @type {{RedirectURI: string, Scope: string[], Type: string, ID: string}}
       * Link Request オプション */
      req: null,
      /** @type {boolean} ID 検証結果 */
      check: false,
      /** @type {object|null} Store 内の該当サービスデータ */
      localServiceInfo: null,
      /** @type {object|null} 送信情報 */
      postData: {
        identity: null,
        credential: null,
      },
      personalInfo: null,
      isFileSelected: false,
    };
  },
  methods: {
    /**
     * ファイルの複合化が終わったら呼ばれる.
     * state.editor から xmlobject に XML コンテンツを移動
     * Resuester ID から Service を取得する
     */
    async getService() {
      const rqID = this.req.ID;

      if (!this.$store.getters['datastore/isEmptyData']) {
        // Data ありのとき: アカウントの所持を確認
        const { xobject } = this.$store.getters['datastore/editorState'];
        this.$store.commit('xmlobject/putXmlObject', xobject);
        const service = this.$store.getters['xmlobject/getServiceById'](rqID);
        if (service) {
          // アカウント発見
          this.localServiceInfo = service;
          this.postData.credential = service.credential;
          if (!service.scope || service.scope.includes('none')) {
            delete this.postData.identity;
          } else {
            this.postData.identity = service.scope
              .map((key) => this.$store.getters['xmlobject/getPersonalInfoByKey'](key));
          }
          return;
        }
      }
      // Data なし || アカウント未発見
      this.onNoService();
    },
    /**
     * サービスが見つからなかったとき、CANCEL を POST
     */
    onNoService() {
      const consent = this.$dialog.confirm({
        message: 'アカウントが見つかりません. サインアップするために、元のウェブサービスに戻りますか?',
      });
      if (consent) {
        const poster = new HttpPoster(this.req.RedirectURI);
        poster.postWithJSON(HttpPoster.RESULT.CANCELED);
        window.location.href = this.req.RedirectURI;
        return;
      }
      this.$log.info('キャンセルされました');
    },
    async sendData() {
      const consent = await this.$dialog.confirm({
        message: '送信します. よろしいですか?',
      });
      if (consent) {
        const poster = new HttpPoster(this.req.RedirectURI);
        poster.postWithJSON(HttpPoster.RESULT.AGREED, this.postData);
        window.location.href = this.req.RedirectURI;
        return;
      }
      this.$log.info('キャンセルされました');
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
        const response = await fetch(`http://localhost:3000/data/${id}`);
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
