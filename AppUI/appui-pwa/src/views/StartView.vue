<template>
  <main>
    <AppMainHeader title="Start"/>
    <section>
      <ol>
        <li>
          まず初めに、ローカルファイルを作成します.<br>
          "ファイルを作成する" を押すと、任意の名前でファイルがあなたのデバイスに作成されます.
          ファイル名の初期値は "My-Account-Store.txt" です.<br>
          <CreateDeviceFileButton label='ファイルを作成する' />
        </li>
        <li>
          "Enter new PASSPHRASE for Data Encrypt" とプロンプトが表示されます.
          これは、ファイルの中の個人的なデータを暗号化するために使用されます.
          任意の文字列を入力してください.<br>
          ここで入力した値は、次にファイルを複合化するときだけ、必要になります.
        </li>
        <li>
          Start のステップはすべて完了しました.
          ファイルデータを確認および編集するためには、<router-link to='/view'>View</router-link>にアクセスしてください.
        </li>
      </ol>
    </section>
  </main>
</template>

<script>
import CreateDeviceFileButton from '@/components/CreateDeviceFileButton.vue';
import AppMainHeader from '@/components/AppMainHeader.vue';
// import { writeFile, getFileContent } from '@/lib/fs-helper';
// import { XMLParser } from '@/lib/fxparser.min';
// import { XMLBuilder } from '@/lib/fxbuilder.min';

// const fxp = new XMLParser();
// const fxb = new XMLBuilder();

// const ACC_STORE_TEMPLATE = {
//   '?xml version=\'1.0\' encoding=\'UTF-8\'': '', // eslint-disable-line
//   'application': { // eslint-disable-line
//     'name': 'Account-Store', // eslint-disable-line
//     'group': 'hashed-potato.com', // eslint-disable-line
//   }, // eslint-disable-line
//   'meta': { // eslint-disable-line
//     'version': 1, // eslint-disable-line
//     'devicefileid': '', // eslint-disable-line
//   },// eslint-disable-line
//   'data': '',// eslint-disable-line
// };

export default {
  name: 'StartView',
  components: {
    CreateDeviceFileButton,
    AppMainHeader,
  },
  data() {
    return {
    };
  },
  methods: {},
  mounted() {
  },
};

</script>

<style lang="scss" scoped>
  a:hover {
    cursor: pointer;
  }
</style>
