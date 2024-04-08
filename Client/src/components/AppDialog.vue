<template>
  <dialog v-if="visible === true">
    <p>{{ alertMessage }}</p>

    <button type='button' @click="alertResult">OK</button>
  </dialog>
</template>

<script>
export default {
  name: 'AppDialog',
  emits: ['alertResult'],
  data() {
    return {
      visible: false,
      alertMessage: 'hello!',
    };
  },
  methods: {
    toggleAlertVisible() {
      this.visible = !this.visible;
    },
    setAlertMessage(message) {
      this.alertMessage = message;
    },
    alertResult() {
      this.$emit('alertResult');
    },
  },
};
</script>
