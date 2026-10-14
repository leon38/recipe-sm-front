import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '../layouts/DefaultLayout.vue'

import RecipeListPage from '../pages/RecipeListPage.vue'
import RecipeDetailsPage from '../pages/RecipeDetailsPage.vue'
import ImportRecipePage from '../pages/ImportRecipePage.vue'
import AuthPage from '../pages/AuthPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          component: RecipeListPage,
        },
        {
          path: 'recipes/import',
          component: ImportRecipePage,
          meta: { requiresAuth: true },
        },
        {
          path: 'recipes/:id',
          component: RecipeDetailsPage,
          props: true,
        },
      ],
    },
    {
      path: '/auth',
      component: AuthPage,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => (record.meta as any)?.requiresAuth)) {
    const token = localStorage.getItem('token')
    console.log(token);
    if (!token) {
      next({ path: '/auth', query: { redirect: to.fullPath } })
      return
    }
  }
  next()
})

export default router