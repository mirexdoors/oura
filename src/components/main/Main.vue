<template>
  <v-card color="basil">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold display-3 basil--text">OURA</h1>
    </v-card-title>

    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in items" :key="item.name" :to="item.to">{{ item.name }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item.name">
        <v-card color="basil" flat></v-card>
      </v-tab-item>
    </v-tabs-items>
    <router-view></router-view>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      tab: null,
      items: [
        {
          name: "Sleep",
          to: "/"
        },
        {
          name: "Activity",
          to: "activ"
        }
      ],
    };
  }
};
</script>

<style>
/* Helper classes */
.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
}
</style>