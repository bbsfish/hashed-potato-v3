<template>
  <main>
    <AppMainHeader title="Config"/>
    <div>
      <p>
        各種設定.
      </p>
      <ResetKeyValueButton />
    </div>
  </main>
</template>

<script>
import ResetKeyValueButton from '@/components/ResetKeyValueButton.vue';
import AppMainHeader from '@/components/AppMainHeader.vue';

export default {
  name: 'ContentView',
  components: {
    ResetKeyValueButton,
    AppMainHeader,
  },
  data() {
    return {
    };
  },
};

</script>

<style lang="scss" scoped>
  .selected-file-name-view {
    color: white;
    background-color: black;
    padding: 4px 6px;
  }
</style>
