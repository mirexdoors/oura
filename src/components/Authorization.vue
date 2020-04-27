<template>
  <v-card class="mx-auto my-auto" max-width="344" outlined>
    <v-container>
      <v-card-text>Welcome to the app to control your dream. To work, you will need to register at https://cloud.ouraring.com/. If you already have an account, click on the link below.</v-card-text>
      <a
        :href="url"
      >Sign In</a>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data(){
    return {
      url: '',
    }
  },
  mounted(){
    this.url = `https://cloud.ouraring.com/oauth/authorize?client_id=${this.$store.state.Auth.client_id}&state=XXX&response_type=token`;
  }
};
</script>