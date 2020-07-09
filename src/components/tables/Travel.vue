<template>
    <v-row>
        <v-col>
            <v-card v-if="periods">
                <v-card-title>
                    Travel periods<br>
                </v-card-title>
                <v-data-table
                        :headers="periodHeaders"
                        :items="periods"
                />
            </v-card>
        </v-col>
        <v-col>
            <v-card v-if="items">
                <v-card-title>
                    Travel info
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
        </v-col>

    </v-row>
</template>

<script>
  export default {
    name: "Travel",
    props: {
      items: Array,
      periods: Array,
    },
    data() {
      return {
        search: '',
        periodHeaders: [
          {
            text: 'Timezone',
            value: 'gmt',
            sortable: false,
          },
          {
            text: 'Days in row',
            value: 'row',
            sortable: false,
          },
          {
            text: 'Start date',
            value: 'start',
            sortable: false,
          },
          {
            text: 'End date',
            value: 'end',
            sortable: false,
          },
        ],
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

