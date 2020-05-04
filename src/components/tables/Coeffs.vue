<template>
    <v-card v-if="items.length && !preloader">
        <v-card-title>
            Correlation coeffs
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
    name: "Coeffs",
    props: {
      items: Array,
      preloader: Boolean
    },
    data: () => {
      return {
        search: '',
        headers: [
          {
            text: 'Parameter 1',
            align: 'start',
            sortable: false,
            value: 'name_1',
          },
          {
            text: 'Parameter 2',
            align: 'start',
            sortable: false,
            value: 'name_2',
          },
          {
            text: 'Linear correlation coefficient ',
            value: 'coeff',
            sortable: false,
          },
        ],
      }
    },
    methods: {
      sortByAbs: (items) => {
        items.sort((a, b) => {
          return Math.abs(b['coeff']) - Math.abs(a['coeff']);
        });
        return items;
      }
    },
  }
</script>

<style scoped>

</style>
