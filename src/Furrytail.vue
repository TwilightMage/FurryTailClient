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
    <div class="panel holder">
      <router-view></router-view>
    </div>
    <div class="modals holder">
      <b-modal hide-footer size="lg" id="rules" title="Правила сообщества">
        <p>Очень много текста.</p>
      </b-modal>
    </div>
    <div class="menu noselect" :opened="showMenu">
      <div v-if="logiedIn">
        <div class="item profile" @click="OpenProfile">
          <img src="./assets/pictures/logo.png" class="avatar"/>
          <div class="nickname">{{user.name}}</div>
        </div>
        <div class="item">
          <div><font-awesome-icon icon="newspaper" /></div>
          <div>Мои новости</div>
        </div>
        <div class="item">
          <div><font-awesome-icon icon="comment" /></div>
          <div>Мои сообщения</div>
        </div>
        <div class="item">
          <div><font-awesome-icon icon="user" /></div>
          <div>Мои друзья</div>
        </div>
        <div class="item" @click="OpenPictures">
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
        <div class="item">
          <div><font-awesome-icon icon="cog" /></div>
          <div>Мои настройки</div>
        </div>
        <div class="item">
          <div><font-awesome-icon icon="bug" /></div>
          <div>Сообщить об ошибке</div>
        </div>
        <div class="item" @click="SignOut">
          <div><font-awesome-icon icon="sign-out-alt" /></div>
          <div>Выход</div>
        </div>
      </div>
      <div v-else>
        <div class="signin">
          <b-form-input size="sm" placeholder="Имя или почта" type="text" :state="LoginState" v-model="login.login"></b-form-input>
          <b-form-input size="sm" placeholder="Пароль" type="password" :state="PasswordState" v-model="login.password"></b-form-input>
          <b-button variant="primary" size="sm" block :disabled="SignupInvalid" @click="SignIn"><font-awesome-icon icon="sign-in-alt"/> Войти</b-button>
          <div class="orregister">
            или <router-link to="/signup">зарегистрироваться</router-link>
          </div>
        </div>
      </div>
      <div class="item footer">
        <div class="powered-by">Powered by:</div>
        <img src="./assets/pictures/logo.png" title="Vue.js"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import fur from './fur'

export default {
  name: 'Furrytail',
  computed: {
    LoginState () {
      if (this.login.login === '') return null
      else return fur.regex.name.test(this.login.login)
    },
    PasswordState () {
      if (this.login.password === '') return null
      else return fur.regex.password.test(this.login.password)
    },
    SignupInvalid () {
      return !(this.LoginState && this.PasswordState)
    }
  },
  methods: {
    ToggleMenu () {
      this.showMenu = !this.showMenu
    },
    GoSearch () {
      axios.post('api/search', {tags: this.$refs.search_pattern.value.split(' ')})
    },
    OpenProfile () {
      this.$router.push(`/user/${this.$store.state.id}`)
    },
    OpenPictures () {
      this.$router.push(`/pictures/${this.$store.state.id}`)
    },
    SignIn () {
      this.SignInWith(this.login.login, this.login.password)
    },
    SignInWith (login, password) {
      var vue = this
      axios.post('api/signin', {login: login, password: password}).then(function (response) {
        if (response.data.success) {
          vue.logiedIn = true
          vue.user.token = response.data.data.token
          vue.user.name = response.data.data.name
          vue.$store.commit('signin', response.data.data.id, response.data.data.token)
          fur.cookie.Set('login', fur.crypt.en(login, 'super-secret-dragon'))
          fur.cookie.Set('password', fur.crypt.en(password, 'super-secret-dragon'))
        }
      })
    },
    SignOut () {
      this.logiedIn = false
      fur.cookie.Remove('login')
      fur.cookie.Remove('password')
    }
  },
  created () {
    this.token = fur.cookie.Get('token', null)
    var login = fur.cookie.Get('login', null)
    var password = fur.cookie.Get('password', null)
    if (login && password) {
      login = fur.crypt.de(login, 'super-secret-dragon')
      password = fur.crypt.de(password, 'super-secret-dragon')
      this.SignInWith(login, password)
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
    --splitter-top: 1px solid rgba(255,255,255,0.1);
    --splitter-right: 1px solid rgba(0,0,0,0.1);
    --splitter-bottom: 1px solid rgba(0,0,0,0.1);
    --splitter-left: 1px solid rgba(255,255,255,0.1);
  }
  body {
    margin: 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--color-E);
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
    border-bottom: var(--splitter-bottom);
  }
  .menu .item:not(.profile) {
    border-top: var(--splitter-top);
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
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  .menu .signin > * {
    margin-top: 5px;
  }
  .menu .orregister {
    text-align: center;
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
    width: calc(100% - 40px);
  }
  .modals {
    display: none;
  }
  .custom-file-input:lang(ru)~.custom-file-label::after {
    content: "Выбрать";
  }
</style>
