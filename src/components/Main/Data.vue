<template>
    <v-row
            v-if="!getPreloader"
            justify="center"
    >
        <v-col v-if="infoCorrCoeffs.length ">
            <coeffs :items="infoCorrCoeffs"/>
        </v-col>

        <v-col v-if="infoMean.length">
            <average :items="infoMean"/>
        </v-col>

        <v-col v-if="infoTravel.length">
            <Travel
                    :items="infoTravel"
                    :periods="travelPeriods"
            />
        </v-col>

        <v-col v-if="infoDays.length">
            <days-of-week :items="infoDays"/>
        </v-col>

        <v-col v-if="infoSearch.length">
            <advanced-search :items="infoSearch"/>
        </v-col>
    </v-row>
</template>

<script>
    import Coeffs from "../Tables/Coeffs";
    import Average from "../Tables/Mean";
    import DaysOfWeek from "../Tables/DaysOfWeek";
    import Travel from "../Tables/Travel";
    import AdvancedSearch from "../Tables/AdvancedSearch";

    import {
        APINames,
        dataTableDaysInfo,
        travelDaysHelper,
        getTravelPeriods,
        getWeekDay,
        getSecondsFromTime,
        getHHmmFromDateObject,
        getTimeFromSeconds,
        getTimeFromMinutes,
    } from "@/helpers/helper";


    export default {
        name: "Data",

        components: {
            Coeffs,
            Average,
            DaysOfWeek,
            Travel,
            AdvancedSearch,
        },

        mounted() {
            this.$store.dispatch('getInfo');
        },

        computed: {
            userInfo() {
                return this.$store.state.Auth.info;
            },

            getPreloader() {
                return this.$store.state.Data.preloader;
            },

            infoCorrCoeffs() {
                return this.$store.state.Data.infoCorrCoeffs;
            },

            infoMean() {
                return this.$store.state.Data.infoMean;
            },

            infoDays() {
                if (this.$store.state.Data.infoDays)
                    return dataTableDaysInfo(Object.assign({}, this.$store.state.Data.infoDays));
                else return [];
            },

            infoTravel() {
                if (this.$store.state.Data.infoTravel) {
                    if (this.userInfo) {
                        return travelDaysHelper(JSON.parse(JSON.stringify(this.$store.state.Data.infoTravel)), this.userInfo);
                    } else return [];
                } else
                    return [];
            },

            travelPeriods() {
                if (this.$store.state.Data.infoTravel) {
                    if (this.userInfo) {
                        return getTravelPeriods(JSON.parse(JSON.stringify(this.$store.state.Data.infoTravel)));
                    } else return [];
                } else
                    return [];
            },

            infoSearch() {
                if (this.$store.state.Data.infoSearch && this.$store.state.Data.infoSearchParams) {
                    const res = [];
                    const params = this.$store.state.Data.infoSearch;
                    const apiParams = [];
                    for (let sectionName in APINames) {
                        const section = {
                            name: sectionName,
                            values: Object.fromEntries(Object.entries(APINames[sectionName]).map(([key, value]) => [value, key])),
                        };
                        apiParams.push(section);
                    }

                    const searchedQueries = Object.assign([], this.$store.state.Data.infoSearchParams)
                        .filter(item => !item.IsDirty)
                        .map(item => {
                            item.init = apiParams.filter(apiItem => apiItem.values?.[item.parameter]).map(apiValue => {
                                const newVal = Object.assign({}, apiValue);
                                newVal.value = newVal.values[item.parameter];
                                return newVal;
                            })[0];
                            return item;
                        });

                    for (let key in params) {
                        if (searchedQueries.some(item => item.init.name === key)) {

                            res.push(...params[key].reduce((acc, day) => {
                                searchedQueries.forEach(query => {
                                    const resultDay = {};

                                    if (day?.[query.init.value]) {
                                        let condition = false;

                                        switch (query.operator) {
                                            case "=":
                                                if (query.isTime) {
                                                    condition = getSecondsFromTime(getHHmmFromDateObject(day[query.init.value])) === getSecondsFromTime(query.value);
                                                } else if (query.isSeconds) {
                                                    condition = day[query.init.value] === getSecondsFromTime(query.value);
                                                } else if (query.isMinutes) {
                                                    condition = day[query.init.value] * 60 == getSecondsFromTime(query.value);
                                                } else {
                                                    condition = day[query.init.value] == query.value;
                                                }
                                                break;
                                            case ">":
                                                if (query.isTime) {
                                                    condition = getSecondsFromTime(getHHmmFromDateObject(day[query.init.value])) > getSecondsFromTime(query.value);
                                                } else if (query.isSeconds) {
                                                    condition = day[query.init.value] > getSecondsFromTime(query.value);
                                                } else if (query.isMinutes) {
                                                    condition = day[query.init.value] * 60 > getSecondsFromTime(query.value);
                                                } else {
                                                    condition = day[query.init.value] > query.value;
                                                }
                                                break;
                                            case "<":
                                                if (query.isTime) {
                                                    condition = getSecondsFromTime(getHHmmFromDateObject(day[query.init.value])) < getSecondsFromTime(query.value);
                                                } else if (query.isSeconds) {
                                                    condition = day[query.init.value] < getSecondsFromTime(query.value);
                                                } else if (query.isMinutes) {
                                                    condition = day[query.init.value] * 60 < getSecondsFromTime(query.value);
                                                } else {
                                                    condition = day[query.init.value] < query.value;
                                                }
                                                break;
                                        }

                                        if (condition) {
                                            resultDay.date = day.summary_date;
                                            resultDay.dayOfWeek = getWeekDay(day.summary_date);
                                            resultDay.parameter = query.parameter;
                                            if (query.isTime) {
                                                resultDay.searchedValue = getHHmmFromDateObject(day[query.init.value]);
                                            } else if (query.isSeconds) {
                                                resultDay.searchedValue = getTimeFromSeconds(day[query.init.value]);
                                            } else if (query.isMinutes) {
                                                resultDay.searchedValue = getTimeFromMinutes(day[query.init.value]);
                                            } else {
                                                resultDay.searchedValue = day[query.init.value];
                                            }
                                            acc.push(resultDay);
                                        }
                                    }
                                });
                                return acc;
                            }, []));
                        }
                    }
                    return res.reduce((acc, item, i) => {
                        if (searchedQueries.length === 1) {
                            acc.push({...item, ...{searchedValues: `${item.parameter}: ${item.searchedValue}`}});
                        } else {
                            if (res.some((item2, j) => item.date === item2.date && i !== j)) {
                                const index = acc.findIndex(itemAdded => itemAdded.date === item.date);
                                if (index < 0) {
                                    acc.push({...item, ...{searchedValues: `${item.parameter}: ${item.searchedValue}`}});
                                } else {
                                    acc[index].searchedValues = `${acc[index].searchedValues}
        ${item.parameter}: ${item.searchedValue}`;
                                }
                            }
                        }
                        return acc;
                    }, []);

                }
                return [];
            },
        },
    };
</script>


