<template>
    <v-row>
        <v-col cols="12" lg="6" class="pl-lg-6" v-if="!getPreloader">
            <Coeffs v-if="infoSleep.length" :items="infoSleep" />
            <Average v-if="infoMean.length" :items="infoMean"/>
        </v-col>
        <v-col cols="12"  lg="10"  class="pl-lg-6"  v-if="infoDays.length">
            <DaysOfWeek :items="infoDays" />
        </v-col>
    </v-row>
</template>

<script>
  import Coeffs from "../tables/Coeffs";
  import Average from "../tables/Mean";
  import DaysOfWeek from "../tables/DaysOfWeek";
  import {dataTableCoeffHelper, dataTableMeanInfo, dataTableDaysInfo} from "../../helpers/helper";

  export default {
    name: "Data",
    computed: {
      getPreloader: function () {
        return this.$store.state.Data.preloader;
      },
      infoSleep() {
        if (this.$store.state.Data.infoSleep) {
          return dataTableCoeffHelper(this.$store.state.Data.infoSleep);
        } else
          return []
      },
      infoMean() {
        if (this.$store.state.Data.infoMean && this.$store.state.Data.categoryData)
          return dataTableMeanInfo(this.$store.state.Data.infoMean, this.$store.state.Data.categoryData);
        else return [];
      },
      infoDays() {
        if (this.$store.state.Data.infoDays)
          return dataTableDaysInfo(this.$store.state.Data.infoDays);
        else return [];
      },
    },
    components: {
      Coeffs,
      Average,
      DaysOfWeek
    }
  };
</script>


