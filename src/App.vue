<template>
    <v-app class="mx-2">
        <div v-if="!globalPreloader">
            <preloader class="mx-auto" v-if="getPreloader"/>
            <v-app-bar v-if="isAuth" app>
                <v-row class="d-flex justify-space-between">
                    <v-app-bar-nav-icon class="primary--text" @click.stop="drawer = !drawer"/>
                    <v-toolbar-title class="primary--text d-flex align-center">
                        <a class="text-decoration-none" target="_blank"
                           href="https://vllesh.medium.com/healthboard-tech-user-manual-5d075d46c408"><span
                                class="text-decoration-underline">
                            READ USER MANUAL</span> &#128214;</a>
                    </v-toolbar-title>

                    <v-icon class="primary--text mr-6" @click.stop="isOpenSettings = !isOpenSettings">settings</v-icon>

                    <v-dialog
                            v-model="isOpenSettings"
                            max-width="300"
                    >
                        <settings @closeSettings="isOpenSettings = false"/>

                    </v-dialog>
                </v-row>
            </v-app-bar>
            <v-navigation-drawer v-if="isAuth" :width="350" v-model="drawer" app class="pa-4 nav-drawer">
                <Tabs @changeDrawer="setDrawer"/>
                <v-divider></v-divider>
                <Logout class="my-4"/>
            </v-navigation-drawer>

            <v-main>
                <v-card-title v-if="!getPreloader" class="text-center justify-center py-6">
                    <h1 class="font-weight-bold display-3 primary--text text-break px-2">
                        Health Board
                    </h1>
                </v-card-title>
                <Data v-if="isAuth"/>
                <Authorization class="mx-auto" v-else/>
            </v-main>
        </div>
        <div v-else class="my-auto">
            <Preloader class="mx-auto"/>
        </div>
    </v-app>
</template>

<script>
  import Cookies from "js-cookie";
  import axios from "axios";

  import Logout from "./components/Logout";
  import Authorization from "./components/Authorization";
  import Data from "./components/main/Data";
  import Tabs from "./components/Tabs";
  import Settings from './components/settings';
  import Preloader from "./components/Preloader";

  export default {
    name: "App",
    data() {
      return {
        auth: false,
        drawer: true,
        globalPreloader: true,
        isOpenSettings: false,
      };
    },
    computed: {
      isAuth: function () {
        return this.$store.state.Auth.token;
      },
      getPreloader: function () {
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
          Cookies.set("token_oura", token, {expires: token_lifetime});
        }
        const url = location.origin + "/";
        history.pushState({page: 1}, document.title, url);
        return token;
      },

      getToken() {
        let token = Cookies.get("token_oura") || null;
        if (!token) token = this.getTokenInHref();
        const url = location.origin + "/";
        history.pushState({page: 1}, document.title, url);
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
              const codeError = new Error(e);
              if (codeError.message.includes(401)) {
                Cookies.remove("token_oura");
                this.auth = false;
                this.globalPreloader = false;
              }
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
      Tabs,
      Preloader,
      Settings
    }
  };
</script>

<style>
    @media screen and (min-width: 991px) {
        .v-navigation-drawer__content {
            overflow-y: scroll !important;
        }

        ::-webkit-scrollbar-track {
            background: transparent
        }

        ::-webkit-scrollbar {
            position: absolute;
            width: 8px;
            z-index: 1000;
            background-color: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 3px;
            border: 1px solid #fff;
        }
    }

    .theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
        background-color: #ccc !important;
    }
</style>
