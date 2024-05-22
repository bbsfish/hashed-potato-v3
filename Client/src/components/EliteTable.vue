<template>
  <div class="elite-table">
    <EliteTableNode v-if="show" :node="tree" :depth="1" />
  </div>
</template>

<script>
import EliteTableNode from '@/components/EliteTableNode.vue';

export default {
  props: {
    tree: {
      type: Object,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  components: { EliteTableNode },
};
</script>

<style lang="scss" scoped>
</style>
