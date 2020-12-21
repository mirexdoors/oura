<template>
	<div>
		<v-tabs show-arrows>
			<v-tab
				v-for="item in navs"
				:key="item.title"
				:href="item.href"
				link
				:class="setActiveClass(item.is_active)"
				class="menu__item"
				@click="changeControls(item.href)"
			>
				<div class="primary--text">{{ item.title }}</div>
			</v-tab>

		</v-tabs>
		<v-col class="py-5"  lg="4">
			<controls-corr v-if="controls.corr"/>
			<controls-mean v-if="controls.mean"/>
			<controls-week v-if="controls.week"/>
			<controls-travel v-if="controls.travel"/>
			<controls-advanced-search v-if="controls.search"/>
		</v-col>
	</div>
</template>

<script>
  import ControlsCorr from "./controls/ControlsCorr";
  import ControlsMean from "./controls/ControlsMean";
  import ControlsWeek from "./controls/ControlsWeek";
  import ControlsTravel from "./controls/ControlsTravel";
  import ControlsAdvancedSearch from "./controls/ControlsAdvancedSearch/ControlsAdvancedSearch";

  export default {
    name: "Tabs",
    components: {ControlsWeek, ControlsMean, ControlsCorr, ControlsTravel, ControlsAdvancedSearch},
    data() {
      return {
        controls: {
          corr: true,
          mean: false,
          week: false,
          travel: false,
          search: false,
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
          {
            title: 'Travel',
            href: '#travel',
            is_active: false,
          },
          {
            title: 'Advanced search',
            href: '#search',
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
          nav.is_active = nav.href === href;
        });
      },
    },
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
