<template>
  <main>
    <h2>ここは Start です</h2>
    <nav>
      <ol>
          <li>ファイル作成</li>
      </ol>
    </nav>

    <section>
      <h1>ファイル作成</h1>
      <div>
        ファイルを作成する
      </div>
      <CreateDeviceFileButton label='CreateDeviceFileButton' @pullFileHandle='onGetNewFileHandle' />
    </section>
  </main>
</template>

<script>
import CreateDeviceFileButton from '@/components/CreateDeviceFileButton';
import { writeFile } from '@/lib/fs-helper';
import { getFileContent } from '@/lib/fs-helper-extends';
// import { XMLParser } from '@/lib/fxparser.min';
import { XMLBuilder } from '@/lib/fxbuilder.min';

// const fxp = new XMLParser();
const fxb = new XMLBuilder();

const ACC_STORE_TEMPLATE = {
  '?xml version=\'1.0\' encoding=\'UTF-8\'': '', // eslint-disable-line
  'application': { // eslint-disable-line
    'name': 'Account-Store', // eslint-disable-line
    'group': 'hashed-potato.com', // eslint-disable-line
  }, // eslint-disable-line
  'meta': { // eslint-disable-line
    'version': 1, // eslint-disable-line
    'devicefileid': '', // eslint-disable-line
  },// eslint-disable-line
  'data': '',// eslint-disable-line
};

export default {
  name: 'StartView',
  components: {
    CreateDeviceFileButton,
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
      if (rawText) {
        alert('ファイルが空ではありません'); //eslint-disable-line
      } else {
        const fileXml = fxb.build(ACC_STORE_TEMPLATE);
        writeFile(this.fileHandle, fileXml);
      }
    },
  },
};

</script>