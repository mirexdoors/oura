import axios from "axios";

const Sleep = {
  state: {
    infoSleep: '',
  },
  mutations: {
      setInfoSleep(state, payload) {
          state.infoSleep = payload;
      }
  },
  actions: {
    getSlepInfo({commit}, payload) {
      const token = this.state.Auth.token;
      const url = `https://api.ouraring.com/v1/sleep?access_token=${token}&start=${payload.start}&end=${payload.end}`;
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
