<template>
    <div>
      <div class="head">
        <img src="../../assets/pictures/logo.png" class="avatar">
        <div class="user-info">
          <div class="important">
            <div class="name">{{user.name}}</div>
            <div class="flex_filler"></div>
          </div>
          <div class="description">{{user.description}}</div>
          <div class="user-detailed">
            <table>
              <tr v-if="user.gender != null">
                <td>Пол:</td>
                <td>{{GenderString}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="user-content">

      </div>
    </div>
</template>

<script>
import axios from 'axios'
import {mapState} from 'vuex'

export default {
  name: 'User',
  computed: {
    ...mapState(['id']),
    GenderString () {
      return this.gender ? 'женский' : 'мужской'
    }
  },
  created () {
    var vue = this
    axios.post('api/user', {id: this.id, token: this.$store.state.token}).then(function (response) {
      if (response.data.success) {
        vue.user.name = response.data.data.name
        vue.user.description = response.data.data.description
        vue.user.gender = response.data.data.gender
      }
    })
  },
  data () {
    return {
      user: {
        name: '',
        description: '',
        gender: null
      }
    }
  }
}
</script>

<style scoped>
  .head {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding: 10px;
    margin: -10px -10px 0 -10px;
  }
  .avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 1px solid grey;
  }
  .user-info {
    flex-grow: 1;
    padding-left: 10px;
  }
  .important {
    display: flex;
    flex-direction: row;
    line-height: 50px;
  }
  .name {
    font-size: 35px;
    font-weight: bold;
  }
  .gender {
    margin-left: 10px;
    font-size: 25px;
    float: left;
  }
  .gender > * {
    vertical-align: middle;
  }
  .male {
    color: dodgerblue;
  }
  .female {
    color: deeppink;
  }
  .description {
    font-size: 17px;
    color: grey;
  }
  .description:not(:empty)::before {
    content: '”';
  }
  .description:not(:empty)::after {
    content: '⹂';
  }
  .user-content {
    border-top: 1px solid rgba(100,100,100,0.1);
  }
</style>
