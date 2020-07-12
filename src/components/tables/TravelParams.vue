<template>
    <v-data-table
            :headers="headers"
            :items="items"
            :calculate-widths="true"
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
