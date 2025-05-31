import { createRouter, createWebHistory } from 'vue-router'
import FortranInputs from '../views/FortranInputs.vue'
import FortranPlots from '@/views/FortranPlots.vue'
import FortranDamage from '@/views/FortranDamage.vue'

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
    {
      path: '/damage-plots',
      name: 'Damage',
      component: FortranDamage,
    },
  ],
})

export default router
