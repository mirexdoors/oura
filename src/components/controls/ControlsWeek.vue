<template>
    <div class="pl-2 pb-8">
        <div class="subtitle-2">{{text}}</div>
        <v-btn min-width="150" rounded color="primary" class="mt-2" dark @click="upload()">
            Get
        </v-btn>
    </div>
</template>

<script>
  export default {
    name: "ControlsWeek",
    data: () => ({
      text: 'Get the  mean of the parameters by day of the week'
    }),
    methods: {
      upload() {
        this.$store.commit("setPreloader", true);
        if (window.innerWidth < 768) {
          this.$emit("changeDrawer", false);
        }
        this.$store.commit("setInfoSleep", null);
        this.$store.commit("setInfoMean", null);
        const start = new Date(2000, 0, 1).toISOString().substr(0, 10);
        const end = new Date().toISOString().substr(0, 10);
        const dates = [];
        dates.push({start, end});
        this.$store.dispatch("getSleepInfo", {dates, param: 'days'});
      }
    },
  }
</script>

<style scoped>

</style>
