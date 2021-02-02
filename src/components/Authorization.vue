<template>
  <v-card
      flat
      class="py-5 text-center text-lg-h5"
  >

    <div class="px-4 px-md-0">
      <div class="display-2 mb-4 primary--text"> Analyse your sleep.</div>

      <p>
        Sign up at <a target="_blank" href="https://cloud.ouraring.com/">https://cloud.ouraring.com/</a>
      </p>

      <p>
        If you already have an account, click on the link below.
      </p>
    </div>

    <v-card-actions class="d-flex justify-center">
      <v-btn
          min-width="150"
          color="primary"
          :href="url"
          dark
      >
        Sign In
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
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
