import axios from "axios";

const Sleep = {
  state: {
    preloader: false,
    infoSleep: "",
  },
  mutations: {
    setInfoSleep(state, payload) {
      let dataObj = {};
      payload.forEach(item => {
        let obj = filteredData(item.data)
        if (obj.sleep) dataObj.sleep = obj.sleep;
        if (obj.activity) dataObj.activity = obj.activity;
        if (obj.readiness) dataObj.readiness = obj.readiness;
      })

      state.infoSleep = dataObj;
    },
    setPreloader(state, payload) {
      state.preloader = payload;
    },
  },
  actions: {
    getSlepInfo({ commit }, payload) {
      const token = this.state.Auth.token;
      axios
        .all([
          getSleepAndActiveInfo(payload, token, "sleep"),
          getSleepAndActiveInfo(payload, token, "activity"),
          getSleepAndActiveInfo(payload, token, "readiness"),
        ])
        .then(
          axios.spread(function(...response) {
            commit("setInfoSleep", response);
            commit("setPreloader", false);
          })
        )
        .catch(function(error) {
          console.log(error);
        });
    },
  },
};

function getSleepAndActiveInfo(payload, token, request) {
  return axios.get(
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
          steps: item.steps,
          cal_total: item.cal_total,
          cal_active: item.cal_active,
          met_min_medium_plus: item.met_min_medium_plus,
          average_met: item.average_met,
        };
      }),
    };
  } else if (data.readiness) {
    return {
      readiness: data.readiness.map((item) => {
        return {
          score: item.score,
        };
      }),
    };
  }
}

export default Sleep;