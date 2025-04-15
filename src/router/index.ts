import { createRouter, createWebHistory } from 'vue-router'
import FortranInputs from '../views/FortranInputs.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FortranInputs,
    },
  ],
})

export default router
