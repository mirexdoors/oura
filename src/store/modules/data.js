import axios from "axios";
import {db} from "../../db";
import {getUserSummaryDateObject, dataTableMeanInfo} from "../../helpers/helper";
import {getAllInfoFromDateArray, getDataFromRaw, getSleepAndActiveInfo} from '../../helpers/storeHelpers';

const Sleep = {
    state: {
        preloader: false,
        infoSleep: null,
        categoryData: null,
        infoMean: [],
        infoDays: null,
        infoTravel: null,
        infoSearch: null,
        infoSearchParams: [],
    },
    mutations: {
        setCategoryData(state, payload) {
            state.categoryData = getDataFromRaw(payload);
        },

        setInfoSleep(state, payload) {
            state.infoSleep = payload;
        },

        setInfoTravel(state, payload) {
            state.infoTravel = payload;
        },

        setInfoDays(state, payload) {
            state.infoDays = payload;
        },

        setInfoMean(state, payload) {
            state.infoMean = payload ? payload : [];
        },

        setInfoSearch(state, payload) {
            state.infoSearch = payload;
        },

        setInfoSearchParams(state, payload) {
            state.infoSearchParams = payload;
        },

        setPreloader(state, payload) {
            if (!payload) {
                setTimeout(() => {
                    state.preloader = payload
                }, 1000)
            } else {
                state.preloader = payload;
            }

        },
    },

    actions: {
        async getCategoryInfo({commit}, payload) {
            const token = this.state.Auth.token;
            axios
                .all([
                    getSleepAndActiveInfo(payload, token, "sleep"),
                    getSleepAndActiveInfo(payload, token, "activity"),
                    getSleepAndActiveInfo(payload, token, "readiness"),
                ])
                .then(
                    axios.spread(function (...response) {
                        commit("setCategoryData", response);
                        commit("setPreloader", false);
                    })
                )
                .catch(function (error) {
                    console.log(error);
                });
        },

        getDataByLastWeek(context, email) {
            const dates = [
                {
                    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
                    end: new Date().toISOString().substr(0, 10)
                }
            ];

            if (email.email) {
                const resultDataObj = {
                    sleep: [],
                    activity: [],
                    readiness: []
                };
                getAllInfoFromDateArray(dates, this.state.Auth.token).then((...data) => {

                    if (data.length > 0) {

                        //processData
                        data[0].forEach(dataItem => {
                            const tempItem = getDataFromRaw(dataItem);
                            for (const key in resultDataObj) {
                                tempItem[key].forEach(tempItemElement => {
                                    resultDataObj[key].push(tempItemElement);
                                });
                            }
                        });

                        const userDataMap = getUserSummaryDateObject(resultDataObj);
                        const batch = db.batch();

                        userDataMap.forEach(userMapDataItem => {
                            const userMapDataItemRef = db.collection('parameters').doc(`${userMapDataItem.summary_date}__${email.email}`);
                            batch.set(userMapDataItemRef, userMapDataItem)
                        });

                       batch.commit();
                    }
                });
            }
        },

        getSleepInfo({commit, dispatch}, payload) {
            if (payload.dates.length > 0) {
                const token = this.state.Auth.token;
                const resultData = {
                    sleep: [],
                    activity: [],
                    readiness: []
                };
                getAllInfoFromDateArray(payload.dates, token).then((...data) => {
                    data[0].forEach(dataItem => {
                        const tempItem = getDataFromRaw(dataItem);
                        for (const key in resultData) {
                            tempItem[key].forEach(tempItemElement => {
                                resultData[key].push(tempItemElement);
                            });
                        }
                    });

                    switch (payload.param) {
                        case "days":
                            commit("setInfoDays", resultData);
                            break;
                        case "travel":
                            commit("setInfoTravel", resultData);
                            break;
                        case "corr":
                            commit("setInfoSleep", resultData);
                            break;
                        case "mean":
                            dispatch("setAverageMean", {data: resultData, dates: payload.dates});
                            break;
                        case "search":
                            commit("setInfoSearch", resultData);
                            commit("setInfoSearchParams", payload.parameters);
                            break;
                    }

                    commit("setPreloader", false);
                });
            }
        },

        async setAverageMean({commit}, payload) {
            if (this.state.Data.categoryData) {
                const result = await dataTableMeanInfo(
                    payload.data,
                    Object.assign({}, this.state.Data.categoryData),
                    payload.dates[0]
                );

                commit("setInfoMean", result);
            }
        }
    },

    getters: {
        getMean: state => {
            return state.infoMean;
        }
    }
};

export default Sleep;
