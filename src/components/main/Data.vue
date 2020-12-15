<template>
    <v-row>
        <v-col v-if="!getPreloader" cols="12" lg="6" class="pl-lg-6">
            <Coeffs v-if="infoSleep.length" :items="infoSleep"/>
            <Average v-if="infoMean.length" :items="infoMean"/>
        </v-col>
        <v-col v-if="!getPreloader" cols="12" lg="12" class="pl-lg-6">
            <Travel v-if="infoTravel.length" :items="infoTravel" :periods="travelPeriods"/>
        </v-col>
        <v-col v-if="infoDays.length" cols="12" lg="10" class="pl-lg-6">
            <DaysOfWeek :items="infoDays"/>
        </v-col>
        <v-col v-if="infoSearch.length" cols="12" lg="6" class="pl-lg-6">
            <AdvancedSearch :items="infoSearch"/>
        </v-col>
    </v-row>
</template>

<script>
  import Coeffs from "../tables/Coeffs";
  import Average from "../tables/Mean";
  import DaysOfWeek from "../tables/DaysOfWeek";
  import Travel from "../tables/Travel";
  import AdvancedSearch from "../tables/AdvancedSearch";
  import {
    APINames,
    dataTableCoeffHelper,
    dataTableMeanInfo,
    dataTableDaysInfo,
    travelDaysHelper,
    getTravelPeriods
  } from "../../helpers/helper";


  export default {
    name: "Data",
    mounted() {
      this.$store.dispatch('getInfo');
    },
    computed: {
      userInfo() {
        return this.$store.state.Auth.info;
      },

      getPreloader: function () {
        return this.$store.state.Data.preloader;
      },

      infoSleep() {
        if (this.$store.state.Data.infoSleep) {
          return dataTableCoeffHelper(Object.assign({}, this.$store.state.Data.infoSleep));
        } else
          return []
      },

      infoMean() {
        if (this.$store.state.Data.infoMean && this.$store.state.Data.categoryData)
          return dataTableMeanInfo(Object.assign({}, this.$store.state.Data.infoMean),
              Object.assign({}, this.$store.state.Data.categoryData));
        else return [];
      },

      infoDays() {
        if (this.$store.state.Data.infoDays)
          return dataTableDaysInfo(Object.assign({}, this.$store.state.Data.infoDays));
        else return [];
      },

      infoTravel() {
        if (this.$store.state.Data.infoTravel) {
          if (this.userInfo) {
            return travelDaysHelper(JSON.parse(JSON.stringify(this.$store.state.Data.infoTravel)), this.userInfo);
          } else return [];
        } else
          return [];
      },

      travelPeriods() {
        if (this.$store.state.Data.infoTravel) {
          if (this.userInfo) {
            return getTravelPeriods(JSON.parse(JSON.stringify(this.$store.state.Data.infoTravel)));
          } else return [];
        } else
          return [];
      },

      infoSearch() {
        if (this.$store.state.Data.infoSearch && this.$store.state.Data.infoSearchParams) {
          const res = [];
          const params = this.$store.state.Data.infoSearch;
          const apiParams = [];
          for (let sectionName in APINames) {
            const section = {
              name: sectionName,
              values: Object.fromEntries(Object.entries(APINames[sectionName]).map(([key, value]) => [value, key])),
            };
            apiParams.push(section);
          }

          const searchedQueries = this.$store.state.Data.infoSearchParams
              .filter(item => !item.IsDirty)
              .map(item => {
                item.init = apiParams.filter(apiItem => apiItem.values?.[item.parameter]).map(apiValue => {
                  apiValue.value = apiValue.values[item.parameter];
                  delete apiValue.values;
                  return apiValue;
                })[0];
                return item;
              });

          for (let key in params) {
            if (searchedQueries.some(item => item.init.name === key)) {

              res.push(...params[key].reduce((acc, day) => {
                searchedQueries.forEach(query => {
                  const resultDay = {};

                  if (day?.[query.init.value]) {
                    if (day[query.init.value] == query.value) {
                      resultDay.date = day.summary_date;
                      resultDay.dayOfWeek = 'wed';
                      resultDay.searchedValues = day[query.init.value];
                      acc.push(resultDay);
                    }
                  }
                });
                return acc;
              }, []));
            }
          }
          console.log(res);

          return res;
        }
        return [];
      },
    },

    components: {
      Coeffs,
      Average,
      DaysOfWeek,
      Travel,
      AdvancedSearch
    }
  };
</script>


