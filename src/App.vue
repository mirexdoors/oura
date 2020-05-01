<template>
    <v-app class="mx-2">
        <v-app-bar  v-if="isAuth" app>
          <v-toolbar-title class="primary--text">OURA APP</v-toolbar-title>
            <v-row class="d-flex justify-end">
                <v-app-bar-nav-icon class="primary--text" @click.stop="drawer = !drawer" />
            </v-row>
        </v-app-bar>
        <v-navigation-drawer v-if="isAuth" v-model="drawer" app>
            <Logout/>
        </v-navigation-drawer>

        <v-content class="main mx-auto">
            <v-card-title class="text-center justify-center py-6">
                <h1 class="font-weight-bold display-3 primary--text">OURA<br> APP</h1>
            </v-card-title>
            <Data v-if="isAuth"/>
            <Authorization v-else/>
        </v-content>
    </v-app>
</template>

<script>
  import Logout from "./components/Logout";
  import Authorization from "./components/Authorization";
  import Data from "./components/main/Data";

  export default {
    name: "App",
    data() {
      return {
        auth: false,
        drawer: false
      };
    },
    computed: {
      isAuth: function(){ return  this.$store.state.Auth.token}
    },
    methods: {
      getTokenInHref() {
        let token;
        const href = decodeURIComponent(location.href);
        if (href.includes("access_token")) {
          token = href.split("access_token=")[1].split("&")[0];
          sessionStorage.setItem("token", token);
        }
        return token;
      },
      getToken() {
        let token = sessionStorage.getItem("token") || null;
        if (!token) token = this.getTokenInHref();
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
      Logout
    }
  };
</script>

