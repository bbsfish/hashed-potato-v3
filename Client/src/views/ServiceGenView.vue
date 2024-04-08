<template>
  <main>
    <h1>Service Generator</h1>
    <button type='button'
      @click='test'
      >実行</button>
    <div>
      <label for='req_requester_id'>
        Requester ID (Client ID)
        <input
          v-model='reqId'
          name='req_requester_id'
          type='text'
          value='{{reqId}}'
          >
      </label>
      <button
        type='button'
        @click='generateRequesterId'
        >生成</button>
    </div>

    <div>
      <label for='req_scope'>
        Scope: {{reqScope}}
        <select
          v-model='reqScope'
          name='req_scope'
          multiple
          >
          <option value='fullname'>fullname</option>
          <option value='nickname'>nickname</option>
          <option value='email'>email</option>
        </select>
      </label>
    </div>
    <div>
      <button
        type='button'
        @click='submitService'
        >サーバーに送信</button>
    </div>
  </main>
</template>

<script>
import generateRandomId from '@/lib/generate-random-id';

export default {
  name: 'ServiceGenView',
  props: ['mode'],
  data() {
    return {
      reqId: '',
      reqScope: [],
    };
  },
  methods: {
    generateRequesterId() {
      this.reqId = generateRandomId();
    },
    async submitService() {
      const requestBody = {
        type: 'login_bridge',
        redirect_uri: '/sg/redirect',
        requester_id: this.reqId,
        scope: this.reqScope,
        self_request_auth: 'temp_token',
        self_request_auth_value: '123456',
      };

      if (requestBody.requester_id === '') {
        this.$dialog.alert({ message: 'Requester ID (Client ID) が設定されていません' });
        return;
      }

      console.log(requestBody);

      const confirmMessage = `次の内容を送信します. よろしいですか？\n${JSON.stringify(requestBody)}`;
      if (!this.$dialog.confirm({ message: confirmMessage })) return;
      const receptionId = await (async () => {
        try {
          const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyUVtwxdl5rHLM1TTeLsSVidti3OdsHZQVEH1D_Z7hpFNwQ_CPK_Gi0WlUC7Dki7IJQ/exec';
          // const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyUVtwxdl5rHLM1TTeLsSVidti3OdsHZQVEH1D_Z7hpFNwQ_CPK_Gi0WlUC7Dki7IJQ/exec';
          const body = new FormData();
          const keys = Object.keys(requestBody);
          keys.forEach((key) => {
            body.append(key, requestBody[key]);
          });
          const response = await fetch(ENDPOINT, {
            method: 'POST',
            body,
          });
          const resdata = await response.json();
          console.log('resdata', resdata);
          return resdata.reception_id;
        } catch (error) {
          console.error(error);
          return null;
        }
      })();
      if (receptionId) {
        this.$router.push(`/link/${receptionId}`);
      }
    },
    async test() {
      (await this.$dialog.alert({ message: 'ok?' }));
    },
  },
};
</script>
