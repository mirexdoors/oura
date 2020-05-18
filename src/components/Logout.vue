<template>
  <div>
    <v-btn class="text--primary" rounded @click="logout">Logout</v-btn>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "Logout",
  methods: {
    logout: function() {
      this.$store.commit("saveToken", null);
      Cookies.remove("token_oura");
    }
  }
};
</script>

<style scoped>
</style>
