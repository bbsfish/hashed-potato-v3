<template>
  <main>
    <h1>Hello World</h1>
    <nav>
      <ul>
        <router-link to='/start'>Start</router-link>
        <router-link to='/link'>Link</router-link>
      </ul>
    </nav>
  </main>
</template>

<script>
export default {
  name: 'LinkView',
};
</script>