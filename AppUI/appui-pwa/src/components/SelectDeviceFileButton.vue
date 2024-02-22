<template>
  <button @click="selectDeviceFile">{{label}}</button>
</template>

<script>
import { getFileHandle } from '@/lib/fs-helper';

export default {
  name: 'SelectDeviceFileButton',
  props: ['label'],
  methods: {
    selectDeviceFile() {
      // $emit に async/await は利用できない
      getFileHandle()
        .then((fh) => this.$emit('pullFileHandle', fh))
        .catch(() => this.$emit('pullFileHandle', null));
    },
  },
};
</script>
