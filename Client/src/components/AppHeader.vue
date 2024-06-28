<template>
  <div class="block-wrp header-wrp">
    <div class='header-logo'>
      <router-link to='/' class="header-logo__item">
        HASHED POTATO
      </router-link>
    </div>
    <nav class='header-menu'>
      <ul class="header-menu__outer">
        <li>
          <router-link to='/start'>Start</router-link>
        </li>
        <li>
          <router-link to='/content'>Editor</router-link>
        </li>
        <li>
          <router-link to='/config'>Config</router-link>
        </li>
        <li>
          <router-link to='/dev'>Dev</router-link>
        </li>
        <li>
          <router-link to='/reference'>Reference</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style lang="scss" scoped>
  @use "@/assets/styles/mediaquery.scss" as m;
  @use "@/assets/styles/color.scss" as c;
  .header-wrp {
    font-size: 1.2rem;
    padding: .4rem 0;
    display: flex;
    justify-content: space-between;

    * {
      color: c.cp("white");
    }

    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
        transition: var(--trs-duration);
        cursor: pointer;
      }
    }

    .header-logo {
      width: 150px;
      text-align: center;
    }

    .header-menu {
      .header-menu__outer {
        height: 100%;
        display: flex;
        gap: 1rem;
        margin: 0 1rem;
      }
    }
  }
</style>
