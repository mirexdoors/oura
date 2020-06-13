import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Auth from "./modules/auth";
import Data from "./modules/data";
import Keys from "./modules/keys";


export const store = new Vuex.Store({
  modules: {
    Auth,
    Data,
    Keys,
  },
});
