<template>
  <div class="block-wrp header-wrp">
    <div class='header-logo'>
      <router-link to='/' class="header-logo__item">
        <div>
          <span>HASHED POTATO</span>
          <span>FREE FROM PASSWORD</span>
        </div>
        <img src="/logo.svg" alt="Logo for this website" />
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
      $max-width: 300px;
      $logo-width: 50px;
      width: $max-width;
      height: 50px;
      text-align: center;
      &__item {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        div {
          width: $max-width - $logo-width;
          height: 100%;
          span:first-child {
            display: block;
            position: absolute;
            top: 0;
            right: $logo-width + 6px;
            font-size: 1.8rem;
          }
          span:last-child {
            display: inline-block;
            position: absolute;
            right: $logo-width + 10px;
            bottom: 0;
            font-size: 0.6rem;
          }
        }
        img {
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          width: $logo-width;
          height: $logo-width;
        }
      }
    }

    .header-menu {
      &__outer {
        height: 100%;
        display: flex;
        gap: 1rem;
        margin: 0 1rem;
        li {
          display: flex;
          align-items: center;
          a {
            font-size: 1.4rem;
          }
        }
      }
    }
  }
</style>
