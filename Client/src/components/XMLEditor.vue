<template>
  <div class="xml-editor XMLEditor">
    <div class="XMLEditor__view">
      <label for="xml-editor-view">
        <textarea id="xml-editor-view" class="xml-editor-view" name="xml-editor-view"
          v-model="xdata"></textarea>
      </label>
    </div>
    <div class="XMLEditor__menu">
      <button @click="doFormat">
        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg></span>
        <span>フォーマット</span>
      </button>
      <button @click="doSave" class="XMLEditor__saveBtn">
        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg></span>
        <span>保存</span>
      </button>
    </div>
  </div>
</template>

<script>
import xmlFormat from 'xml-formatter';

export default {
  name: 'ContentView',
  components: {
  },
  props: {
    xmlstring: {
      type: String,
      deafult: '',
    },
  },
  data() {
    return {
      xdataPutFlag: false, // xdata の watcher 用
      xdata: '',
      lineLenght: 0,
    };
  },
  methods: {
    doFormat() {
      if (this.xdata === '') return;
      this.xdataPutFlag = false; // xdata の watcher 対策
      this.xdata = xmlFormat(this.xdata);
    },
    async doSave() {
      const { handle } = this.$store.getters['datastore/fileState'];
      if (!handle) return;
      if (!this.$store.getters['datastore/isFileModified']) {
        // 未編集のとき
        this.$log.debug('未編集です');
        return;
      }
      await this.$store.commit('datastore/putEditor', { xtext: this.xdata });
      const password = await this.$dialog.prompt({ message: 'Enter PASSPHRASE for Data Encrypt' });
      try {
        const encResult = await this.$store.dispatch('datastore/encryptContent', { password });
        this.$log.debug('encResult', encResult);
      } catch (error) {
        this.$log.info('encResult', error);
      }
    },
  },
  watch: {
    xdata(next) {
      if (!this.xdataPutFlag) {
        // 1回目の変更イベントは、contents を表示したときのものなのでmodifiedは変更しない
        // また、フォーマットボタンを押したときの変更イベントもmodifiedは変更しない
        this.xdataPutFlag = true;
      } else {
        this.$store.commit('datastore/modified');
      }
      this.$log.debug('xdata', next);
      this.lineLenght = (next.match(/\n/g) || []).length + 1;
    },
    lineLenght(next) {
      this.$log.debug('lineLenght', next);
      document.querySelector('#xml-editor-view').rows = next;
    },
  },
  mounted() {
    this.xdata = this.xmlstring;
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mediaquery.scss" as m;
@use "@/assets/styles/color.scss" as c;

.XMLEditor {
  position: relative;
  &__view {
    display: inline-block;
    width: calc(100% - 2px); // -border

    textarea {
      font-size: 1.2rem;
      line-height: 1.8;
      padding: .3rem;
      width: calc(100% - .6rem); // -padding
    }
  }
  &__menu {
    display: flex;
    justify-content: space-between;
    button {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1rem;
      width: 200px;
      padding: .2rem 1rem;
      span {
        svg {
          width: 1rem;
        }
      }
      // color: #fff;
      // background-color: #eb6100;
      // border-bottom: 5px solid #b84c00;
      //   -webkit-box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
      // box-shadow: 0 3px 5px rgba(0, 0, 0, .3);

      // &:hover {
      //   margin-top: 3px;
      //   color: #fff;
      //   background: #f56500;
      //   border-bottom: 2px solid #b84c00;
      // }
    }
  }
  &__saveBtn {
    color: c.cp('blue');
  }
  button {
    &:hover {
      box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
    }
  }
}
</style>
