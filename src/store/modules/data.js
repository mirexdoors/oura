import axios from "axios";


const Sleep = {
  state: {
    preloader: false,
    infoSleep: null,
    categoryData: null,
    infoMean: null,
    infoDays: null,
    infoTravel: null,
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
      state.infoMean = payload;
    },
    setPreloader(state, payload) {
      if (!payload) {
        setTimeout(() => {
          state.preloader = payload
        }, 700)
      } else {
        state.preloader = payload;
      }

    },
  },
  actions: {
    getCategoryInfo({commit}, payload) {
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
    getSleepInfo({commit}, payload) {
      if (payload.dates.length > 0) {
        const token = this.state.Auth.token;
        const resultData = {sleep:[], activity:[], readiness: []};
        getAllInfoFromDateArray(payload.dates, token).then((...data) => {
         data[0].forEach(dataItem=> {
           const tempItem = getDataFromRaw(dataItem);
           for (const key in resultData) {
             tempItem[key].forEach(tempItemElement => {
               resultData[key].push(tempItemElement);
             });
           }
          });
          if (payload.param === 'days')
            commit("setInfoDays", resultData);
          if (payload.param === 'corr')
            commit("setInfoSleep", resultData);
          else if (payload.param === 'mean')
            commit("setInfoMean", resultData);
          else if (payload.param === 'travel')
            commit("setInfoTravel", resultData);

          commit("setPreloader", false);
        });
      }
    },
  },
};

const getAllInfoFromDateArray = async (dates, token) => {
  const result = [];
  for (const date of dates) {
    result.push(await getData(date, token));
  }
  return result;
};

const getData = async (dates, token) => {
  return await axios
      .all([
        getSleepAndActiveInfo(dates, token, "sleep"),
        getSleepAndActiveInfo(dates, token, "activity"),
        getSleepAndActiveInfo(dates, token, "readiness"),
      ])
};

function getDataFromRaw(payload) {
  let dataObj = {};

  if (payload !== null) {
    payload.forEach(item => {
      let obj = filteredData(item.data);
      if (obj.sleep) dataObj.sleep = obj.sleep;
      if (obj.activity) dataObj.activity = obj.activity;
      if (obj.readiness) dataObj.readiness = obj.readiness;
    });
  }
  return dataObj;
}

async function getSleepAndActiveInfo(payload, token, request) {
  return await axios.get(
      `https://api.ouraring.com/v1/${request}?access_token=${token}&start=${payload.start}&end=${payload.end}`
  );
}

function filteredData(data) {
  if (data.sleep) {
    return {
      sleep: data.sleep.map((item) => {
        return {
          bedtime_start: item.bedtime_start,
          bedtime_end: item.bedtime_end,
          score: item.score,
          total: item.total,
          duration: item.duration,
          awake: item.awake,
          light: item.light,
          rem: item.rem,
          deep: item.deep,
          summary_date: item.summary_date,
          onset_latency: item.onset_latency,
          restless: item.restless,
          efficiency: item.efficiency,
          midpoint_time: item.midpoint_time,
          hr_lowest: item.hr_lowest,
          hr_average: item.hr_average,
          rmssd: item.rmssd,
          breath_average: item.breath_average,
          temperature_delta: item.temperature_delta,
        };
      }),
    };
  } else if (data.activity) {
    return {
      activity: data.activity.map((item) => {
        return {
          score: item.score,
          daily_movement: item.daily_movement,
          non_wear: item.non_wear,
          rest: item.rest,
          inactive: item.inactive,
          summary_date: item.summary_date,
          steps: item.steps,
          cal_total: item.cal_total,
          cal_active: item.cal_active,
          met_min_medium_plus: item.met_min_medium_plus,
          average_met: item.average_met,
          timezone:item.timezone,
        };
      }),
    };
  } else if (data.readiness) {
    return {
      readiness: data.readiness.map((item) => {
        return {
          score: item.score,
          summary_date: item.summary_date,
        };
      }),
    };
  }
}

export default Sleep;
