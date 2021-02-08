<template>
  <v-card>
    <v-card-title>
      Average parameters of all users by last year
      <v-spacer/>
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
        :items-per-page="50"
        sort-by="parameter"
        disable-pagination
        hide-default-footer
        class="elevation-1"
    />
  </v-card>
</template>

<script>
import {db} from "@/db";

const notDisplayedFields = [
    'timezone',
];
export default {
  name: "AverageOfAllUsers",

  data() {
    return {
      search: '',
      items: [],
      headers: [
        {
          text: 'Parameter',
          align: 'start',
          sortable: false,
          value: 'parameter',
        },
        {
          text: 'Average value',
          align: 'start',
          sortable: false,
          value: 'value',
        },
      ],
    }
  },

  async mounted() {
    const temporaryData = [];
    await db.collection('parameters').get().then(querySnapshots => {
      querySnapshots.forEach(doc => {
        temporaryData.push(doc.data());
      });
    });

    if (temporaryData.length > 0) {
      this.items = temporaryData.reduce((acc, currentItem) => {
        for (const parameter in currentItem) {
          if (typeof currentItem[parameter] === 'number' && !notDisplayedFields.includes(parameter)) {
            const addedParameterIndex = acc.findIndex(addedItem => addedItem.parameter === parameter);

            if (addedParameterIndex > -1) {
              acc[addedParameterIndex].value += currentItem[parameter];
            } else {
              acc.push({
                parameter,
                value: currentItem[parameter],
              });
            }
          }
        }
        return acc;
      }, [])
          .map(item => {
            return {
              ...item,
              value: Number((item.value / temporaryData.length).toFixed(2)),
            }
          });
    }
  },
}
</script>
