import axios from "axios";

const Sleep = {
  state: {
    infoSleep: [],
  },
  mutations: {
      setInfoSleep(state, payload) {
          state = payload;
      }
  },
  actions: {
    getSlepInfo({commit}) {
      const token = this.state.Auth.token;
      const url = `https://api.ouraring.com/v1/sleep?access_token=${token}&start=2020-04-01&end=2020-04-20`;
      axios
        .get(url)
        .then(function(response) {
            commit('setInfoSleep', response.data.sleep);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  getters: {
    getInfoSleep(state) {
        return state.infoSleep;
    }
  },
};

export default Sleep;
