<template>
  <button @click="createDeviceFile">{{label}}</button>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import { getNewFileHandle, writeFile } from '@/lib/fs-helper';
import { XMLBuilder } from '@/lib/fxbuilder.min';
import DEVICE_XML from '@/formats/device-file-template.json';
import secrets from '@/lib/secrets-v1';

const fxb = new XMLBuilder();

export default {
  name: 'CreateDeviceFileButton',
  props: ['label'],
  data() {
    return {
    };
  },
  methods: {
    async createDeviceFile() {
      const newContent = DEVICE_XML;
      const newData = {
        services: [],
      };
      try {
        const fh = await getNewFileHandle('My-Account-Store.txt');
        console.log(fh);
        this.$store.commit('files/add', fh);
        this.$store.commit('user/file', fh);
        newContent.meta.devicefileid = uuidv4();
        const inputPassphrase = await this.$dialog.prompt({ message: 'Enter new PASSPHRASE for Data Encrypt' });
        const encryptedString = await secrets
          .exportAsEncryptedString(newData, newContent.meta.devicefileid, inputPassphrase);
        newContent.data = encryptedString;
        await writeFile(fh, fxb.build(newContent));
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    console.log('fileList', this.$store.getters['files/fileList']);
  },
};
</script>

<style lang="scss" scoped>
  button {
    color: #fff;
    background-color: #0629eb;
    border: 0;
    border-radius: 6px;
    padding: 6px 12px;

    &:hover {
      transition: .8s;
      color: #fff;
      background: #3b54e0;
      cursor: pointer;
    }
  }
</style>
