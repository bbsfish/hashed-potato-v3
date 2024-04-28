<template>
  <div class='app'>
    <header>
      <AppHeader />
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <AppFooter />
    </footer>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
// import AppDialog from './components/AppDialog.vue';

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
  /* Global Styles */
  html {
    font-size: 16px;

    * {
      margin: 0;
      padding: 0;
      box-sizing: content-box;
      zoom: 1;
    }

    body {
      font-family: 'M PLUS Rounded 1c', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial',
        'Hiragino Sans', 'ヒラギノ角ゴシック', YuGothic, 'Yu Gothic', 'メイリオ',
        Meiryo, 'ＭＳ Ｐゴシック', 'MS PGothic';
    }
  }

  p,h1,h2,h3,h4,h5,a {
    color: c.cp("black");
  }

  li {
    list-style: none;
  }

  header {
    background-color: c.cp("black");
    width: 100%;
    padding: 5px 0;
  }

  main {
    margin: 0 auto;
    padding: 0;
    min-height: 100vh;
    max-width: 1200px;
    @include m.mq(pc) {
      width: 80%;
    }
  }

  footer {
    background-color: c.cp("black");
  }

  // button {
  //   border: 0;
  //   border-radius: .2rem;
  //   padding: 0 1.5rem;
  //   height: 1.6rem;
  //   &:hover {
  //     cursor: pointer;
  //     background-color: c.cp('blue', 'hovered');
  //     box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .5);
  //   }
  // }

  select {
    border-radius: .2rem;
    padding: .3rem 1.5rem;
    font-size: 1rem;
  }
</style>
