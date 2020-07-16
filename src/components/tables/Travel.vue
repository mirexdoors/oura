<template>
    <v-row>
        <v-col>
            <v-card v-if="periods">
                <v-card-title>
                    Travel periods
                    <v-btn class="mt-3 mt-lg-0 ml-0 ml-lg-3" @click="showParameters" min-width="150"
                           rounded
                           color="primary"
                           dark
                           :disabled="isBtnParamsDisabled"
                    >
                        Get parameters by time zone
                </v-btn>
                </v-card-title>
                <v-data-table
                        :headers="periodHeaders"
                        :items="periods"
                />
            </v-card>
        </v-col>
        <v-col>
            <v-card v-if="items">
                <v-card-title>
                    Travel info
                </v-card-title>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-default-header
                        hide-default-footer
                />
            </v-card>
        </v-col>
        <v-col id="params" cols="12" lg=12>
            <v-card v-if="isTmpParameters">
                <TravelParams :items="parameters.items"  :headers="parameters.headers" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
  import * as easings from 'vuetify/es5/services/goto/easing-patterns';
  import {getPeriodsForParams, getMeanParamsForTimeZone} from '../../helpers/helper';

  import TravelParams from "./TravelParams";
  export default {
    name: "Travel",
    props: {
      items: Array,
      periods: Array,
    },
    data() {
      return {
        isTmpParameters: false,
        easing: 'easeInOutCubic',
        easings: Object.keys(easings),
        isBtnParamsDisabled: false,
        parameters: {
          headers: [
            {
              text: 'Parameter',
              value: 'param',
              sortable: false,
            },
            {
              text: 'Home Mean +-SD',
              value: 'home_mean',
              sortable: false,
            },
            {
              text: 'Away Mean +- SD',
              value: 'away_mean',
              sortable: false,
            },
          ],
          items: []
        },
        periodHeaders: [
          {
            text: 'Timezone',
            value: 'gmt',
            sortable: false,
          },
          {
            text: 'Days in row',
            value: 'row',
            sortable: false,
          },
          {
            text: 'Start date',
            value: 'start',
            sortable: false,
          },
          {
            text: 'End date',
            value: 'end',
            sortable: false,
          },
        ],
        headers: [
          {
            text: 'Name',
            value: 'name',
            sortable: false,
          },
          {
            text: 'Value',
            value: 'value',
            sortable: false,
          },
        ],
      }
    },
    methods: {
      showParameters() {
        this.isTmpParameters = true;
        const paramsInfo = Object.assign({}, this.$store.state.Data.infoTravel);
        const timezone = this.$store.state.Auth.info.gtmOffset;
        this.parameters.headers =  this.parameters.headers.concat(getPeriodsForParams(this.periods))
        this.parameters.items = getMeanParamsForTimeZone(paramsInfo, timezone, this.periods);
        this.$vuetify.goTo('#params');
        this.isBtnParamsDisabled = true;
      }
    },
    components: {TravelParams}
  }
</script>

