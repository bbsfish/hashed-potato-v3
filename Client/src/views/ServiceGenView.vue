<template>
  <div className="servicegen">
    <AppMainHeader title="Service Generator" />
    <div>
      <label for='req_requester_id'>
        Requester ID (Service ID)
        <input type='text' name='req_requester_id' id="req_requester_id"
          value='{{reqId}}' v-model='reqId' />
      </label>
      <button type='button' @click='generateRequesterId'>生成</button>
    </div>

    <div>
      Scope:
      <label for='req_scope'>
        <select name='req_scope' id="req_scope" multiple
          v-model='reqScope'>
          <option value='fullname'>fullname</option>
          <option value='nickname'>nickname</option>
          <option value='email'>email</option>
        </select>
      </label>
      {{reqScope}}
    </div>
    <div>
      <button type='button' @click='submitService'>サーバーに送信</button>
    </div>
  </div>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
import generateRandomId from '@/lib/generate-random-id';

export default {
  name: 'ServiceGenView',
  props: ['mode'],
  components: {
    AppMainHeader,
  },
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
        type: 'signup',
        redirect_uri: 'http://localhost:8080/sg/redirect',
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

      const confirmMessage = `次の内容を送信します. よろしいですか?\n${JSON.stringify(requestBody)}`;
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
        this.$router.push(`/signup/${receptionId}`);
      }
    },
    async test() {
      (await this.$dialog.alert({ message: 'ok?' }));
    },
  },
};
</script>
