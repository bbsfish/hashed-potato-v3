<template>
  <div class="dev">
    <AppMainHeader title="Dev"/>
    <div>
      <button @click="showDialog">ShowDialog</button>
    </div>
  </div>
  <AppDialogPrompt ref="dialog" />
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
import AppDialogPrompt from './components/AppDialogPrompt.vue';

export default {
  name: 'DevelopperView',
  components: {
    AppMainHeader, AppDialogPrompt,
  },
  data() {
    return {
    };
  },
  methods: {
    showDialog() {
      this.$dialog.prompt({ message: 'hello', comp: this.dialog });
    },
  },
};

</script>
