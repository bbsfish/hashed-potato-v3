<template>
  <footer>
    <div className="copyright">&copy;hashed-potato.mydns.jp</div>
    <div className="note">システムは開発中です</div>
    <div v-if="isSupported() !== true" id='fsa-not-supported'>
      The
      <Link href='https://wicg.github.io/file-system-access/' target='_blank'>File System Access API</Link>
      is <b>not</b> supported in this browser yet, and Text Editor is running
      in legacy mode. In legacy mode, the file modified indicators are not shown.
    </div>
  </footer>
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
  footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    color: white;
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
