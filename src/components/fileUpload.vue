<template>
  <div>
    <b-progress v-if="progress < 1" :value="progress" :max="1" animated></b-progress>
    <div v-else-if="type === 'image'" class="result picture">
      <div class="frame">
        <img :src="src"/>
        <div class="transition"></div>
      </div>
      <div class="overlay" :focused="focused">
        <div>Объем: {{Math.round(file.size / 1024) + ' KB'}}</div>
        <div>Имя: {{file.name}}</div>
        <div>Размер: {{info.image.width}}x{{info.image.height}}</div>
        <div class="checkbox"><input type="checkbox" v-model="author"> Заявить авторские права</div>
        <div>Метки:</div>
        <textarea class="flex_filler" v-model="tagsInput" @change="PushTags" @focus="focused = true" @blur="focused = false"></textarea>
        <div class="delete" @click="Delete">Удалить</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fileUpload',
  props: {
    file: {
      type: File,
      default: null
    }
  },
  computed: {
    type () {
      if (this.file === null || this.file === undefined) return undefined
      if (this.file.type.match(/^image\/.+$/)) return 'image'
    }
  },
  methods: {
    Upload () {
      this.reader.abort()
      this.reader.readAsDataURL(this.file)
    },
    Delete () {
      this.$emit('delete')
    },
    PushTags () {
      this.$emit('push-tags', this.file, this.tagsInput.split(' '))
    },
    PushSrc () {
      this.$emit('push-src', this.file, this.src)
    },
    PushAuthor () {
      this.$emit('push-author', this.file, this.author)
    },
    CallLoaded () {
      this.$emit('loaded')
    }
  },
  watch: {
    file () {
      this.Upload()
    },
    src () {
      this.PushSrc()
    },
    author () {
      this.PushAuthor()
    }
  },
  created () {
    var vue = this
    this.reader = new FileReader()
    this.reader.onprogress = function (progress) {
      vue.progress = progress.loaded / progress.total
    }
    this.reader.onabort = function (e) {
      vue.progress = 0
    }
    this.reader.onerror = function (e) {
      vue.progress = 0
    }
    this.reader.onload = function (e) {
      vue.progress = 1
      vue.src = vue.reader.result
      vue.CallLoaded()

      vue.info.size = vue.file.size
      vue.info.name = vue.file.name

      if (vue.type === 'image') {
        var image = new Image()
        image.onerror = function () {
          vue.info.image.width = 0
          vue.info.image.height = 0
        }
        image.onload = function () {
          vue.info.image.width = image.width
          vue.info.image.height = image.height
        }
        image.src = vue.src
      }
    }
    if (this.file !== null) {
      this.Upload()
    }
  },
  data () {
    return {
      progress: 0,
      reader: null,
      tagsInput: '',
      focused: false,
      src: '',
      author: false,
      info: {
        image: {
          width: 0,
          height: 0
        }
      }
    }
  }
}
</script>

<style scoped>
  img {
    width: 100%;
  }
  .result {
    border-radius: 0.25rem;
    border: 1px solid grey;
    overflow: hidden;
    position: relative;
    background: black;
  }
  .overlay {
    opacity: 0;
    transition: opacity ease 0.2s;
    background: black;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: mintcream;
    display: flex;
    flex-direction: column;
    padding: 10px;
    font-size: 13px;
  }
  .overlay > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .result:hover > .overlay, .overlay[focused] {
    opacity: 0.75;
  }
  textarea {
    border-radius: 0.25rem;
    border: 1px solid whitesmoke;
    background: transparent;
    color: inherit;
    padding: 0 5px;
    resize: none;
  }
  .picture {
    min-height: 200px;
  }
  .frame {
    position: relative;
  }
  .transition {
    width: 100%;
    height: 20px;
    background: linear-gradient(to bottom, transparent, black);
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .delete {
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
  }
  .delete:hover {
    color: white;
  }
  .checkbox {
    line-height: 1rem;
  }
  .checkbox > input {
    border-radius: 0.25rem;
    border: 3px solid grey;
    transition: border-top-width ease 0.15s, border-right-width ease 0.15s, border-bottom-width ease 0.15s, border-left-width ease 0.15s;
    -webkit-appearance: none;
    -moz-appearance: none;
    box-sizing: border-box;
    height: 1rem;
    width: 1rem;
    vertical-align: middle;
  }
  .checkbox > input:checked {
    border-width: 0.5rem;
  }
</style>
