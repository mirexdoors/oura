<template>
    <v-card>
        <v-card-title>
            Advanced Search
            <v-spacer/>
        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="10"/>
    </v-card>
</template>

<script>
  export default {
    name: "AdvancedSearch",
    props: {
      items: Array,
    },
    data: () => {
      return {
        headers: [
          {
            text: 'Date',
            align: 'start',
            sortable: false,
            value: 'date',
          },
          {
            text: 'Day of the week',
            align: 'start',
            sortable: false,
            value: 'dayOfWeek',
          },
          {
            text: 'Searched parameter values',
            value: 'searchedValues',
            sortable: false,
          },
        ],
      }
    },
  }
</script>

<style scoped>

</style>
