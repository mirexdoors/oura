<template>
    <v-card v-if="items">
        <v-card-title>
            Travel
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
                hide-default-header
                hide-default-footer
        />
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
            text: 'Name',
            value: 'name',
            sortable: false,
          },
          {
            text: 'Value',
            value: 'value',
            sortable: false,
          },
        ],
      }
    },
  }
</script>

