<template>
    <v-row>
        <v-col cols="12" lg="8">
            <v-data-table
                    v-if="infoSleep && !getPreloader"
                    :headers="headers"
                    :items="infoSleep"
                    :items-per-page="200"
                    :sort-by="'coeff'"
                    :sort-desc="true"
            ></v-data-table>
        </v-col>
    </v-row>
</template>

<script>
  import {dataTableCoeffHelper} from "../../helpers/helper";

  export default {
    name: "Data",
    data() {
      return {
        headers: [
          {
            text: 'Parameter 1',
            align: 'start',
            sortable: false,
            value: 'name_1',
          },
          {
            text: 'Parameter 2',
            align: 'start',
            sortable: false,
            value: 'name_2',
          },
          {
            text: 'Linear correlation coefficient ',
            value: 'coeff',
          },
        ],
        items: [],
      }
    },
    computed: {
      getPreloader: function() {
        return this.$store.state.Data.preloader;
      },
      infoSleep() {
        if (this.$store.state.Data.infoSleep)
          return dataTableCoeffHelper(this.$store.state.Data.infoSleep);
        return false
      },
    },
  };
</script>


