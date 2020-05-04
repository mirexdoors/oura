<template>
    <v-row>

        <v-col cols="12" lg="8">
            <v-card>
                <v-card-title>
                   Correlation coeffs
                    <v-spacer></v-spacer>
                    <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                    ></v-text-field>
                </v-card-title>
            <v-data-table
                    v-if="infoSleep && !getPreloader"
                    :headers="headers"
                    :items="infoSleep"
                    :items-per-page="10"
                    :search="search"
                    :custom-sort="sortByAbs"
            />
            </v-card>
        </v-col>

    </v-row>
</template>

<script>
  import {dataTableCoeffHelper} from "../../helpers/helper";

  export default {
    name: "Data",
    data() {
      return {
        search: '',
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
      getPreloader: function () {
        return this.$store.state.Data.preloader;
      },
      infoSleep() {
        if (this.$store.state.Data.infoSleep)
          return dataTableCoeffHelper(this.$store.state.Data.infoSleep);
        return false
      },
    },
    methods: {
      sortByAbs: (items) => {
        items.sort((a, b) => {
          return Math.abs(b['coeff']) - Math.abs(a['coeff']);
        });
        return items;
      }
    },
  };
</script>


