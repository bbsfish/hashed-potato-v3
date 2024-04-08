<template>
  <div class='app'>
    <AppHeader />
    <div className="main-wrp">
      <router-view></router-view>
    </div>
    <AppFooter />
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

<style lang="scss" scoped>
  .main-wrp {
    margin-top: 48px; // HeaderHeight
    margin-bottom: calc(72px + 100px); // FooterHeight + 予備
  }
</style>
