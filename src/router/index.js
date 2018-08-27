import Vue from 'vue'
import Router from 'vue-router'
import Signup from '@/components/pages/Signup'
import User from '@/components/pages/User'
import Pictures from '@/components/pages/Pictures'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User
    },
    {
      path: '/pictures',
      name: 'pictures',
      component: Pictures
    },
    {
      path: '/pictures/:user',
      name: 'user pictures',
      component: Pictures
    }
  ]
})
