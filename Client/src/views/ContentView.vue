<template>
  <main>
    <AppMainHeader title="Content Viewer"/>
    <div>
      <p>
        ファイルの参照および編集ができます.
      </p>
      <div class="selected-file-name-view">
        <span v-if='isFileSelected()'>
          選択中のファイル: {{ fileName() }}
        </span>
        <span v-else>
          ファイルが選択されていません
        </span>
      </div>
      <div class="box">
        <h3>ファイルを選択する</h3>
        <div>
          <RecentFilesWithSelectBox label='最近のファイル' />
          <SelectDeviceFileButton label='ファイルを選択' />
        </div>
      </div>
      <button v-if='isFileSelected()' @click='showContentData'>データを表示する</button>
      <AddDataPrompt @pullInputData='addDataIntoFile' v-if='isFileSelected()'/>
      <button v-if='isFileSelected()' @click="lockFile">ファイルに鍵をかける</button>
      <SetupTable
        :idata='convFromSecDataToArrangeSecData'
        :icolumns='arrangeSecDataColumn'
        />
    </div>
  </main>
</template>

<script>
import { ulid } from 'ulid';
import AddDataPrompt from '@/components/AddDataPrompt.vue';
import SelectDeviceFileButton from '@/components/SelectDeviceFileButton.vue';
import RecentFilesWithSelectBox from '@/components/RecentFilesWithSelectBox.vue';
import SetupTable from '@/components/SetupTable.vue';
import AppMainHeader from '@/components/AppMainHeader.vue';
import { writeFile } from '@/lib/fs-helper'; // getFileContent,  verifyPermission, readFile
// import { XMLParser } from '@/lib/fxparser.min';
import { XMLBuilder } from '@/lib/fxbuilder.min';
import fileMaster from '@/lib/file-master';
import secrets from '@/lib/secrets-v1';

// const fxp = new XMLParser();
const fxb = new XMLBuilder();

export default {
  name: 'ContentView',
  components: {
    SelectDeviceFileButton,
    AddDataPrompt,
    SetupTable,
    RecentFilesWithSelectBox,
    AppMainHeader,
  },
  data() {
    return {
      fileHandle: null,
      fileId: '',
      contents: null,
      plainObject: null,
      arrangeSecDataColumn: [
        // id: Int, serviceId: String, userId: String, password: String
        { title: 'ID', field: 'id' },
        { title: 'Service ID', field: 'serviceId' },
        { title: 'User ID', field: 'uid' },
        { title: 'Password', field: 'password' },
      ],
    };
  },
  computed: {
    getUserFileHandle() {
      return this.$store.getters['user/file'];
    },
    // secData から SetupTable 用のオブジェクトを生成する
    convFromSecDataToArrangeSecData() {
      if (this.plainObject === null
        || this.plainObject.length === 0) return [];
      const res = this.plainObject.services
        .map((service, idxA) => {
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
  watch: {
    async getUserFileHandle(next) {
      this.fileHandle = next;
      this.contents = await fileMaster.getContent(next);
      this.fileId = this.contents.meta.devicefileid;
      this.plainObject = null;
      console.log('user file changed');
      console.log('contents', this.contents);
      console.log('fileId', this.fileId);
    },
  },
  methods: {
    // データを表示する
    async showContentData() {
      // 複合化
      const inputPassword = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Decrypt' });
      if (inputPassword) {
        this.plainObject = await secrets
          .importEncyptedString(this.contents.data, this.fileId, inputPassword);
        console.log('plainObject', this.plainObject);
      }
    },
    // データを追加する（AddDataPrompt）
    async addDataIntoFile(uId, password) {
      if (!uId || !password || !this.fileHandle) return;
      this.plainObject.services.push({
        id: ulid(),
        accounts: [{
          uid: uId, password,
        }],
      });
      console.log('data added', this.plainObject.services);
    },
    // データを書き込む（EncyptDataPrompt）
    async lockFile() {
      if (!this.fileHandle) return;
      console.log('write contents', this.plainObject);
      const pass = await this.$dialog.prompt({ message: 'Enter new PASSPHRASE for Data Encrypt' });
      const plainString = await secrets
        .exportAsEncryptedString(this.plainObject, this.fileId, pass);
      this.contents.data = plainString;
      await writeFile(this.fileHandle, fxb.build(this.contents));
      console.log('write contents', this.plainObject, plainString, this.contents);
      this.plainObject = null;
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
  },
  async mounted() {
    this.fileHandle = this.$store.getters['user/file'];
    this.$store.watch(
      (state, getters) => getters['user/file'],
      (next) => {
        this.fileHandle = next;
      },
    );
  },
};

</script>

<style lang="scss" scoped>
  .selected-file-name-view {
    color: white;
    background-color: black;
    padding: 4px 6px;
  }
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
  .box {
    border: 1px solid black;
    padding: 6px 12px;
    margin: 6px 12px;
  }
</style>
