<template>
  <main>
    <h1>Hello World</h1>
    <p>{{ receptionId }}</p>
  </main>
</template>

<script>
export default {
  name: 'LinkView',
  data() {
    return {
      receptionId: '',
      requestedData: null,
    };
  },
  methods: {
    async fetchRequestedData() {
      try {
        const response = await fetch(`http://localhost:8000/agent/link/fetch/${this.receptionId}`);
        const resData = await response.json();
        this.requestedData = resData;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.receptionId = this.$route.params.id;
    if (this.receptionId) {
      this.fetchRequestedData();
    }
  },
};
</script>
