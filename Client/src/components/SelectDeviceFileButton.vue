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
      getFileHandle()
        .then((fh) => {
          this.$store.commit('files/add', fh);
          this.$store.commit('user/file', fh);
        })
        // .then((fh) => {
        //   this.$store.commit('user/file', fh);
        //   this.$store.commit('files/pushFileList', fh);
        // })
        .catch(() => {});
    },
  },
};
</script>
