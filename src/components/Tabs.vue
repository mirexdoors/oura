<template>
    <v-tabs v-model="tab"
            background-color="accent-4"
            show-arrows
            :center-active="true"
            centered
            :grow=true
    >
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :href="`#corr`">Сorrelations</v-tab>
        <v-tab :href="`#mean`">Mean</v-tab>
        <v-tab :href="`#week`">Days of week</v-tab>

        <v-tab-item class="pt-8" :value="'corr'">
           <controls-corr  @changeDrawer="setDrawer" />
        </v-tab-item>

        <v-tab-item class="pt-8" :value="'mean'">
        <controls-mean @changeDrawer="setDrawer" />
        </v-tab-item>
        <v-tab-item class="pt-8" :value="'week'">
            <controls-week @changeDrawer="setDrawer" />
        </v-tab-item>
    </v-tabs>
</template>

<script>
  import ControlsCorr from "./controls/ControlsCorr";
  import ControlsMean from "./controls/ControlsMean";
  import ControlsWeek from "./controls/ControlsWeek";
  export default {
    name: "Tabs",
    components: {ControlsWeek, ControlsMean, ControlsCorr},
    data() {
      return {
        tab: null,
      }
    },
    methods: {
      setDrawer() {
        this.$emit("changeDrawer", false);
      },
    },
    component: {
      ControlsCorr,
      ControlsMean,
      ControlsWeek,
    }
  }
</script>

