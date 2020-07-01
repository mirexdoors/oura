<template>
    <v-card v-if="items">
        <h1>Under construction</h1>
<!--        <v-card-title>-->
<!--            Travel<br> (Under construction)-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-text-field-->
<!--                    v-model="search"-->
<!--                    append-icon="mdi-magnify"-->
<!--                    label="Search"-->
<!--                    single-line-->
<!--                    hide-details-->
<!--            ></v-text-field>-->
<!--        </v-card-title>-->
<!--        <v-data-table-->
<!--                :headers="headers"-->
<!--                :items="items"-->
<!--                :items-per-page="10"-->
<!--                :search="search"-->
<!--        />-->
    </v-card>
</template>

<script>
  export default {
    name: "Travel",
    props: {
      items: Array,
    },
    data() {
      return {
        search: '',
        headers: [
          {
            text: 'The number of days in the native time zone (including DST)',
            value: 'native_count',
            sortable: false,
          },
          {
            text: 'Number of days outside your home time zone (amount)',
            sortable: false,
            value: 'outside_count',
          },
          {
            text: 'Number of days by time zone',
            sortable: false,
            value: 'tz_count',
          },
        ],
      }
    },
  }
</script>

