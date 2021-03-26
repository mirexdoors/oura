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
        getCategoryInfo({commit}, payload) {
            const token = this.state.Auth.token;


            return new Promise((resolve, reject) => {
                axios
                    .all([
                        getSleepAndActiveInfo(payload, token, "sleep"),
                        getSleepAndActiveInfo(payload, token, "activity"),
                        getSleepAndActiveInfo(payload, token, "readiness"),
                    ])
                    .then(
                        axios.spread(function (...response) {
                            commit("setCategoryData", response);
                            resolve(true);
                        })
                    )
                    .catch(function (error) {
                        reject(false);
                        console.error(error);
                    });
            });
        },

        getAllDataByLastYear(context, email) {
            const dates = [
                {
                    start: new Date(Date.now() - 2000 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
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
                        const batch2 = db.batch();
                        let i = 1;

                        userDataMap.forEach(userMapDataItem => {
                            const userMapDataItemRef = db.collection('parameters').doc(`${userMapDataItem.summary_date}__${email.email}`);
                            if (i < 501)
                                batch.set(userMapDataItemRef, userMapDataItem);
                            else
                                batch2.set(userMapDataItemRef, userMapDataItem);
                            i++;
                        });

                        batch.commit();
                        if (userDataMap.length > 500) {
                            batch2.commit();
                        }

                    }
                });
            }
        },

        async fireProcessInfo({commit, dispatch}, payload) {

            const isInfoLoaded = await dispatch('getCategoryInfo', payload.dates);

            if (isInfoLoaded && payload.dates.length > 0 && payload.yearDate.length > 0) {
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
                            commit("setPreloader", false);
                            break;
                        case "travel":
                            commit("setInfoTravel", resultData);
                            commit("setPreloader", false);
                            break;
                        case "corr":
                            commit("setInfoSleep", resultData);
                            commit("setPreloader", false);
                            break;
                        case "mean":
                            if (resultData) dispatch("setAverageMean", {data: resultData, dates: payload.dates});
                            else commit("setInfoMean", null);
                            break;
                        case "search":
                            commit("setInfoSearch", resultData);
                            commit("setInfoSearchParams", payload.parameters);
                            commit("setPreloader", false);
                            break;
                    }
                });
            }
        },

        async setAverageMean({commit}, payload) {
            if (this.state.Data.categoryData) {
                const result = await dataTableMeanInfo(
                    payload.data,
                    JSON.parse(JSON.stringify(this.state.Data.categoryData)),
                    payload.dates[0]
                );

                commit("setInfoMean", result);
                commit("setPreloader", false);
            }
        },
    },

    getters: {
        getMean: state => {
            return state.infoMean;
        }
    }
};

export default Sleep;
