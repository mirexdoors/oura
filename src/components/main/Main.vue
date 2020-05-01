<template>
  <v-card class="main" color="basil">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold display-3 basil--text">OURA</h1>
    </v-card-title>

    <Data />
  </v-card>
</template>

<script>
import Data from "./Data";

export default {
  data() {
    return {
      tab: null,
      items: [
        {
          name: "Sleep",
          to: "/"
        },
        {
          name: "Activity",
          to: "activ"
        }
      ]
    };
  },
  components: {
    Data
  }
};
</script>

<style>
/* Helper classes */
.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
}
.main {
  height: 100%;
}
</style>