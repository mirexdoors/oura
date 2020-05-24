<template>
    <div class="pl-2">
        <div class="subtitle-2">{{text}}</div>
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
                        v-model="date1"
                        label="Date Start"
                        persistent-hint
                        v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker @change="changeInput" v-model="date1" :allowed-dates="allowedDatesStart"  no-title
                           @input="menu1 = false"></v-date-picker>
        </v-menu>
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
                        v-model="date2"
                        label="Date End"
                        persistent-hint
                        readonly
                        v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker v-model="date2"  :allowed-dates="allowedDatesFinish" @change="changeInput" no-title
                           @input="menu2 = false"></v-date-picker>
        </v-menu>

        <v-btn :disabled="isDisabled && (!date1 && !date2)" min-width="150" rounded color="primary" dark
               @click="upload()">
            Submit
        </v-btn>
    </div>
</template>

<script>
    export default {
    name: "ControlsMean",
    data: () => ({
      date1: null,
      date2: null,
      menu1: false,
      menu2: false,
      period: null,
      isDisabled: true,
      text: 'Enter a date range to compare with the data for the entire period.'
    }),
    computed: {
      getPreloader() {
        return this.$store.state.Data.preloader;
      }
    },
    methods: {
      changeInput() {
        if (this.date1 >= this.date2) {
          this.date1 = null;
        }

        if (this.date1 && this.date2) this.isDisabled = false;
      },
      upload() {
        this.isDisabled = true;
        this.$store.commit("setPreloader", true);

        if (window.innerWidth < 768) {
          this.$emit("changeDrawer", false);
        }

        const start = this.date1;
        const lastDate = new Date(this.date2);
        const end = lastDate.toISOString().substr(0, 10);
        const date = new Date();
        const startYear = new Date((date.setFullYear(date.getFullYear() - 2))).toISOString().substr(0, 10);
        const endYear =  new Date().toISOString().substr(0, 10);
        const dates = [];
        dates.push({start, end});
        this.$store.commit("setInfoSleep", null);
        this.$store.commit("setInfoDays", null);
        this.$store.dispatch("getCategoryInfo", {start: startYear, end: endYear});
        this.$store.dispatch("getSleepInfo", {dates, param: 'mean'});
      },
      allowedDatesStart: val => val < new Date().toISOString().substr(0, 10),
      allowedDatesFinish: val => val <= new Date().toISOString().substr(0, 10),
    },
  }
</script>
