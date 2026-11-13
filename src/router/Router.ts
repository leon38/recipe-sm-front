import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '../layouts/DefaultLayout.vue'

import Home from '../pages/Home.vue'
import RecipeListPage from '../pages/RecipeListPage.vue'
import RecipeDetailsPage from '../pages/RecipeDetailsPage.vue'
import ImportRecipePage from '../pages/ImportRecipePage.vue'
import AuthPage from '../pages/AuthPage.vue'
import Journal from '../pages/Journal.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          component: Home,
        },
        {
          path: 'recettes',
          component: RecipeListPage,
        },
        {
          path: 'recettes/import',
          component: ImportRecipePage,
          meta: { requiresAuth: true },
        },
        {
          path: 'recettes/:id',
          component: RecipeDetailsPage,
          props: true,
        },
        {
          path: 'journal',
          component: Journal,
        }
      ],
    },
    {
      path: '/auth',
      component: AuthPage,
    },
  ],
})

router.beforeEach((to) => {
  if (to.matched.some(record => (record.meta as any)?.requiresAuth)) {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return { path: '/auth', query: { redirect: to.fullPath } }
    }    
    return true 
  }
  return true 
})

export default router