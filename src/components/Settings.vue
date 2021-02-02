<template>
  <v-card>
    <v-card-title class="headline primary--text">App settings</v-card-title>
    <v-card-text>
      <v-row>
        <v-col class="primary--text">
          Email:
        </v-col>
        <v-col>
          {{ info.email }}
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
              :placeholder="countryPlaceholder ? countryPlaceholder : 'Start typing to select country'"
              outlined
              item-text="value"
              item-value="iso"
              id="countrySelect"
              return-object
              :search-input.sync="searchCountry"
          />

          <v-autocomplete
              class="mt-n4"
              v-model="city"
              id="citySelect"
              :items="itemsCity"
              :placeholder="cityPlaceholder ? cityPlaceholder : 'Start typing to select city'"
              outlined
              item-text="cityName"
              item-lat="lat"
              item-lon="lon"
              return-object
              :search-input.sync="searchCity"
          />

        </v-col>
      </v-row>
      <v-row class="mt-n2">
        <v-col class="primary--text">
          Time zone:
        </v-col>
        <v-col>
          {{ timeZone }}
        </v-col>
      </v-row>
      <v-row>
        <v-col class="primary--text">
          GMT offset
        </v-col>
        <v-col>
          {{ gtmOffset }}
        </v-col>
      </v-row>
      <v-row>
        <v-col class="primary--text">
          DST
        </v-col>
        <v-col>
          {{ dst }}
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
          @click="save"
      >
        save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';
import {calcOffset} from '@/helpers/helper';
import {db} from "@/db";

export default {
  name: "settings",

  data: () => ({
    country: '',
    city: '',
    dadataKey: '',
    timeZoneKey: '',
    cityPlaceholder: '',
    countryPlaceholder: '',
    searchCountry: false,
    searchCity: false,
    entriesCountry: [],
    entriesCity: [],
    isFirstUpdate: true
  }),

  mounted() {
    this.dadataKey = this.$store.state.Keys.dadata;
    this.timeZoneKey = this.$store.state.Keys.timeZone;
    this.$store.dispatch('getInfo');
  },

  updated() {
    this.cityPlaceholder = this.$store.state.Auth.info.city;
    this.countryPlaceholder = this.$store.state.Auth.info.country;
  },

  watch: {
    searchCountry(val) {
      axios.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
          {
            query: `${val}`,
            language: "en",
            type: "ADDRESS",
            from_bound: {"value": "country"},
            to_bound: {"value": "country"},
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

      if (val) {
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
      }
    },
    city() {
      if (!this.city) return false;

      const lat = this.city.lat;
      const lon = this.city.lon;
      axios.get(`https://api.timezonedb.com/v2.1/get-time-zone?key=${this.timeZoneKey}&format=json&by=position&lat=${lat}&lng=${lon}`)
          .then(response => {
            this.$store.commit('updateTimeZone', response.data.zoneName);
            if (response.data.gmtOffset)
              this.$store.commit('updateGmt', calcOffset(response.data.gmtOffset));

            if (response.data.dst)
              this.$store.commit('updateDst', response.data.dst);
          });
    },
  },

  computed: {
    timeZone: {
      get() {
        return this.$store.state.Auth.info.timeZone;
      },
    },
    dst: {
      get() {
        return (this.$store.state.Auth.info.dst === 0 ? 'No' : 'Yes');
      },
    },
    gtmOffset: {
      get() {
        return this.$store.state.Auth.info.gtmOffset;
      },
    },
    info() {
      return this.$store.state.Auth.info;
    },
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
  },

  methods: {
    save() {
      const info = this.$store.state.Auth.info;
      const userMail = info.email;
      db.collection('locations').get().then(querySnapshots => {
        let userDocId = '';
        querySnapshots.forEach(doc => {
          if (doc.data().email === userMail) userDocId = doc.id;
        });

        if (userDocId) {
          db.collection("locations")
              .doc(userDocId)
              .update({
                city: this.city.cityName || '',
                country: this.country.value || '',
                timeZone: this.timeZone || '',
                gtmOffset: this.gtmOffset || '',
                dst: this.dst === 'Yes' ? 1 : 0,
              })
              .then(() => {
                alert('Settings saved successfully!');
                this.$emit("closeSettings", true);
              });
        } else {
          db.collection('locations').add({
            city: this.city.cityName || '',
            country: this.country.value || '',
            timeZone: this.timeZone || '',
            gtmOffset: this.gtmOffset || '',
            dst: this.dst === 'Yes' ? 1 : 0,
            email: userMail,
          })
              .then(() => {
                alert('Settings saved successfully!');
                this.$emit("closeSettings", true);
              })
        }
      });
    },
    close() {
      this.$emit("closeSettings", true);
    }
  },
}
</script>

