<template>
  <button @click="reset">Reset KeyValue</button>
</template>

<script>
import idbKeyval from '@/lib/idb-keyval-iife';

export default {
  name: 'ResetKeyValueButton',
  methods: {
    reset() {
      idbKeyval.clear();
    },
  },
};
</script>
