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
                            :search-input.sync="searchCity"
                    ></v-autocomplete>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="primary--text">
                    Timezone:
                </v-col>
                <v-col>
                    under construction
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

  export default {
    name: "settings",
    data: () => ({
      country: '',
      city: '',
      searchCountry: null,
      searchCity: null,
      entriesCountry: [],
      entriesCity: [],
    }),
    mounted() {
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
                    "Authorization": "Token 3de36a91f7aef570339858f9f9bb4c09e2be5efc"
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
                    "Authorization": "Token 3de36a91f7aef570339858f9f9bb4c09e2be5efc"
                  }
            }).then(res => {
          this.entriesCity = res.data.suggestions;
        })
      }
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
          return entry.data.city;
        })
      },
      email() {
        return this.$store.state.Auth.email
      }
    },
  }
</script>
