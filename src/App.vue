<template>
  <v-app>
    <Main v-if="auth" />
    <Authorization v-else />
  </v-app>
</template>

<script>
import Authorization from "./components/Authorization";
import Main from "./components/main/Main";

export default {
  name: "App",
  data() {
    return {
      auth: false
    };
  },
  methods: {
    getTokenInHref() {
      let token;
      const href = decodeURIComponent(window.location.href);
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
    Main
  }
};
</script>
