<template>
    <v-card>
        <v-card-title class="headline primary--text">App settings</v-card-title>
        <v-card-text>
            <v-row>
                <v-col class="primary--text">
                    Email:
                </v-col>
                <v-col>
                    {{email}}
                </v-col>
            </v-row>
            <v-row>
                <v-col col="12" class="primary--text">Home location:</v-col>
            </v-row>
            <v-row>
                <v-col col="12" class="mt-n4">
                    <v-autocomplete
                            v-model="country"
                            :items="itemsCountry"
                            placeholder="Start typing to select country"
                            outlined
                            item-text="value"
                            item-value="iso"
                            return-object
                            :search-input.sync="searchCountry"
                    ></v-autocomplete>
                    <v-autocomplete
                            class="mt-n4"
                            v-model="city"
                            :items="itemsCity"
                            placeholder="Start typing to select city"
                            outlined
                            item-text="cityName"
                            item-lat="lat"
                            item-lon="lon"
                            return-object
                            :search-input.sync="searchCity"
                    ></v-autocomplete>
                    {{city}}
                </v-col>
            </v-row>
            <v-row class="mt-n2">
                <v-col class="primary--text">
                    Time zone:
                </v-col>
                <v-col>
                    {{timeZone}}
                </v-col>
            </v-row>
            <v-row>
                <v-col class="primary--text">
                    GMT offset
                </v-col>
                <v-col>
                    {{gmtOffset}}
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer/>
            <v-btn
                    color="darken-1"
                    text
                    @click="close"
            >
                Close
            </v-btn>
            <v-btn
                    class="primary--text"
                    text
                    @click="close"
            >
                save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  import axios from 'axios';
  import {calcOffset} from '../helpers/helper';

  export default {
    name: "settings",
    data: () => ({
      country: '',
      city: '',
      dadataKey: '',
      timeZoneKey: '',
      timeZone: '',
      gmtOffset: '',
      searchCountry: null,
      searchCity: null,
      entriesCountry: [],
      entriesCity: [],
    }),
    mounted() {
      this.dadataKey = this.$store.state.Keys.dadata;
      this.timeZoneKey = this.$store.state.Keys.timeZone;
      this.$store.dispatch('getEmail');
    },
    methods: {
      close() {
        this.$emit("closeSettings", true);
      }
    },
    watch: {
      searchCountry(val) {

        axios.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
            {
              "query": `${val}`,
              language: "en",
              "type": "ADDRESS",
              "from_bound": {"value": "country"},
              "to_bound": {"value": "country"},
              locations: {country: "*"},
            },
            {
              headers:
                  {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Token ${this.dadataKey}`
                  }
            }).then(res => {
          this.entriesCountry = res.data.suggestions;
        })
      },
      searchCity(val) {
        axios.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
            {
              "query": `${val}`,
              language: "en",
              "type": "ADDRESS",
              "from_bound": {"value": "city"},
              "to_bound": {"value": "city"},
              locations: {
                country_iso_code: this.country_iso_code
              },
            },
            {
              headers:
                  {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Token ${this.dadataKey}`
                  }
            }).then(res => {
          this.entriesCity = res.data.suggestions;
        })
      },
      city() {
        if (!this.city) return false;

        const lat = this.city.lat;
        const lon = this.city.lon;
        axios.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=${this.timeZoneKey}&format=json&by=position&lat=${lat}&lng=${lon}`)
            .then(response => {
              this.timeZone = response.data.zoneName;
              this.gmtOffset = calcOffset(response.data.gmtOffset);
            })
      },
    },
    computed: {
      country_iso_code() {
        return this.country ? this.country.iso : '*';
      },
      itemsCountry() {
        return this.entriesCountry.map(entry => {
          return {
            value: entry.value,
            iso: entry.data.country_iso_code
          };
        })
      },
      itemsCity() {
        return this.entriesCity.map(entry => {
          return {
            cityName: entry.data.city,
            lat: entry.data.geo_lat,
            lon: entry.data.geo_lon,
          };
        })
      },
      email() {
        return this.$store.state.Auth.email
      },
    },
  }
</script>
