<template>
  <button @click="getContentData">{{ label }}</button>
</template>

<script>
import { verifyPermission, readFile } from '@/lib/fs-helper';

export default {
  name: 'SelectDeviceFileButton',
  props: ['label'],
  emits: ['onGet'],
  methods: {
    async getContentData() {
      if (this.fileHandle) {
        if (verifyPermission(this.fileHandle, false)) {
          const file = await this.fileHandle.getFile();
          const fileText = await readFile(file);
          console.log(fileText);
        }
      } else {
        console.error('File is not selected');
      }
    },
  },
};
</script>
