<template>
    <div class="pl-2">
        <v-radio-group v-model="period" v-on:change="setDates" class="radios">
            <v-radio
                    v-for="radio in this.radioButtons"
                    :key="radio['type']"
                    :label="radio['label']"
                    :value="radio['type']"
            ></v-radio>
        </v-radio-group>
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
            <v-date-picker @change="changeDateInput" v-model="date1" :allowed-dates="allowedDatesStart" no-title
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
            <v-date-picker v-model="date2" :allowed-dates="allowedDatesFinish" @change="changeDateInput" no-title
                           @input="menu2 = false"></v-date-picker>
        </v-menu>

        <v-btn :disabled="isDisabled" min-width="150" rounded color="primary" dark @click="upload()">
            Submit
        </v-btn>
    </div>
</template>

<script>
  export default {
    name: "Controls",
    data: () => ({
      date1: null,
      date2: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      isDisabled: true,
      radioButtons: [
        {type: 'week', label: 'Last week'},
        {type: 'year', label: 'Last year'},
      ],
      period: null
    }),
    watch: {
      period: function (val) {
        if (val !== null) {
          this.isDisabled = false
        } else {
          if (this.date1 && this.date2) {
            this.isDisabled = false
          } else {
            this.isDisabled = true;
          }
        }
      }
    },
    computed: {
      getPreloader() {
        return this.$store.state.Data.preloader;
      }
    },
    methods: {
      upload() {
        this.isDisabled = true;
        this.$store.commit("setPreloader", true);

        if (window.innerWidth < 768) {
          this.$emit("changeDrawer", false);
        }
        const start = this.date1;
        const end = this.date2;
        this.$store.dispatch("getSleepInfo", {start, end});
      },
      setDates() {
        const firstDate = new Date();
        switch (this.period) {
          case 'week':
            firstDate.setDate(firstDate.getDate() - 7);
            break;
          case 'year':
            firstDate.setFullYear(firstDate.getFullYear() - 1);
            break;
        }
        this.date1 = firstDate.toISOString().substr(0, 10);
        this.date2 = new Date().toISOString().substr(0, 10);
      },
      allowedDatesStart: val => val < new Date().toISOString().substr(0, 10),
      allowedDatesFinish: val => val <= new Date().toISOString().substr(0, 10),
      changeDateInput() {
        //убираем выбранное значение radio
        this.period = null;
        if (this.date1 >= this.date2) {
          this.date1 = null;
        }

        if (this.date1 && this.date2) {
          this.isDisabled = false;
        }
      }
    },
  }
</script>

<style scoped>
    .v-input--selection-controls {
        margin-top: 0 !important;
    }
</style>
