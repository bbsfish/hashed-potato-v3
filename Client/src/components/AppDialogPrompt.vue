<template>
  <dialog id="app-dialog-prompt">
    <form method="dialog">
      <p>
        <label for="app-dialog-prompt-input">
          {{ label }}
          <input v-model="input" type="text">
        </label>
      </p>
      <div>
        <button id="cancel" type="reset" @click="onReset">{{ reset }}</button>
        <button type="submit" @click="onSubmit">{{ submit }}</button>
      </div>
    </form>
  </dialog>
</template>

<script>
export default {
  name: 'AppDialogPrompt',
  props: {
    label: {
      type: String,
    },
    reset: {
      type: String,
      default: 'Cancel',
    },
    submit: {
      type: String,
      default: 'Confirm',
    },
  },
  data() {
    return {
      input: '',
    };
  },
  methods: {
    onSubmit() {

    },
    onReset() {

    },
  },
};
</script>
