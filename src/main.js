// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Furrytail from './Furrytail'
import router from './router'
import separator from './components/separator'
import fileUpload from './components/fileUpload'
import scrollbox from './components/scrollbox'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEyeSlash, faEye, faImages, faSignInAlt, faSignOutAlt, faMusic, faVideo, faUser, faBug, faNewspaper, faCog, faComment, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add([faEyeSlash, faEye, faImages, faSignInAlt, faSignOutAlt, faMusic, faVideo, faUser, faBug, faNewspaper, faCog, faComment, faTimes])

Vue.component('separator', separator)
Vue.component('file-upload', fileUpload)
Vue.component('scrollbox', scrollbox)

Vue.use(BootstrapVue)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    id: 0,
    token: null
  },
  mutations: {
    signin (state, id, token) {
      state.id = id
      state.token = token
    },
    signout (state) {
      state.id = 0
      state.token = null
    }
  }
})

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#furrytail',
  router,
  store,
  components: { Furrytail },
  template: '<Furrytail/>'
})
