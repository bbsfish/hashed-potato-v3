<template>
<div class="app-main-header">
  <h2>
    {{ title }}
  </h2>
  <p v-if="description !== ''">{{ description }}</p>
  <hr class="hr-1" />
</div>
</template>

<script>
export default {
  name: 'AppMainHeader',
  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
  h2 {
    padding-top: 8px;
    margin: 0;
  }
  // hr {
  //   border: none; /* ボーダーをなしにする */
  //   height: 1px; /* 高さを2pxに設定 */
  //   background-color: #333; /* 背景色を指定 */
  // }
</style>
