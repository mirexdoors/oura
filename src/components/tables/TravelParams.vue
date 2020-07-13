<template>
    <v-data-table
            :headers="headers"
            :items="items"
            :calculate-widths="true"
            :items-per-page="7"
            class="paramsTable elevation-1"
    />
</template>

<script>
  export default {
    name: "TravelParams",
    props: {
      items: Array,
      headers: Array,
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
