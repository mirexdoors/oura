<template>
    <div class="pl-2 pb-4 pr-2">
        <div class="subtitle-2">{{text}}</div>
        <v-switch
                :label="switchType ? 'Custom' : 'Range'"
                v-model="switchType"
        ></v-switch>
        <div v-if="!switchType">
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
                <v-date-picker @change="changeInput" v-model="date1" :allowed-dates="allowedDatesStart" no-title
                               @input="menu1 = false"></v-date-picker>
            </v-menu>
            <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="300px"
                    min-width="300px"
            >
                <template v-slot:activator="{ on }">
                    <v-text-field
                            v-model="date2"
                            label="Date End"
                            persistent-hint
                            readonly
                            v-on="on"
                   />
                </template>
                <v-date-picker v-model="date2" :allowed-dates="allowedDatesFinish" @change="changeInput" no-title
                               @input="menu2 = false" />
            </v-menu>
        </div>
        <div v-else>

            <v-dialog
                   ref="dialog"
                   v-for="(menu, index) in customMenu"
                   :key="index"
                    v-model="modal[index]"
                    :return-value.sync="menu.input"
                    width="300px"
            >
                <template v-slot:activator="{ on }">
                    <v-text-field
                            v-model="menu.inputFormatted"
                            label="Date"
                            :append-icon="(index === customMenu.length - 1 && customMenu.length > 1) ?
                            'mdi-close-circle-outline' : ''"
                            :append-outer-icon="(index === customMenu.length - 1) ? 'mdi-plus-thick' : 'mdi-close-circle-outline'"
                            @click:append-outer="manageInput(index)"
                            @click:append="manageInput(index, true)"
                            v-on="on"
                    />
                </template>

                <v-date-picker v-model="menu.input" :allowed-dates="allowedDatesCustom"
                               @input="changeCustomDate(index)" scrollable range>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal[index] = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog[index].save(menu.input)">OK</v-btn>
                </v-date-picker>
            </v-dialog>
        </div>

        <v-btn :disabled="isDisabled" min-width="150" rounded
               color="primary" dark
               @click="upload()">
            Get
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
      modal: [false],
      menu2: false,
      period: null,
      customMenu: [
        {isActive: false, input: [], inputFormatted: ''}
      ],
      switchType: false,
      isDisabled: true,
      text: 'Enter a date range or select custom dates to compare with the data for the entire period.'
    }),
    computed: {
      getPreloader() {
        return this.$store.state.Data.preloader;
      }
    },
    methods: {
      save(date) {
        this.$refs.dialog.save(date);
      },
      manageInput(index, isHardDel = false) {
        if (index === this.customMenu.length - 1 && !isHardDel) {
          this.customMenu.push({
            isActive: false,
            input: [],
            inputFormatted: ''
          });
          this.modal.push(false);
        } else {
          this.customMenu.splice(index, 1);
          this.modal.splice(index, 1);
        }
      },
      changeInput() {
        if (this.date1 >= this.date2) {
          this.date1 = null;
        }

        if (this.date1 && this.date2) this.isDisabled = false;
      },
      changeCustomDate(index) {
        this.customMenu[index].inputFormatted = this.customMenu[index].input.join(' — ');
        let date = this.customMenu[index].input;
        if (new Date(date[0]) > new Date(date[1])) {
          const start = date[1];
          const end = date[0];

          this.customMenu[index].input[0] = start;
          this.customMenu[index].input[1] = end;
        }

        if (this.customMenu[index].input[0]) this.isDisabled = false;
      },
      upload() {

        this.$store.commit("setPreloader", true);

        if (window.innerWidth < 768) {
          this.$emit("changeDrawer", false);
        }

        const dates = this.switchType ? this.getCustomDate() : this.getRangeDate();
        const yearDate = this.getYearDate();

        if (!dates.length) return this.$store.commit("setPreloader", false);

        this.$store.commit("setInfoSleep", null);
        this.$store.commit("setInfoDays", null);
        this.$store.commit("setInfoMean", null);
        this.$store.commit("setInfoTravel", null);

        this.$store.dispatch("getCategoryInfo", yearDate);
        this.$store.dispatch("getSleepInfo", {dates, param: 'mean'});
      },
      getRangeDate() {
        const start = this.date1;
        const lastDate = new Date(this.date2);
        const end = lastDate.toISOString().substr(0, 10);
        return [{start, end}];
      },
      getCustomDate() {
        let dates = [];
        this.customMenu.forEach(date => {
          dates = dates.concat(this.getDatesForArray(dates, date.input[0], date.input[1]));
        });
        return dates;
      },
      getDatesForArray(dates, startDate, endDate) {
        if (!startDate) return [];
        let start = startDate;
        let end;
        end = endDate ? endDate : startDate;
        return [{start, end}];
      },
      getYearDate() {
        const date = new Date();
        const startYear = new Date((date.setFullYear(date.getFullYear() - 5))).toISOString().substr(0, 10);
        const endYear = new Date().toISOString().substr(0, 10);
        return {start: startYear, end: endYear};
      },
      allowedDatesStart: val => val < new Date().toISOString().substr(0, 10),
      allowedDatesFinish: val => val <= new Date().toISOString().substr(0, 10),
      allowedDatesCustom(val) {
        let flagDate = true;
        if (this.customMenu.length <= 1) {
          flagDate = val <= new Date().toISOString().substr(0, 10);
        } else {
          this.customMenu.map(date => {
            if (date.input[0]) {
              let start = date.input[0];
              let end = date.input[1] ? date.input[1] : start;
              if (val > new Date().toISOString().substr(0, 10) || (val >= start && val <= end)) flagDate = false;
            }
          });
        }
        return flagDate;
      }
    },
  }
</script>
<style>
    .v-icon.mdi-plus-thick {
        color: #356859 !important;
    }
</style>
