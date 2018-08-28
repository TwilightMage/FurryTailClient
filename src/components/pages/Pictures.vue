<template>
  <div wide class="pan">
    <div class="galery">
      <b-breadcrumb :items="path"></b-breadcrumb>
      <div v-if="page === 0 && id > 0 || page === 1" class="dirs">
        <div v-if="page === 0 && id > 0" @click="OpenMyPictures">Мои изображения</div>
        <div v-if="page === 1 && id > 0" v-for="album in albums" v-bind:key="album.name" @click="OpenAlbum(album)">{{album.name}}</div>
        <div v-if="page === 1 && id > 0" @click="AddAlbum" outlined>Добавить альбом</div>
        <h5 v-if="albums.length === 0 && !me" class="placeholder">{{albumPlaceholder}}</h5>
      </div>
      <separator v-if="page === 0 && id > 0 || page === 1" class="separator-galery" type="vertical"></separator>
      <div class="pictures">
        <div v-for="picture in pictures" v-bind:key="picture.id">{{picture.name}}</div>
        <h5 v-if="pictures.length === 0" class="placeholder">{{picturePlaceholder}}</h5>
      </div>
    </div>
    <separator class="separator-main" v-if="me" type="horizontal"></separator>
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
    ...mapState(['id', 'token']),
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
          text: this.me ? 'Мои изображения' : `Изображения ${this.userName}`,
          to: `/pictures/${this.$route.params.user}`
        })
      }
      if (this.albumName) {
        result.push({
          text: this.albumName,
          to: `/pictures/${this.$route.params.user}/${this.$route.params.album}`
        })
      }
      return result
    },
    page () {
      if (this.$route.params.picture) return 3
      if (this.$route.params.album) return 2
      if (this.$route.params.user) return 1
      return 0
    },
    albumPlaceholder () {
      switch (this.page) {
        case 0:
          return ''
        case 1:
          return `Список альбомов ${this.userName} пуст`
        default:
          return ''
      }
    },
    picturePlaceholder () {
      switch (this.page) {
        case 0:
          return 'Никто пока не загрузил ни одного изображения'
        case 1:
          if (this.me) return 'Вы пока не загрузили ни одного изображения'
          else return `${this.userName} пока не загрузил ни одного изображения`
        case 2:
          return 'Этот альбом пуст'
        default:
          return ''
      }
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
      this.FetchAlbumName()
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
              vue.userName = response.data.data.name
            }
          }).catch(function () {
            this.userName = '<Ошибка загрузки>'
          })
        }
      } else {
        this.userName = null
      }
    },
    FetchAlbumName () {
      // var vue = this
    },
    FetchFileName () {
      // var vue = this
    },
    OpenMyPictures () {
      this.$router.push(`/pictures/${this.id}`)
    },
    AddAlbum () {

    },
    OpenAlbum (album) {

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
      var files = []
      for (var i = 0; i < this.upload.files.length; i++) {
        files.push({tags: this.upload.files[i].tags, src: this.upload.files[i].src, author: this.upload.files[i].author})
      }
      axios.post('api/uploadpictures', {files: files}, {
        onUploadProgress (progress) {
          console.debug(progress)
        }
      }).then(function (response) {

      })
    }
  },
  created () {
    this.Fetch()
  },
  data () {
    return {
      userName: null,
      albumName: null,
      fileName: null,
      userNameCancelToken: null,
      albumNameCancelToken: null,
      fileNameCancelToken: null,
      albums: [],
      pictures: [],
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
  .galery {
    display: flex;
    flex-direction: column;
  }
  .dirs > div {
    width: 200px;
    background: grey;
    border-radius: 0.25rem;
    height: 40px;
    float: left;
    margin: 0 10px 10px 0;
    line-height: 40px;
    text-align: center;
    color: whitesmoke;
    cursor: pointer;
  }
  .dirs > div:hover {
    background: darkgrey;
  }
  .dirs > div[outlined] {
    color: grey;
    line-height: 30px;
    font-weight: bold;
    border: 5px dashed grey;
    background: transparent;
  }
  .dirs > div[outlined]:hover {
    border-color: darkgrey;
    color: darkgrey;
  }
  .separator-galery {
    margin-bottom: 10px;
  }
  .pictures {
    flex-grow: 1;
  }
  .placeholder {
    opacity: 0.5;
    line-height: 40px;
    font-style: italic;
    color: grey;
    font-weight: bold;
    margin-bottom: 10px;
  }
</style>
