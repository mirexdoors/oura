<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" lg="6">
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
                label="Date"
                hint="MM/DD/YYYY format"
                persistent-hint
                @blur="date1 = parseDate(dateFormatted)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date1" no-title @input="menu1 = false"></v-date-picker>
          </v-menu>
          <p>
            Date in ISO format:
            <strong>{{ date1 }}</strong>
          </p>
        </v-col>

        <v-col cols="12" lg="6">
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
                label="Date (read only text field)"
                hint="MM/DD/YYYY format"
                persistent-hint
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date2" no-title @input="menu2 = false"></v-date-picker>
          </v-menu>
          <p>
            Date in ISO format:
            <strong>{{ date2 }}</strong>
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-btn class="ma-2 center" :loading="loading" :disabled="loading" color="success" @click="upload()">
      Custom Loader
      <template v-slot:loader>
        <span>Loading...</span>
      </template>
    </v-btn>
    <div>{{infoSleep}}</div>
  </div>
</template>

<script>
// import { mapState } from "vuex";

export default {
  data: vm => ({
    date1: new Date().toISOString().substr(0, 10),
    date2: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
    menu2: false,
    loader: null,
    loading: false
  }),
  computed: {
    infoSleep() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      if (this.$store.state.Sleep.infoSleep) this.loading = false;
      return this.$store.state.Sleep.infoSleep;
    },
    computedDateFormatted() {
      return this.formatDate(this.date2);
    }
  },
  watch: {
    date1() {
      this.dateFormatted = this.formatDate(this.date1);
    },
    date2() {
      this.dateFormatted = this.formatDate(this.date2);
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    }
  },
  methods: {
    upload() {
      this.loading = true;
      const start = this.date1;
      const end = this.date2;
      this.$store.dispatch("getSlepInfo", { start, end });
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
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
