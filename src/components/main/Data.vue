<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" lg="4">
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateFormatted"
                label="Date Start"
                persistent-hint
                @blur="date1 = parseDate(dateFormatted)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date1" no-title @input="menu1 = false"></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" lg="4">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="computedDateFormatted"
                label="Date End"
                persistent-hint
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date2" no-title @input="menu2 = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" lg="4">
          <v-btn
            class="ma-2 center"
            :disabled="getPreloader"
            color="success"
            @click="upload()"
          >Upload</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-layout v-if="getPreloader" row wrap align-center justify-center>
      <v-progress-circular :size="100" :width="10" color="green" indeterminate></v-progress-circular>
    </v-layout>
    <div v-else>{{infoSleep}}</div>
  </div>
</template>

<script>
export default {
  data: vm => ({
    date1: new Date().toISOString().substr(0, 10),
    date2: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
    menu2: false
  }),
  computed: {
    infoSleep() {
      return this.$store.state.Data.infoSleep;
    },
    computedDateFormatted() {
      return this.formatDate(this.date2);
    },
    getPreloader() {
      return this.$store.state.Data.preloader;
    }
  },
  watch: {
    date1() {
      this.dateFormatted = this.formatDate(this.date1);
    },
    date2() {
      this.dateFormatted = this.formatDate(this.date2);
    }
  },
  methods: {
    upload() {
      this.$store.commit("setPreloader", true);
      const start = this.date1;
      const end = this.date2;
      this.$store.dispatch("getSlepInfo", { start, end });
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}-${month}-${day}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
</style>
