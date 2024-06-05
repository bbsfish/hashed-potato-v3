<template>
  <div class="block-wrp footer-wrp">
    <div className="copyright">&copy;hashed-potato.mydns.jp</div>
    <div className="note">システムは開発中です</div>
    <div v-if="isSupported() !== true" id='fsa-not-supported'>
      The
      <a href='https://wicg.github.io/file-system-access/' target='_blank'>File System Access API</a>
      is <b>not</b> supported in this browser yet, and Text Editor is running
      in legacy mode. In legacy mode, the file modified indicators are not shown.
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
  data: () => ({
    hasFSAccess: null,
  }),
  methods: {
    isSupported() {
      this.hasFSAccess = 'chooseFileSystemEntries' in window
          || 'showOpenFilePicker' in window;
      return this.hasFSAccess;
    },
  },
};
</script>

<style lang="scss" scoped>
  @use "@/assets/styles/mediaquery.scss" as m;
  .footer-wrp {
    background-color: black;
    color: white;
    @include m.mq(pc) {
      width: 80%;
    }
    * {
      color: white;
    }
    .copyright {
      text-align: center;
    }

    .note {
      text-align: center;
    }
  }
</style>
