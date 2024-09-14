<template>
  <div className="content-editor">
    <AppMainHeader title="Content Editor" description="データストアの参照および編集ができます" />
    <div class="file-selecter">
      <SelectRecents label="最近のファイルから選択" />
      <SelectFileButton label="デバイスから選択" />
    </div>
    <div class="file-selecter-support">
      <DecryptFileButton v-if="!isBlankFile&&isFileSelected" />
    </div>
    <ServiceTableShow
      :key="table.key"
      :services="table.contents"
      @onedit="onTableEdit"
    />
    <YouAreTableShow
      :key="table.key"
      :source="table.personalInfo"
      @onedit="onTableEdit"
    />
    <EditServiceWindow
      :key="edit.key"
      :service="edit.targetService"
      @onsave="onEditorSave"
      @oncancel="onEditorCancel"
    />
    <PopupPromptWindow
      v-if="piPopup.isOpened"
      title="個人情報の編集"
      :key="piPopup.key"
      :body="piPopup.body"
      @submit="onSaveInPIEditor"
    />
    <div class="table-support">
      <button v-if="isFileSelected&&isBlankFile" @click="addDataIntoBlankFile">
        データがありません. データを追加しましょう!
      </button>
      <button v-if="isFileSelected&&isBlankFile" @click="addDataIntoBlankFile">
        個人情報がありません. 情報を追加しましょう!
      </button>
      <button v-if="isFileSelected&&!isBlankFile&&isDataParsed" @click="addData">
        データを追加する
      </button>
      <button v-if="isFileSelected&&!isBlankFile&&isDataParsed" @click="addYouareData">
        個人情報を追加する
      </button>
    </div>
    <div class="table-action">
      <button v-if="isDataChanged&&writeModifiedFlag">
        変更をもとに戻す
      </button>
      <button v-if="isDataChanged&&writeModifiedFlag" @click="doSave"
        class="save-btn XMLEditor__saveBtn">
        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg></span>
        <span>保存</span>
      </button>
    </div>
  </div>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
import EditServiceWindow from '@/components/EditServiceWindow.vue';
import ServiceTableShow from '@/components/ServiceTableShow.vue';
import SelectRecents from '@/components/SelectRecents.vue';
import SelectFileButton from '@/components/SelectFileButton.vue';
import DecryptFileButton from '@/components/DecryptFileButton.vue';
import YouAreTableShow from '@/components/YouAreTableShow.vue';
import PopupPromptWindow from '@/components/PopupPromptWindow.vue';

export default {
  name: 'ContentEditorView',
  components: {
    AppMainHeader,
    SelectRecents,
    EditServiceWindow,
    ServiceTableShow,
    YouAreTableShow,
    SelectFileButton,
    DecryptFileButton,
    PopupPromptWindow,
  },
  data() {
    return {
      /**
       * Watcher によって更新されるものたち
       */
      // 1. ファイルが選択されているか
      isFileSelected: false,
      // 2. データが複合化されているか
      isDataParsed: false,
      // 3. データが空のファイルか
      isBlankFile: false,
      // 4. データが更新されているか
      isDataChanged: false,
      /**
       * XML Object の root 以下
       * @type {{
       *  services: { service: object<ServiceElement>[] },
       *  youare: object<PersonalInfosElement>[]
       * }}
       */
      xoRoot: null,
      writeModifiedFlag: false,
      table: {
        key: 0,
        contents: null,
        personalInfo: null,
      },
      edit: {
        targetService: null,
        targetInfo: null,
        targetIndex: -1,
        targetInfoIndex: -1,
        key: 0,
      },
      piPopup: {
        isOpened: false,
        key: 0,
        body: [],
      },
    };
  },
  methods: {
    async addYouareData() {
      const { handle } = this.$store.getters['datastore/fileState'];
      if (!handle) return;
      if (!this.isBlankFile) {
        this.piPopup.body = [
          { type: 'title', text: 'Nickname' },
          { type: 'hidden', name: 'pi-index', value: -1 },
          { type: 'input', name: 'pi-nickname', value: '' },
        ];
        this.piPopup.key += 1;
        this.piPopup.isOpened = true;
      }
    },
    async onSaveInPIEditor(next) {
      const nickname = next.find((row) => row.name === 'pi-nickname');
      const piIndex = next.find((row) => row.name === 'pi-index');
      const index = piIndex.value;
      if (!('youare' in this.xoRoot)) this.xoRoot.youare = { info: [] };
      if (index === -1) {
        this.xoRoot.youare.info.push({ nickname: nickname.value });
      } else {
        console.log('this.xoRoot.youare.info', this.xoRoot.youare.info, index, this.xoRoot.youare.info[index]);
        this.xoRoot.youare.info[index].nickname = nickname.value;
      }
    },
    async addData() {
      const { handle } = this.$store.getters['datastore/fileState'];
      if (!handle) return;
      if (!this.isBlankFile) {
        this.table.contents = {};
        this.xoRoot.services.service.push({});
        this.onTableEdit({ index: this.xoRoot.services.service.length - 1, service: {} });
      }
    },
    async addDataIntoBlankFile() {
      const { handle } = this.$store.getters['datastore/fileState'];
      if (!handle) return;
      if (this.isBlankFile) {
        this.table.contents = {};
        this.xoRoot = { services: { service: [{}] }, youare: [] };
        this.onTableEdit({ index: 0, service: {} });
      }
    },
    onTableEdit({ index, service, info }) {
      console.log('onTableEdit', { index, service, info });
      if (service) {
        this.edit.targetService = service;
        this.edit.targetIndex = index;
        this.edit.key += 1;
      } else {
        this.piPopup.body = [
          { type: 'title', text: info.key },
          { type: 'hidden', name: 'pi-index', value: index },
          { type: 'input', name: `pi-${info.key}`, value: info.value },
        ];
        this.piPopup.key += 1;
        this.piPopup.isOpened = true;
      }
    },
    onEditorSave({ service }) {
      const idx = this.edit.targetIndex;
      const srv = service;
      if (service.scope) {
        srv.scope = srv.scope.filter((scp) => (scp !== ''));
      }
      Object.assign(this.xoRoot.services.service[idx], srv);
      this.tableUpdate();
      if (this.isBlankFile) this.isBlankFile = false;
    },
    onEditorCancel({ service }) {
      this.$log.debug('onCancel', service);
    },
    tableUpdate() {
      this.table.personalInfo = this.xoRoot?.youare?.info;
      this.table.contents = this.xoRoot?.services?.service;
      this.table.key += 1;
    },
    async doSave() {
      const { handle } = this.$store.getters['datastore/fileState'];
      if (!handle) return;
      // 編集確認
      if (!this.$store.getters['datastore/isModified']) {
        this.$log.debug('未編集です');
        return;
      }
      // state.editor にセットして、暗号化したのち、書き込み
      await this.$store.commit('datastore/putEditor', { xobject: { root: this.xoRoot } });
      const password = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Encrypt' });
      try {
        await this.$store.dispatch('datastore/encryptContent', { password });
      } catch (error) {
        this.$log.error('Error on datastore/encryptContent', error);
      }
      // 初期化
      this.xoRoot = null;
      this.writeModifiedFlag = false;
    },
  },
  watch: {
    xoRoot: {
      handler(next) {
        if (next) this.isDataParsed = true;
        else this.isDataParsed = false;

        if (!this.writeModifiedFlag) {
          // 1回目の変更イベントは、contents を表示したときのものなのでmodifiedは変更しない
          this.writeModifiedFlag = true;
        } else {
          this.$store.commit('datastore/isModified', { isModified: true });
          this.isDataChanged = true;
        }
      },
      deep: true,
    },
  },
  async mounted() {
    this.$store.watch(
      (state, getters) => getters['datastore/fileState'],
      ({ handle, data }) => {
        this.isFileSelected = (handle);
        this.isBlankFile = (data === null || data === '');
        this.isDataChanged = false;
      },
      {
        deep: true,
      },
    );
    this.$store.watch(
      (state, getters) => getters['datastore/editorState'],
      ({ xobject }) => {
        if (xobject) {
          this.xoRoot = xobject.root;
          this.table.contents = this.xoRoot?.services?.service;
          this.table.personalInfo = this.xoRoot?.youare?.info;
          this.isDataParsed = true;
        } else {
          this.xoRoot = null;
          this.table.contents = null;
          this.table.personalInfo = null;
          this.isDataParsed = false;
        }
        this.tableUpdate();
      },
      {
        deep: true,
      },
    );
  },
};

</script>

<style lang="scss" scoped>
  @use "@/assets/styles/color.scss" as c;
  .file-selecter {
    display: flex;
    justify-content: center;
    gap: .5rem;
    border-bottom: 1px black c.cp("black");
  }
  .file-selecter-support {
    text-align: center;
    margin: 1rem 0;
  }
  .save-btn {
    display: flex;
    span {
      &:first-child {
        display: flex;
        svg {
          width: 1rem;
          margin-top: 1px;
        }
      }
    }
  }
  .table-support {
    margin: 1rem 0;
    text-align: center;
  }
  .table-action {
    display: flex;
    justify-content: space-between;
  }
</style>
