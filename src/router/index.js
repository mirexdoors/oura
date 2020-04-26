import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Authorization from "../components/Authorization";
import Main from "../components/main/Main";

export const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Authorization,
    },
    {
      path: "/main",
      component: Main,
    },
  ],
});
