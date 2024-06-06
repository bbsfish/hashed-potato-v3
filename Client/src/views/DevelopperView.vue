<template>
  <div class="dev">
    <AppMainHeader title="Dev"/>
    <div>
      <button @click="showDialog">ShowDialog</button>
    </div>
  </div>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';

export default {
  name: 'DevelopperView',
  components: {
    AppMainHeader,
  },
  data() {
    return {
      dialogVisibility: false,
    };
  },
  methods: {
    async showDialog() {
      console.log(await this.$dialog.prompt({ message: 'OK', forceNull: true }));
    },
  },
};

</script>
