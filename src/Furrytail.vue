<template>
  <div class="furrytail">
    <div class="header">
      <div class="logo" @click="ToggleMenu"></div>
      <div class="search">
        <div class="search_body">
          <input class="search_input" type="text" name="search_pattern" ref="search_pattern" v-on:submit="GoSearch" placeholder="Метки для поиска..."/>
          <div class="search_go">
            <div>
              <button @click="GoSearch"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex_filler"></div>
    </div>
    <div class="menu noselect" :opened="showMenu">
      <div class="item profile">
        <img src="./assets/pictures/logo.png" class="avatar"/>
        <div class="nickname">{{user.name}}</div>
      </div>
      <div v-if="logiedIn">
        <div class="item">
          <div><font-awesome-icon icon="images" /></div>
          <div>Мои картинки</div>
        </div>
        <div class="item">
          <div><font-awesome-icon icon="music" /></div>
          <div>Моя музыка</div>
        </div>
        <div class="item">
          <div><font-awesome-icon icon="video" /></div>
          <div>Мои видео</div>
        </div>
        <div class="item" @click="SignOut">
          <div><font-awesome-icon icon="sign-out-alt" /></div>
          <div>Выход</div>
        </div>
      </div>
      <div v-else>
        <div class="signin">
          <b-form-input size="sm" placeholder="Имя" type="text" v-model="login.login"></b-form-input>
          <b-form-input size="sm" placeholder="Пароль" type="password" v-model="login.password"></b-form-input>
          <b-button variant="primary" size="sm" block @click="SignIn"><font-awesome-icon icon="sign-in-alt"/> Войти</b-button>
        </div>
      </div>
      <div class="item footer">
        <div class="powered-by">Powered by:</div>
        <img src="./assets/pictures/logo.png" title="Vue.js"/>
      </div>
    </div>
    <div class="panel holder">
      <router-view></router-view>
    </div>
    <div class="modals holder">
      <b-modal hide-footer size="lg" id="rules" title="Правила сообщества">
        <p>Очень много текста.</p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import fur from './fur'

export default {
  name: 'Furrytail',
  methods: {
    ToggleMenu () {
      this.showMenu = !this.showMenu
    },
    GoSearch () {
      axios.post('api/search', {tags: this.$refs.search_pattern.value.split(' ')})
    },
    SignIn () {
      var vue = this
      axios.post('api/signin', {login: this.login.login, password: this.login.password}).then(function (response) {
        if (response.data.success) {
          vue.logiedIn = true
          vue.user.name = response.data.data.name
          vue.user.id = response.data.data.id
          fur.cookie.Set('token', response.data.data.token, 60 * 30)
        }
      })
    },
    SignOut () {
      this.nickname = 'Аноним'
      this.logiedIn = false
    }
  },
  data () {
    return {
      login: {
        login: '',
        password: ''
      },
      user: {
        name: 'Аноним',
        token: null
      },
      logiedIn: false,
      showMenu: false
    }
  }
}
</script>

<style>
  :root {
    --color-main: #FF4900;
    --color-secondary: #3F3F37;
    --color-additional: #D6D6B1;
    --color-D: #494331;
    --color-E: #878472;
  }
  body {
    margin: 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--color-E);
  }
  ul {
    display: flex;
    list-style-type: none;
    flex-direction: column;
    margin: 0;
  }
  li {
    flex-grow: 1;
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
  }
  .holder {
    pointer-events: none;
  }
  .holder > * {
    pointer-events: auto;
  }
  .header {
    z-index: 1000;
    color: whitesmoke;
    position: absolute;
    left: 0;
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    padding: 0 50px;
    background: var(--color-main);
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0,0,0,0.15)
  }
  .search {
    width: 400px;
    padding: 5px;
    cursor: text;
  }
  .search_body {
    border-radius: 20px;
    height: 100%;
    border: 1px solid rgba(0,0,0,0.10);
    background: rgba(0,0,0,0.3);
    overflow: hidden;
    display: flex;
    flex-direction: row;
  }
  .search_input {
    background: none;
    border: none;
    height: 100%;
    padding: 0 10px;
    color: whitesmoke;
    flex-grow: 1;
  }
  .search_go {
    height: 100%;
    display: table;
  }
  .search_go > div {
    display: table-cell;
    vertical-align: middle;
  }
  .search_go > div > button {
    width: 30px;
    height: 30px;
    background: whitesmoke;
    cursor: pointer;
    margin: auto;
    display: block;
    border: 0;
  }
  .search_go > div > button:hover {
    background: white;
  }
  .flex_filler {
    flex-grow: 1;
  }
  .logo {
    width: 200px;
    margin: 5px 0;
    background: white;
    cursor: pointer;
  }
  .menu {
    position: absolute;
    left: -250px;
    top: 0;
    height: 100%;
    width: 250px;
    background: var(--color-secondary);
    border-right: 1px solid rgba(0,0,0,0.15);
    transition: left ease 0.15s;
    padding-top: 40px;
    color: whitesmoke;
  }
  .menu .item {
    padding: 5px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
  }
  .menu .item:not(.footer):hover {
    background: rgba(0,0,0,0.15);
  }
  .menu .item:not(.footer):active {
    background: rgba(0,0,0,0.25);
  }
  .menu .item:not(.footer) {
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  .menu .item:not(.profile) {
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  .menu .item:not(.footer) > div:first-child {
    width: 50px;
    line-height: 25px;
    text-align: center;
  }
  .menu .item:not(.footer) > div:last-child {
    flex-grow: 1;
    line-height: 25px;
    padding-left: 10px;
  }
  .menu .profile .avatar {
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 0 10px black;
    background: rgba(255,255,255,0.1);
  }
  .menu .profile .nickname {
    line-height: 50px !important;
    font-weight: bold;
    text-shadow: 0 0 10px black;
  }
  .menu .signin {
    padding: 0 5px 5px 5px;
  }
  .menu .signin > * {
    margin-top: 5px;
  }
  .menu[opened] {
    left: 0;
  }
  .menu .footer {
    cursor: default;
    display: block;
  }
  .menu .footer > img {
    display: block;
    float: left;
    height: 30px;
    cursor: pointer;
  }
  .menu .powered-by {
    font-size: 7pt;
    font-weight: bold;
  }
  .panel, .modals {
    position: absolute;
    padding-top: 40px;
    width: 100%;
    height: 100%;
  }
  .panel > div {
    margin: auto;
    width: 800px;
    max-width: 100%;
    box-shadow: 0 0 10px black;
    min-height: 100%;
    padding: 10px;
    background: white;
  }
  .panel > div[wide] {
    width: 100%;
  }
  .modals {
    display: none;
  }
</style>
