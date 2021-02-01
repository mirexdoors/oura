<template>
    <v-card
            color="primary"
    >
        <v-tabs
                show-arrows
                grow
                color="primary"
        >
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

        <v-col class="py-5">
            <controls-corr v-if="controls.corr">
                <section-subtitle>Select a period to explore correlations between the
                    parameters.
                </section-subtitle>
            </controls-corr>

            <controls-mean v-if="controls.mean">
                <section-subtitle>Enter a date range or select custom dates to compare with the
                    data for the entire period.
                </section-subtitle>
            </controls-mean>

            <controls-week v-if="controls.week">
                <section-subtitle>Select a period to get the mean of the parameters by days of the
                    week
                </section-subtitle>
            </controls-week>

            <controls-travel v-if="controls.travel">
                <section-subtitle>Select a period to explore data about your travels</section-subtitle>
            </controls-travel>

            <controls-advanced-search v-if="controls.search">
                <section-subtitle>Select parameter(s) to search. Use "=", ">" and "&lt;" operators to specify
                    required value
                    range
                </section-subtitle>
            </controls-advanced-search>

            <average-of-all-users v-if="controls.average"/>
        </v-col>
    </v-card>
</template>

<script>
    import ControlsCorr from "./controls/ControlsCorr";
    import ControlsMean from "./controls/ControlsMean";
    import ControlsWeek from "./controls/ControlsWeek";
    import ControlsTravel from "./controls/ControlsTravel";
    import ControlsAdvancedSearch from "./controls/ControlsAdvancedSearch/ControlsAdvancedSearch";
    import SectionSubtitle from "../components/SectionSubtitle";
    import AverageOfAllUsers from "./tables/AverageOfAllUsers";
    //TODO перенести управление табами в стору

    export default {
        name: "Tabs",

        components: {
            ControlsWeek,
            ControlsMean,
            ControlsCorr,
            ControlsTravel,
            ControlsAdvancedSearch,
            SectionSubtitle,
            AverageOfAllUsers,
        },

        data() {
            return {
                controls: {
                    corr: true,
                    mean: false,
                    week: false,
                    travel: false,
                    search: false,
                    average: false,
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
                    {
                        title: 'Average of all users',
                        href: '#average',
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

    .v-tabs-slider-wrapper {
        height: 0 !important;
    }

    .theme--light.v-tabs .v-tab--active:hover::before, .theme--light.v-tabs .v-tab--active::before {
        opacity: 0 !important;
    }
</style>
