<template>
    <div>
        <v-btn class="text--primary" rounded @click="logout">Logout</v-btn>
    </div>
</template>

<script>
  export default {
    name: "Logout",
    methods: {
      logout: function () {
        this.$store.commit("saveToken", null);
         sessionStorage.removeItem('token');
      }
    },
  }
</script>

<style scoped>

</style>
