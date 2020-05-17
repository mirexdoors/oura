<template>
  <v-app class="mx-2">
    <div v-if="!globalPreloader">
      <preloader class="mx-auto" v-if="getPreloader" />
      <v-app-bar v-if="isAuth" app>
        <v-toolbar-title class="primary--text">OURA APP</v-toolbar-title>
        <v-row class="d-flex justify-end">
          <v-app-bar-nav-icon class="primary--text" @click.stop="drawer = !drawer" />
        </v-row>
      </v-app-bar>
      <v-navigation-drawer :width="290" v-if="isAuth" v-model="drawer" app class="pa-4">
        <v-tabs v-model="tab" background-color="accent-4">
          <v-tab :href="`#coeff`">Сorrelations</v-tab>
          <v-tab :href="`#mean`">Mean</v-tab>

          <v-tab-item class="pt-8" :value="'coeff'">
            <controls-coeff @changeDrawer="setDrawer" class="pb-4" />
          </v-tab-item>

          <v-tab-item class="pt-8" :value="'mean'">
            <controls-mean @changeDrawer="setDrawer" />
          </v-tab-item>
        </v-tabs>
        <v-divider></v-divider>
        <Logout class="mt-8" />
      </v-navigation-drawer>

      <v-content>
        <v-card-title v-if="!getPreloader" class="text-center justify-center py-6">
          <h1 class="font-weight-bold display-3 primary--text">
            OURA
            <br />APP
          </h1>
        </v-card-title>
        <Data v-if="isAuth" />
        <Authorization class="mx-auto" v-else />
      </v-content>
    </div>
    <div v-else class="my-auto">
      <div class="text-center">
        <v-progress-circular :size="90" :width="10" color="green" indeterminate></v-progress-circular>
      </div>
    </div>
  </v-app>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

import Logout from "./components/Logout";
import Authorization from "./components/Authorization";
import Data from "./components/main/Data";
import ControlsCoeff from "./components/controls/ControlsCoeffs";
import ControlsMean from "./components/controls/ControlsMean";
import preloader from "./components/preloader";

export default {
  name: "App",
  data() {
    return {
      auth: false,
      drawer: true,
      tab: null,
      globalPreloader: true
    };
  },
  computed: {
    isAuth: function() {
      return this.$store.state.Auth.token;
    },
    getPreloader: function() {
      return this.$store.state.Data.preloader;
    }
  },
  methods: {
    setDrawer() {
      this.drawer = !this.drawer;
    },
    getTokenInHref() {
      let token;
      const href = decodeURIComponent(location.href);
      const token_lifetime = this.$store.state.Auth.token_lifetime;

      if (href.includes("access_token")) {
        token = href.split("access_token=")[1].split("&")[0];
        Cookies.set("token_oura", token, { expires: token_lifetime });
      }
      const url = location.origin + "/";
      history.pushState({ page: 1 }, document.title, url);
      return token;
    },
    getToken() {
      let token = Cookies.get("token_oura") || null;
      if (!token) token = this.getTokenInHref();
      const url = location.origin + "/";
      history.pushState({ page: 1 }, document.title, url);
      return token;
    },
    checksTokenEnDecay(token) {
      axios
        .get(`https://api.ouraring.com/v1/userinfo?access_token=${token}`)
        .then(() => {
          if (!this.$store.state.Auth.token)
            this.$store.commit("saveToken", token);
          this.auth = true;
          this.globalPreloader = false;
        })
        .catch(e => {
          console.log(e)
          Cookies.remove("token_oura");
          this.auth = false;
          this.globalPreloader = false;
        });
    }
  },
  mounted() {
    let token = this.getToken();
    if (token) {
      this.checksTokenEnDecay(token);
    } else {
      this.auth = false;
      this.globalPreloader = false;
    }
  },
  components: {
    Authorization,
    Data,
    Logout,
    ControlsCoeff,
    ControlsMean,
    preloader
  }
};
</script>

