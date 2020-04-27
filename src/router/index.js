import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Sleep from "../components/main/Sleep";
import Activity from "../components/main/Activity";

export const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", name: "sleep", component: Sleep },
    { path: "/activ", name: "activ", component: Activity },
  ],
});
