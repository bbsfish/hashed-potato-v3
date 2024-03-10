<template>
  <header>
    <div className='header-wrp'>
      <div className='logo'>
        <ul>
          <li>
            <router-link to='/'>
              HASHED POTATO
            </router-link>
          </li>
        </ul>
      </div>
      <nav className='menu'>
        <ul>
          <li><router-link to='/start'>Start</router-link></li>
          <li><router-link to='/view'>View</router-link></li>
          <li><router-link to='/config'>Config</router-link></li>
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

<style lang="scss" scoped>
  header {
    position: fixed;
    width: 100vw;
    left: 0;
    top: 0;
    height: 48px;
    background-color: black;
    * {
      color: white;
    }

    .header-wrp {
      width: 90%;
      display: flex;
      justify-content: space-between;
      margin: 0 auto;

      ul {
        margin: 12px 0;
        padding: 0;
        li {
          list-style: none;
          display: block;
          text-align: center;
          margin: 0 6px;

          a {
            text-decoration: none;
          }

          a:hover {
            cursor: pointer;
            color: rgb(170, 170, 170);
            transition: .8s;
          }
        }
      }
      .menu ul {
        display: flex;
      }
      .logo {
        width: 150px;
      }
    }
  }
</style>
