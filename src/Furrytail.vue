<template>
  <div class="furrytail">
    <div class="header">
      <div class="profile" :logiedIn="logiedIn">
        <div class="profile_header">
          <img src="" class="profile_photo"/>
          <div class="profile_name">Аноним</div>
        </div>
        <ul v-if="logiedIn" class="profile_actions">
          <li>Профиль</li>
          <li>Настройки</li>
          <li>Помощь</li>
          <separator/>
          <li>Выход</li>
        </ul>
        <div v-else class="profile_offline">
          <!--div class="auth_login">
            <b-form-input block type="email" placeholder="Почта" name="login"></b-form-input>
            <b-form-input block type="password" placeholder="Пароль" name="password"></b-form-input>
            <b-form-checkbox block type="checkbox">Оставаться в сети</b-form-checkbox>
            <b-button block size="sm" variant="primary">Войти</b-button>
          </div>
          <div class="auth_register">
            <b-form-input block v-b-tooltip.html.right v-on:input="auth_register_CheckEmail" :title="auth.register.email_error" :state="auth.register.email_state" type="email" v-model="auth.register.email" placeholder="Почта" name="login"></b-form-input>
            <b-form-input block v-b-tooltip.html.right v-on:input="auth_register_CheckPassword" :title="auth.register.password_error" :state="auth.register.password_state" type="password" v-model="auth.register.password" placeholder="Пароль" name="password"></b-form-input>
            <b-form-input block v-b-tooltip.html.right v-on:input="auth_register_CheckRepassword" :title="auth.register.repassword_error" :state="auth.register.repassword_state" type="password" v-model="auth.register.repassword" placeholder="Повторите пароль" name="repeat_password"></b-form-input>
            <b-form-input block v-b-tooltip.html.right v-on:input="auth_register_CheckNickname" :title="auth.register.nickname_error" :state="auth.register.nickname_state" type="text" v-model="auth.register.nickname" placeholder="Никнейм" name="nickname"></b-form-input>
            <b-form-checkbox block type="checkbox">Я принимаю <b-link v-b-modal.rules>правила сообщества</b-link></b-form-checkbox>
            <b-button block size="sm" variant="primary" v-on:click="auth_register_Go">Зарегистрироваться</b-button>
          </div>
          <div class="auth_loading">

          </div>
          <div class="auth_types">
            <input type="button" class="login_tab" value="Вход" v-on:click="authType = 'login'"/>
            <input type="button" class="register_tab" value="Регистрация" v-on:click="authType = 'register'"/>
          </div-->
          <b-button block size="sm" variant="primary">Войти</b-button>
          <b-button block size="sm" variant="primary">Зарегистрироваться</b-button>
        </div>
      </div>
      <div class="search">
        <div class="search_body">
          <input class="search_input" type="text" name="search_pattern" ref="search_pattern" v-on:submit="GoSearch" placeholder="Метки для поиска..."/>
          <div class="search_go">
            <div>
              <button v-on:click="GoSearch"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex_filler"></div>
      <div class="logo"></div>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
    <div class="modals">
      <b-modal hide-footer size="lg" id="rules" title="Правила сообщества">
        <p>Очень много текста.</p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Furrytail',
  methods: {
    GoSearch: function () {
      axios.post('api/search', {tags: this.$refs.search_pattern.value.split(' ')})
    },
    auth_register_CheckEmail: function () {

    },
    auth_register_CheckPassword: function () {
      this.auth_register_CheckRepassword()
    },
    auth_register_CheckRepassword: function () {
      if (this.auth.register.password === this.auth.register.repassword) {
        this.auth.register.repassword_state = '"true"'
        this.auth.register.repassword_error = ''
      } else {
        this.auth.register.repassword_state = '"false"'
        this.auth.register.repassword_error = 'Пароли не совпадают'
      }
    },
    auth_register_CheckNickname: function () {

    },
    auth_register_Go: function () {
      if (this.auth.register.password === this.auth.register.repassword) {
        var data = {
          email: this.auth.register.email,
          password: this.auth.register.password,
          nickname: this.auth.register.nickname
        }
        axios.post('/api/signup', data).then(function (responce) {
          console.debug(responce)
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  },
  data () {
    return {
      logiedIn: false
    }
  }
}
</script>

<style>
  body {
    margin: 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  separator {
    border: 1px solid;
    border-top-color: rgba(0,0,0,0.11);
    border-right-color: rgba(255,255,255,0.11);
    border-bottom-color: rgba(255,255,255,0.11);
    border-left-color: rgba(0,0,0,0.11);
    flex-grow: 1;
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
  .header {
    z-index: 1000;
    color: whitesmoke;
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0 50px;
    background: #fe4800;
    box-sizing: border-box;
  }
  .profile {
    cursor: default;
    display: flex;
    flex-direction: column;
    position: relative;
    min-width: 310px;
  }
  .profile[logiedIn] {
    min-width: 200px;
  }
  .profile_header {
    padding: 5px;
    display: flex;
    flex-direction: row;
  }
  .profile:hover {
    background: #cb3a00;
  }
  .profile_photo {
    background: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: block;
  }
  .profile_name {
    font-weight: bold;
    margin-left: 5px;
    line-height: 30px;
  }
  .profile:hover .profile_name {
    color: white;
  }
  .profile_actions {
    padding-bottom: 5px;
  }
  .profile_actions, .profile_offline {
    background: #cb3a00;
    position: absolute;
    top: 40px;
    display: none;
    width: 100%;
  }
  .profile:hover .profile_actions, .profile:hover .profile_offline {
    display: block;
  }
  .profile_offline {
    padding: 5px;
  }
  .profile_actions > li {
    cursor: pointer;
  }
  .profile_actions > li:hover {
    background: #ff7943;
    color: white;
  }
  .profile_actions > li::before {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: white;
    vertical-align: middle;
    margin-right: 10px;
    content: ' ';
  }
  .search {
    width: 400px;
    padding: 5px;
    cursor: text;
  }
  .search_body {
    border-radius: 20px;
    height: 30px;
    border: 2px solid;
    background: #cb3a00;
    overflow: hidden;
    border-top-color: rgba(0,0,0,0.11);
    border-right-color: rgba(255,255,255,0.11);
    border-bottom-color: rgba(255,255,255,0.11);
    border-left-color: rgba(0,0,0,0.11);
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
    width: 150px;
    margin: 5px 0;
    background: white;
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
  }
  .panel > div[wide] {
    width: 100%;
  }
  .modals {
    display: none;
  }
</style>
