<template>
  <div wide class="pan">
    <div class="galery">
      <b-breadcrumb :items="path"></b-breadcrumb>
    </div>
    <separator class="separator-main" v-if="me" horizontal></separator>
    <div v-if="id > 0" v-show="me" class="upload">
      <h4>Загрузить изображения</h4>
      <div class="files">
        <div v-for="file in upload.files" v-bind:key="file.name">
          <file-upload :file="file" v-on:delete="Unload(file)" v-on:push-tags="PushTags" v-on:push-src="PushSrc" v-on:push-author="PushAuthor" v-on:loaded="OnLoaded(file)"></file-upload>
        </div>
      </div>
      <b-form-file v-model="upload.browse" accept="image/*" class="selection" multiple placeholder="Выберите изображения" @input="PutFiles"></b-form-file>
      <b-button block :disabled="upload.files.length === 0 && AllLoaded" variant="primary" @click="Upload">Загрузить</b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {mapState} from 'vuex'

export default {
  name: 'Pictures',
  computed: {
    ...mapState(['id']),
    me () {
      return this.$route.params.user === String(this.id)
    },
    path () {
      var result = [{
        text: 'Все изображения',
        to: '/pictures'
      }]
      if (this.userName) {
        result.push({
          text: this.userName,
          to: `/pictures/${this.$route.params.user}`
        })
      }
      if (this.collectionName) {
        result.push({
          text: this.collectionName,
          to: `/pictures/${this.$route.params.user}/${this.$route.params.collection}`
        })
      }
      return result
    },
    AllLoaded () {
      for (var i = 0; i < this.upload.files.length; i++) {
        if (!this.upload.files[i].loaded) return false
      }
      return true
    }
  },
  watch: {
    '$route' () {
      this.Fetch()
    },
    me () {
      this.FetchUserName()
    }
  },
  methods: {
    Fetch () {
      this.FetchUserName()
      this.FetchCollectionName()
      this.FetchFileName()
    },
    FetchUserName () {
      if (this.userNameCancelToken) this.userNameCancelToken()
      var vue = this
      this.userName = '<Загрузка>'
      if (this.$route.params.user) {
        if (this.me) {
          this.userName = 'Мои изображения'
        } else {
          axios.post('/api/user', {id: this.$route.params.user, short: true}, {
            cancelToken: new axios.CancelToken(function (token) {
              vue.userNameCancelToken = token
            })
          }).then(function (response) {
            if (response.data.success) {
              vue.userName = 'Изображения ' + response.data.data.name
            }
          }).catch(function () {
            this.userName = '<Ошибка загрузки>'
          })
        }
      } else {
        this.userName = null
      }
    },
    FetchCollectionName () {
      // var vue = this
    },
    FetchFileName () {
      // var vue = this
    },
    PutFiles () {
      this.upload.files = this.upload.files.concat(this.upload.browse)
      this.upload.browse.length = 0
    },
    Unload (file) {
      this.upload.files.splice(this.upload.files.indexOf(file), 1)
    },
    PushTags (file, tags) {
      file.tags = tags
    },
    PushSrc (file, src) {
      file.src = src
    },
    PushAuthor (file, author) {
      file.author = author
    },
    OnLoaded (file) {
      file.loaded = true
    },
    Upload () {
    }
  },
  created () {
    this.Fetch()
  },
  data () {
    return {
      userName: null,
      collectionName: null,
      fileName: null,
      userNameCancelToken: null,
      collectionNameCancelToken: null,
      fileNameCancelToken: null,
      upload: {
        browse: [],
        files: []
      }
    }
  }
}
</script>

<style scoped>
  .pan {
    display: flex;
    flex-direction: row;
    max-height: 100%;
  }
  .pan > div:first-child {
    flex-grow: 1;
  }
  .upload {
    width: 400px;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
  }
  .selection {
    margin: 10px 0;
  }
  h4 {
    text-align: center;
    margin-bottom: 25px;
  }
  .files {
    overflow-y: auto;
    max-height: 100%;
  }
  .files > *:not(:last-child) {
    margin-bottom: 10px;
  }
  .separator-main {
    margin-left: 10px;
  }
</style>
