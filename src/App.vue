<template>
    <v-app class="mx-2">
        <preloader class="mx-auto" v-if="getPreloader"/>
        <v-app-bar v-if="isAuth" app>
            <v-toolbar-title class="primary--text">OURA APP</v-toolbar-title>
            <v-row class="d-flex justify-end">
                <v-app-bar-nav-icon class="primary--text" @click.stop="drawer = !drawer"/>
            </v-row>
        </v-app-bar>
        <v-navigation-drawer :width="290" v-if="isAuth" v-model="drawer" app class="pa-4">
            <v-tabs
                    v-model="tab"
                    background-color="accent-4"
            >
                <v-tab
                        :href="`#coeff`"
                >
                    Сorrelations
                </v-tab>
                <v-tab
                        :href="`#average`"
                >
                    Mean
                </v-tab>

                <v-tab-item
                        class="pt-8"
                        :value="'coeff'"
                >
                    <controls-coeff @changeDrawer="setDrawer" class="pb-4"/>
                </v-tab-item>

                <v-tab-item
                        class="pt-8"
                        :value="'average'"
                >
                    <controls-average  @changeDrawer="setDrawer"></controls-average>
                </v-tab-item>
            </v-tabs>
            <v-divider></v-divider>
            <Logout class="mt-8"/>
        </v-navigation-drawer>

        <v-content>
            <v-card-title v-if="!getPreloader" class="text-center justify-center py-6">
                <h1 class="font-weight-bold display-3 primary--text">OURA<br> APP</h1>
            </v-card-title>
            <Data v-if="isAuth"/>
            <Authorization class="mx-auto" v-else/>
        </v-content>
    </v-app>
</template>

<script>
  import Logout from "./components/Logout";
  import Authorization from "./components/Authorization";
  import Data from "./components/main/Data";
  import ControlsCoeff from "./components/controls/ControlsCoeffs";
  import ControlsAverage from "./components/controls/ControlsAverage";
  import preloader from "./components/preloader";

  export default {
    name: "App",
    data() {
      return {
        auth: false,
        drawer: true,
        tab: null,
      };
    },
    computed: {
      isAuth: function () {
        return this.$store.state.Auth.token
      },
      getPreloader: function () {
        return this.$store.state.Data.preloader;
      },
    },
    methods: {
      setDrawer() {
        this.drawer = !this.drawer;
      },
      getTokenInHref() {
        let token;
        const href = decodeURIComponent(location.href);
        if (href.includes("access_token")) {
          token = href.split("access_token=")[1].split("&")[0];
          sessionStorage.setItem("token", token);
        }
        const url = location.origin + '/';
        history.pushState({page: 1}, document.title, url);
        return token;
      },
      getToken() {
        let token = sessionStorage.getItem("token") || null;
        if (!token) token = this.getTokenInHref();
        const url = location.origin + '/';
        history.pushState({page: 1}, document.title, url);
        return token;
      }
    },
    mounted() {
      let token = this.getToken();
      if (token) {
        if (!this.$store.state.Auth.token) this.$store.commit("saveToken", token);
        this.auth = true;
      } else {
        this.auth = false;
      }
    },
    components: {
      Authorization,
      Data,
      Logout,
      ControlsCoeff,
      ControlsAverage,
      preloader
    }
  };
</script>

