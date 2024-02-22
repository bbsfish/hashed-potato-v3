<template>
  <button @click="createDeviceFile">{{label}}</button>
</template>

<script>
import { getNewFileHandle } from '@/lib/fs-helper';

export default {
  name: 'CreateDeviceFileButton',
  props: ['label'],
  methods: {
    createDeviceFile() {
      // $emit に async/await は利用できない
      getNewFileHandle('My-Account-Store.txt')
        .then(fh => this.$emit('pullFileHandle', fh));
    },
  },
};
</script>
