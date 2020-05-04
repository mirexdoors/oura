<template>
    <div class="pl-2">
        <v-select
                :items="items"
                v-model="parameter"
                @change="changeInput"
                label="Choose parameter"
                dense
                outlined
        ></v-select>
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

        <v-btn :disabled="isDisabled" min-width="150" rounded color="primary" dark @click="upload()">
            Submit
        </v-btn>
    </div>
</template>

<script>
    import {getParameters} from '../../helpers/helper';

  export default {
    name: "ControlsAverage",
    data: () => ({
      items: getParameters(),
      date1: null,
      date2: null,
      parameter: null,
      menu1: false,
      menu2: false,
      period: null,
      isDisabled: true,
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

        if (this.date1 && this.date2 && this.parameter) this.isDisabled = false;
      },
      upload() {
        this.isDisabled = true;
        this.$store.commit("setPreloader", true);

        if (window.innerWidth < 768) {
          this.$emit("changeDrawer", false);
        }

        const start = this.date1;
        const lastDate = new Date(this.date2);
        const end = new Date(lastDate.setDate(lastDate.getDate() + 1)).toISOString().substr(0, 10);
        const parameter = this.parameter;
        const date = new Date();
        const startYear = new Date((date.setFullYear(date.getFullYear() - 1))).toISOString().substr(0, 10);
        const endYear =  new Date().toISOString().substr(0, 10);

        this.$store.dispatch("getCategoryInfo", {start: startYear, end: endYear});
        this.$store.dispatch("getAverageInfo", {start, end, parameter});
      },
      allowedDatesStart: val => val < new Date().toISOString().substr(0, 10),
      allowedDatesFinish: val => val <= new Date().toISOString().substr(0, 10),
    },
  }
</script>
