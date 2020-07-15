<template>
    <v-card>
    <v-card-title>
        Parameters in travels
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
            :headers="headers"
            :items="items"
            :search="search"
            :calculate-widths="true"
            :items-per-page="7"
            class="paramsTable elevation-1"
    />
    </v-card>
</template>

<script>
  export default {
    name: "TravelParams",
    props: {
      items: Array,
      headers: Array,
    },
    data() {
      return {
        search: '',
      }
    },
  }
</script>
<style>
    @media screen and (min-width: 1024px){
        .v-data-table {
            max-width: 100%
        }
        .paramsTable th {
            display: table-cell;
            min-width: 130px;
        }
    }
</style>
