<template>
    <button class="select-file" @click="doSelect">{{ label }}</button>
</template>

<script>
export default {
  name: 'SelectFileButton',
  props: {
    label: {
      type: String,
      default: 'ファイルを選択',
    },
  },
  methods: {
    async doSelect() {
      try {
        await this.$store.dispatch('datastore/selectFile');
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
