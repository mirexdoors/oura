<template>
    <v-card>
        <v-card-title>
            Days of the week
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
                :custom-sort="sortByAbs"
        />
    </v-card>
</template>

<script>
  export default {
    name: "DaysOfWeek",
    props: {
      items: Array,
    },
    data: () => {
      return {
        search: '',
        headers: [
          {
            text: 'Parameter',
            sortable: false,
            value: 'parameter',
          },
          {
            text: 'Sunday',
            value: 'sunday',
            sortable: false,
          },
          {
            text: 'Monday',
            sortable: false,
            value: 'monday',
          },
          {
            text: 'Tuesday',
            value: 'tuesday',
            sortable: false,
          },
          {
            text: 'Wednesday',
            sortable: false,
            value: 'wednesday',
          },
          {
            text: 'Thursday',
            value: 'thursday',
            sortable: false,
          },
          {
            text: 'Friday',
            sortable: false,
            value: 'friday',
          },
          {
            text: 'Saturday',
            value: 'saturday',
            sortable: false,
          },
        ],
      }
    },
  }
</script>

<style scoped>

</style>
