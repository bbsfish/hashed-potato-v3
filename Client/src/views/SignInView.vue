<template>
  <div className="SignIn">
    <AppMainHeader title="SignIn"/>
    <p>Reception ID: {{ id }}</p>
    <p>Check: {{ (check) ? 'OK' : 'ERROR' }}</p>
    <LinkFieldShow :content='content' />
    よければ、ファイルを選択
    <SelectRecents />
    <DecryptButton @ondecrypted='lookupAccount' />
    <pre>
      {{ content }}
    </pre>
    <button @click="signinConfirm">サインイン</button>
  </div>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
import SelectRecents from '@/components/SelectRecents.vue';
import LinkFieldShow from '@/components/LinkFieldShow.vue';
import DecryptButton from '@/components/DecryptButton.vue';

export default {
  name: 'SignInView',
  components: {
    AppMainHeader,
    SelectRecents,
    LinkFieldShow,
    DecryptButton,
  },
  data() {
    return {
      /** 受付ID @type {string} */
      id: null,
      /** Link Request オプション @type {{redirect_uri: string, scope: string[], type: string,
       * self_request_auth_value: string, self_request_auth: string, requester_id: string}} */
      content: null,
      /** 受付ID 検証結果 @type {boolean} */
      check: false,
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
     * データストアから内容を取り出し、該当するサービスIDを検索する.
     * 複合化ボタンが押され、複合化が完了したら起動する.
     * @param {string} 受付ID
     * @returns {Promise<{redirect_uri: string, scope: string[], type: string,
       * self_request_auth_value: string, self_request_auth: string, requester_id: string}>|null}
     */
    lookupAccount(xobject) {
      const cont = this.content;
      // 無効なファイル
      if (!('services' in xobject)) {
        console.debug('無効なファイルです');
        return;
      }
      // サービス検索
      const account = xobject.services.service.find((service) => service.id === cont.requester_id);
      // サービスなし → サインアップ?
      if (!account) {
        console.debug('アカウント情報がありません');
        return;
      }
      // サービス発見 → 情報送信
      if (this.$dialog.confirm({ message: 'サインインしますか？' })) {
        console.debug('サインインします', account);
        // cont.redirect_uri
        return;
      }
      console.debug('キャンセルされました');
    },
  },
  watch: {
    content(next) {
      console.log('check', this.id, next);
      this.check = !('error' in next);
    },
  },
  async mounted() {
    this.id = this.$route.params.id;
    this.content = await this.setContent(this.id);
  },
};

</script>
