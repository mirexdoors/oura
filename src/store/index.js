import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Auth from "./modules/auth";
import Sleep from "./modules/sleep";
import Active from "./modules/active";


export const store = new Vuex.Store({
  modules: {
    Auth,
    Sleep,
    Active,
  },
});
