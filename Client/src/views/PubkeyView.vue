<template>
  <div className="pubkey">
    <AppMainHeader title="Start"/>
    <div className="pubkey__form">
      <label for="sid">
        Service ID
        <input type="text" name="sid" id="sid"
          v-model="sid">
      </label>
      <label for="pub">
        Public Key
        <input type="text" name="pub" id="pub"
          v-model="pub">
      </label>
      <button type="submit" @click="sendPubkey">送信</button>
    </div>
  </div>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';

export default {
  name: 'StartView',
  components: {
    AppMainHeader,
  },
  data() {
    return {
      sid: null,
      pub: null,
    };
  },
  methods: {
    sendPubkey() {
      if (!this.sid || !this.pub) return;
      if (this.$dialog.confirm({ message: '登録しますか?' })) {
        this.$log.log('ok');
      }
      this.$log.log('end sendPubkey');
    },
  },
};

</script>

<style lang="scss" scoped>
</style>
