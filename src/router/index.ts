import { createRouter, createWebHistory } from 'vue-router'
import FortranInputs from '../views/FortranInputs.vue'
import FortranPlots from '@/views/FortranPlots.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FortranInputs,
    },
    {
      path: '/plots',
      name: 'Graficos',
      component: FortranPlots,
    },
  ],
})

export default router
