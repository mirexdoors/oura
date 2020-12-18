<template>
    <v-icon @click="logout">logout</v-icon>
</template>

<script>
import Cookies from "js-cookie";

export default {
    name: "Logout",
    methods: {
        logout: function () {
            this.$store.commit("saveToken", null);
            Cookies.remove("token_oura");
        }
    }
};
</script>
