import Vue from 'vue'
import Router from 'vue-router'
import Signup from '@/components/pages/Signup'
import User from '@/components/pages/User'

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
    }
  ]
})
