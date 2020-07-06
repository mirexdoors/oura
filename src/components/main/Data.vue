<template>
    <v-row>
        <v-col cols="12" lg="6" class="pl-lg-6" v-if="!getPreloader">
            <Coeffs v-if="infoSleep.length" :items="infoSleep"/>
            <Average v-if="infoMean.length" :items="infoMean"/>
            <Travel v-if="infoTravel.length" :items="infoTravel"/>
        </v-col>
        <v-col cols="12" lg="10" class="pl-lg-6" v-if="infoDays.length">
            <DaysOfWeek :items="infoDays"/>
        </v-col>
    </v-row>
</template>

<script>
  import Coeffs from "../tables/Coeffs";
  import Average from "../tables/Mean";
  import DaysOfWeek from "../tables/DaysOfWeek";
  import Travel from "../tables/Travel";
  import {dataTableCoeffHelper, dataTableMeanInfo, dataTableDaysInfo, travelDaysHelper} from "../../helpers/helper";

  export default {
    name: "Data",
    computed: {
      userInfo() {
        return this.$store.state.Auth.info;
      },
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
      infoTravel() {
        if (this.$store.state.Data.infoTravel) {
          if (this.userInfo) {
            return travelDaysHelper(this.$store.state.Data.infoTravel, this.userInfo);
          }
          else return [];
        } else
          return [];
      },
    },
    components: {
      Coeffs,
      Average,
      DaysOfWeek,
      Travel
    }
  };
</script>


