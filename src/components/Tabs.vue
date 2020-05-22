<template>
    <div>
        <v-list
                dense
                nav
        >
            <v-list-item
                    v-for="item in navs"
                    :key="item.title"
                    :href="item.href"
                    @click="changeControls(item.href)"
                    link
            >
                <v-list-item-content>
                    <v-list-item-title class="primary--text">{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

        </v-list>

        <controls-corr v-if="controls.corr" @changeDrawer="setDrawer"/>
        <controls-mean v-if="controls.mean" @changeDrawer="setDrawer"/>
        <controls-week v-if="controls.week" @changeDrawer="setDrawer"/>
    </div>
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
        controls: {
          corr: true,
          mean: false,
          week: false,
        },
        navs: [
          {
            title: 'Сorrelations',
            href: '#corr'
          },
          {
            title: 'Mean',
            href: '#mean'
          },
          {
            title: 'Days of week',
            href: '#week'
          },
        ]
      }
    },
    methods: {
      changeControls(href) {
        href = href.replace(/#/g, '');
        for (const control in this.controls) {
          if ( this.controls[href] !== this.controls[control])
          this.controls[control] = false;
        }
        this.controls[href] = true;
      },
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

