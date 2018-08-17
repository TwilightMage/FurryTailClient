<template>
  <div id="furrytail">
    <div class="header">
      <div class="profile">
        <div class="profile_header">
          <img src="" class="profile_photo"/>
          <div class="profile_name">NightObscure</div>
          <div class="profile_open"></div>
        </div>
        <ul class="profile_actions">
          <li>Профиль</li>
          <li>Настройки</li>
          <li>Помощь</li>
          <separator/>
          <li>Выход</li>
        </ul>
      </div>
      <div class="search">
        <div class="search_body">
          <input class="search_input" type="text" name="search_pattern" ref="search_pattern" v-on:submit="GoSearch" placeholder="Метки для поиска..."/>
          <div class="search_go">
            <div>
              <div v-on:click="GoSearch"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex_filler"></div>
      <div class="logo"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Furrytail',
  methods: {
    GoSearch: function () {
      var tags = this.$refs.search_pattern.value.split(' ')
      axios.post('search', {tags: tags}, null)
    }
  }
}
</script>

<style>
  body {
    margin: 0;
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
  #furrytail {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  .header {
    color: whitesmoke;
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0 20pt;
    background: #fe4800;
    box-sizing: border-box;
  }
  .profile {
    cursor: default;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .profile_header {
    padding: 5pt 10pt;
    display: flex;
    flex-direction: row;
  }
  .profile:hover {
    background: #cb3a00;
  }
  .profile_photo {
    background: white;
    border-radius: 50%;
    width: 20pt;
    height: 20pt;
    display: block;
  }
  .profile_name {
    font-weight: bold;
    margin-left: 3pt;
    line-height: 20pt;
  }
  .profile:hover .profile_name {
    color: white;
  }
  .profile_open {
    display: block;
    margin: 7pt 0 7pt 3pt;
    width: 6pt;
    height: 6pt;
    background: white;
    opacity: 0.5;
    display: none;
  }
  .profile:hover .profile_open {
    opacity: 1;
  }
  .profile_actions {
    background: #cb3a00;
    position: absolute;
    top: 30pt;
    padding: 0 0 3pt 0;
    visibility: collapse;
    width: 100%;
  }
  .profile:hover .profile_actions {
    visibility: visible;
  }
  .profile_actions > li {
    padding: 3pt;
    cursor: pointer;
  }
  .profile_actions > li:hover {
    background: #ff7943;
    color: white;
  }
  .profile_actions > li::before {
    width: 10pt;
    height: 10pt;
    display: inline-block;
    background: white;
    vertical-align: middle;
    margin-right: 5pt;
    content: ' ';
  }
  .search {
    width: 200pt;
    padding: 4pt 5pt;
    cursor: text;
  }
  .search_body {
    border-radius: 10pt;
    height: 20pt;
    border: 1pt solid black;
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
    padding: 0 5pt;
    color: whitesmoke;
    flex-grow: 1;
  }
  .search_go {
    width: 20pt;
    height: 100%;
    display: table;
  }
  .search_go > div {
    display: table-cell;
    vertical-align: middle;
  }
  .search_go > div > div {
    width: 15pt;
    height: 15pt;
    background: whitesmoke;
    cursor: pointer;
    margin: auto;
  }
  .search_go > div > div:hover {
    background: white;
  }
  .flex_filler {
    flex-grow: 1;
  }
  .logo {
    width: 100pt;
    margin: 5pt 0;
    background: white;
  }
</style>
