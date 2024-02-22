<template>
  <div id='app'>
    <AppHeader />
    <router-view></router-view>
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
