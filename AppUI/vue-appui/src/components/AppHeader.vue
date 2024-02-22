<template>
  <header>
    <div className='h-wrapper'>
      <div class='h-logo'>
        <router-link to='/'>
          <span class='logo-icon'></span>
          <span class='logo-title'>hashed potato</span>
        </router-link>
      </div>
      <nav class='h-nav-sub'>
        <ul>
          <li><router-link to='/start'>Start</router-link></li>
          <li><router-link to='/link'>Link</router-link></li>
          <li><router-link to='/view'>View</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style scoped>
  header {
    background-color: black;
    color: white;
  }

  * {
    color: white;
  }
</style>