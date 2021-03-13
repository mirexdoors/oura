import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/Home";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('../views/Terms.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () =>import('../views/Privacy.vue')
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
