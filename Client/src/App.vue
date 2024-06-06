<template>
  <div class='app'>
    <header>
      <AppHeader />
    </header>
    <main>
      <div class="block-wrp main-wrp">
        <router-view></router-view>
      </div>
    </main>
    <footer>
      <AppFooter />
    </footer>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'app',
  components: { AppHeader, AppFooter },
};
</script>

<style lang="scss">
  /* Imports */
  @use "@/assets/styles/color.scss" as c;
  @use "@/assets/styles/mediaquery.scss" as m;
  @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap');
  // @import '@/assets/styles/the-new-css-reset.css';
  /* Variables */
  :root {
    --trs-duration: .6s;
  }

  /* Outline Styles */
  html {
    font-size: 16px;

    * {
      margin: 0;
      padding: 0;
      zoom: 1;
      box-sizing: content-box;
    }

    body {
      font-family: 'M PLUS Rounded 1c', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial',
        'Hiragino Sans', 'ヒラギノ角ゴシック', YuGothic, 'Yu Gothic', 'メイリオ',
        Meiryo, 'ＭＳ Ｐゴシック', 'MS PGothic';

      // 大枠のコンテンツを囲むブロック (html > header > div.block-wrp など)
      .block-wrp {
        margin: 0 auto;
        width: 95%;
        @include m.mq(pc) {
          width: 80%;
        }
      }

      header, footer {
        background-color: c.cp("black");
      }

      main {
        margin: 0 auto;
        min-height: 100vh;
        max-width: 1200px;
      }
    }
  }

  /* Content Styles */
  h1, h2, h3, h4, h5,
  p, a {
    color: c.cp("black");
  }

  li {
    list-style: none;
  }

  button {
    font-size: 1rem;
    border-radius: .2rem;
    padding: 0 1rem;
    &:hover {
      cursor: pointer;
      box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
    }
  }

  input[type=button] {
    font-size: 1rem;
    border-radius: .2rem;
    padding: 0 1rem;
    &:hover {
      cursor: pointer;
      box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
    }
  }

  select {
    border-radius: .2rem;
    padding: .3rem 1.5rem;
    font-size: 1rem;
  }
  hr {
    &.hr-1 {
      border-width: 1px;
      border-style: solid;
      border-color: c.cp("black");
      margin: .2rem 0 1rem 0;
    }
  }
</style>
<style lang="scss">
  @use "@/assets/styles/app-dialog.scss";
</style>
