import axios from "axios";

const Active = {
  state: {
    infoActive: [],
  },
  mutations: {
      setInfoActive(state, payload) {          
          state.infoActive = payload;
      }
  },
  actions: {
    getActiveInfo({commit}) {
      const token = this.state.Auth.token;
      const url = `https://api.ouraring.com/v1/activity?access_token=${token}&start=2020-04-01&end=2020-04-20`;
      axios
        .get(url)
        .then(function(response) {
            commit('setInfoActive', response.data.activity);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  }
};

export default Active;
