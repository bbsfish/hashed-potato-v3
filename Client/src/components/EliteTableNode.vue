<template>
  <div>
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
    <h2 @click="showChildren = !showChildren">{{open}} {{node.contents.label}}</h2>
    <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
    <EliteTableNode v-if="showChildren"
      v-for="(node, index) in node.nodes"
      :key="index"
      :node="node"
      :style="indent"
      :depth="depth + 1"
    ></EliteTableNode>
  </div>

</template>

<script>
import EliteTableNode from '@/components/EliteTableNode';

export default {
  data: () => ({
    showChildren: false,
  }),
  name: 'EliteTableNode',
  props: ['node', 'depth'],
  components: {
    EliteTableNode,
  },
  computed: {
    indent() {
      return { transform: `translate(${this.depth * 50}px)` };
    },
    open() {
      if (!this.node.nodes) {
        return '';
      }

      if (this.node.nodes && !this.showChildren) {
        return '+';
      }

      return '-';
    },
  },
};
</script>

<style scoped>
</style>
