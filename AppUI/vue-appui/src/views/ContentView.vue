<template>
  <main>
    <h2>Content Viewer</h2>
    <div>
      <SelectDeviceFileButton label='表示するファイルを選択' @pullFileHandle='onGetNewFileHandle' />
    </div>
    <div>
      <table>
        <tr>
          <th>Service ID</th>
          <th>Accounts</th>
          <th>UserID</th>
          <th>Password</th>
        <tr>
        <tr>
          <td>service-id-1</td>
          <td>account-x</td>
          <td>user-id-1</td>
          <td>user-passwd-1</td>
        </tr>
      </table>
    </div>
  </main>
</template>

<script>
import SelectDeviceFileButton from '@/components/SelectDeviceFileButton';
// import { writeFile } from '@/lib/fs-helper';
// import { getFileContent } from '@/lib/fs-helper-extends';
import { XMLParser } from '@/lib/fxparser.min';
import { raw } from 'express';
// import { XMLBuilder } from '@/lib/fxbuilder.min';

const fxp = new XMLParser();
// const fxb = new XMLBuilder();

export default {
  name: 'ContentView',
  components: {
    SelectDeviceFileButton,
  },
  data() {
    return {
      fileHandle: null,
    };
  },
  methods: {
    async onGetNewFileHandle(fh) {
      this.fileHandle = await fh;
      const rawText = await getFileContent(this.fileHandle);
      const rawParsed = fxp.parse(rawText);
      console.log(rawParsed);
    },
  },
};

</script>
