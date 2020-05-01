<template>
    <v-card class="py-5 text-center" flat>
        <div class="px-4 px-md-0">
          <p>
              Welcome to the app to control your dream.
          </p>
          <p>
          To work, you will need to register at <a href="https://cloud.ouraring.com/">https://cloud.ouraring.com/</a>
          </p>
          <p>
              If you already have an account, click on the link below.
          </p>
        </div>
      <v-card-actions>
        <v-btn min-width="150" rounded color="mx-auto primary" :href="url" dark>Sign In</v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
export default {
  data(){
    return {
      url: '',
    }
  },
  mounted() {
    const parameteres = this.$store.state.Auth.parameteres;
    let url = new URL('https://cloud.ouraring.com/oauth/authorize');
    for (const parameter in parameteres) {
      url.searchParams.set(parameter, parameteres[parameter]);
    }
    this.url = String(url);
  }
};
</script>
