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
                    class="menu__item"
                    :class="setActiveClass(item.is_active)"
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
            href: '#corr',
            is_active: true,
          },
          {
            title: 'Mean',
            href: '#mean',
            is_active: false,
          },
          {
            title: 'Days of week',
            href: '#week',
            is_active: false,
          },
        ]
      }
    },
    methods: {
      setActiveClass(isActive) {
        return isActive ? 'active' : '';
      },
      changeControls(href) {
        const value = href.replace(/#/g, '');
        for (const control in this.controls) {
          if (this.controls[value] !== this.controls[control]) {
            this.controls[control] = false;
          }
        }
        this.controls[value] = true;
        this.navs.forEach(nav => {
          if (nav.href !== href)
            nav.is_active = false;
          else
            nav.is_active = true;
        });

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
<style scoped>
    .menu__item.active {
        background-color: #356859;
    }

    .menu__item.active .primary--text {
        color: #fff !important;
    }
</style>
