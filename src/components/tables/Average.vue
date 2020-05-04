<template>

        <v-card v-if="items">
            <v-card-title>
                Average data  (+1 day)
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
                    :items-per-page="10"
                    :search="search"
            />
        </v-card>

</template>

<script>
  export default {
    name: "Average",
    props: {
      items: Array,
    },
    data() {
      return {
        search: '',
        headers: [
          {
            text: 'Date',
            align: 'start',
            sortable: false,
            value: 'date',
          },
          {
            text: 'Average for year',
            align: 'start',
            sortable: false,
            value: 'average',
          },
          {
            text: 'Value for date',
            value: 'value',
            sortable: false,
          },
        ],
      }
    },
  }
</script>
