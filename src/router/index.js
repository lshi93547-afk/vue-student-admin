import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
  {
    path: '/app',
    component: () => import('../views/Layout.vue'),
    children: [
      { path: '', redirect: '/app/students' },
      { path: 'students', name: 'students', component: () => import('../views/student/StudentList.vue') }
    ]
  }
]

const router = createRouter({
  // hash 模式：部署到宝塔/nginx 时不用额外配置 history 回退
  history: createWebHashHistory(),
  routes
})

// 路由守卫：没有 token 就踢回登录页
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (!token && to.path !== '/login') return '/login'
})

export default router
