<template>
    <v-row>
        <v-col cols="12" lg="6" v-if="infoSleep" class="pl-lg-6">
            <Coeffs :items="infoSleep" :preloader="getPreloader"/>
        </v-col>
        <v-col cols="12" lg="6" class="pl-lg-6" v-if="infoMean">
            <Average :items="infoMean" />
        </v-col>
    </v-row>
</template>

<script>
  import Coeffs from "../tables/Coeffs";
  import Average from "../tables/Mean";
  import {dataTableCoeffHelper, dataTableMeanInfo} from "../../helpers/helper";

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
          return false
      },
      infoMean() {
        if (this.$store.state.Data.infoMean && this.$store.state.Data.categoryData)
          return dataTableMeanInfo(this.$store.state.Data.infoMean, this.$store.state.Data.categoryData);
        else return false;
      }
    },
    components: {
      Coeffs,
      Average
    }
  };
</script>


