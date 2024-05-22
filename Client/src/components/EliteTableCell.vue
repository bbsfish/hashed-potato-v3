<template>
  <label class="elite-table-cell" for="elite-table-cell-item">
    <input id="elite-table-cell-item"
      v-model="inputElement"
      :type="type" :placeholder="placeholder" />
  </label>
</template>

<script>
export default {
  name: 'EliteTableCell',
  emits: ['onchange'],
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  data() {
    return {
      inputElement: this.value,
    };
  },
  methods: {},
  watch: {
    inputElement(next, prev) {
      this.$emit('onchange', { value: next, prev });
    },
  },
};

</script>

<style lang="scss" scoped>
</style>
