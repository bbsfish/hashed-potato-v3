<template>
  <main>
    <h2>Content Viewer</h2>
    <div>
      <SetupTable
        :idata='convFromSecDataToArrangeSecData'
        :icolumns='arrangeSecDataColumn'
        />
      <RecentFilesWithSelectBox ref='recentFiles' label='最近のファイル' />
      <button @click='doTest'>do it</button>
      <SelectDeviceFileButton label='表示するファイルを選択' @pullFileHandle='onGetNewFileHandle' />
      <span>
        表示中のファイル: {{fileName()}}
      </span>
      <button v-if='isFileSelected()' @click='showContentData'>データを表示する</button>
      <AddDataPrompt @pullInputData='addDataIntoFile'/>
      <EncyptDataPrompt @pullPassphrase='zipDeviceFile'/>
    </div>
  </main>
</template>

<script>
import { shallowRef } from 'vue';
import { ulid } from 'ulid';
import AddDataPrompt from '@/components/AddDataPrompt.vue';
import EncyptDataPrompt from '@/components/EncyptDataPrompt.vue';
import SelectDeviceFileButton from '@/components/SelectDeviceFileButton.vue';
import RecentFilesWithSelectBox from '@/components/RecentFilesWithSelectBox.vue';
import SetupTable from '@/components/SetupTable.vue';
import { writeFile, getFileContent } from '@/lib/fs-helper';
import Secrets from '@/lib/secrets';
import { XMLParser } from '@/lib/fxparser.min';
import { XMLBuilder } from '@/lib/fxbuilder.min';
import { idbKeyval } from '@/lib/idb-keyval-iife';

const fxp = new XMLParser();
const fxb = new XMLBuilder();

export default {
  name: 'ContentView',
  components: {
    SelectDeviceFileButton,
    AddDataPrompt,
    EncyptDataPrompt,
    SetupTable,
    RecentFilesWithSelectBox,
  },
  setup() {
    const addDataPrompt = shallowRef();
    return {
      addDataPrompt,
    };
  },
  data() {
    return {
      fileHandle: null,
      content: null,
      sec: new Secrets(),
      secData: [],
      arrangeSecDataColumn: [
        // id: Int, serviceId: String, userId: String, password: String
        { title: 'ID', field: 'id' },
        { title: 'Service ID', field: 'serviceId' },
        { title: 'User ID', field: 'uid' },
        { title: 'Password', field: 'password' },
      ],
    };
  },
  methods: {
    // Event by SelectDeviceFileButton
    async onGetNewFileHandle(fh) {
      if (!fh) return;
      this.fileHandle = await fh;
      this.$refs.recentFiles.saveRecentFiles(fh);
    },
    // データを表示する
    async showContentData() {
      const xmlText = await getFileContent(this.fileHandle);
      const xml = fxp.parse(xmlText); // parse to Object
      try {
        if (xml.meta.devicefileid) {
          this.content = xml;
          // Secrets 初期化および DeviceFileID 設定
          this.sec = Secrets.importEncyptedData(xml.data);
          this.sec.setDeviceFileId(xml.meta.devicefileid);
          // 表示データなし
          if (xml.data === '') {
            console.log('表示するデータがありません');
            return;
          }
          // 表示データあり
          // 複合化
          const inputPassword = window.prompt('Enter PASSPHRASE for Data Decrypt'); // eslint-disable-line
          if (inputPassword) {
            await this.sec.decryptCipher(inputPassword);
            const masked = this.sec.getMaskedAsObject();
            this.secData = masked;
          }
        } else {
          console.log('Device File ID がありません');
        }
      } catch (error) {
        console.log('不正なファイルです', error);
      }
    },
    // データを追加する（AddDataPrompt）
    async addDataIntoFile(uId, password) {
      console.log(uId, password);
      if (!uId || !this.fileHandle) return;
      const randomServiceId = ulid();
      this.sec.pushAccount(randomServiceId, uId, password);
      this.secData = this.sec.getMaskedAsObject();
    },
    // データを書き込む（EncyptDataPrompt）
    async zipDeviceFile(passphrase) {
      if (!this.fileHandle || !this.content) return;
      await this.sec.encryptMasked(passphrase);
      const dataAsStr = this.sec.exportEncyptedDataAsString();
      this.content.data = dataAsStr;
      await writeFile(this.fileHandle, fxb.build(this.content));
      console.log('書き込みました');
    },
    // File が選択されているかどうか確認する
    isFileSelected() {
      return this.fileHandle !== null;
    },
    // File Handle からファイル名を得る
    fileName() {
      if (this.fileHandle === null) return '';
      return this.fileHandle.name;
    },
    doTest() {
      this.$refs.recentFiles.testMethod('ok?');
    },
  },
  computed: {
    // secData から SetupTable 用のオブジェクトを生成する
    convFromSecDataToArrangeSecData() {
      const res = this.secData.map((service, idxA) => {
        // id は {service idx + 1}(1000の位から上) + {account idx}(下3桁) の数値
        const idA = (idxA + 1) * 1000;
        /**
         * @return {Array<Object>}
         * Object => {id: Int, serviceId: String, userId: String, password: String ...}
         */
        return service.accounts.map((acc, idxB) => Object.assign(
          acc,
          {
            id: idA + idxB,
            serviceId: service.id,
          },
        ));
      }); // => 2 Dimention Array
      return res.flat(); // => 1 Dim
    },
  },
  async mounted() {
    console.log(await idbKeyval.keys());
  },
};

</script>
