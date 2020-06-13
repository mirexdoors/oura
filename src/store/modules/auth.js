import axios from "axios";
import {db} from "../../db";

const Auth = {
  state: {
    user: "user",
    info: {
      email: '',
      country: '',
      city: '',
      timeZone: '',
      gtmOffset: '',
    },
    token: null,
    parameteres: {
      client_id: 'RKDF3YTKZSPGAPJO',
      state: 'XXX',
      response_type: 'token',
      scope: 'email daily',
      redirect_uri: location.origin + '/'
    },
    token_lifetime: 29,
  },
  mutations: {
    saveToken(state, payload) {
      state.token = payload;
    },
    saveInfo(state, payload) {
      state.info.email = payload.email;
      state.info.country = payload.country;
      state.info.city = payload.city;
      state.info.timeZone = payload.timeZone;
      state.info.gtmOffset = payload.gtmOffset;
    },
    updateTimeZone(state, payload) {
      state.info.timeZone = payload;
    },
    updateGmt(state, payload) {
      state.info.gtmOffset = payload;
    }
  },
  actions: {
    getInfo({commit}) {
      const token = this.state.Auth.token;
      axios.get(`https://api.ouraring.com/v1/userinfo?access_token=${token}`)
          .then(response => {
            const info = {};
            info.email = response.data.email;
            db.collection('locations')
                .doc(response.data.email)
                .get()
                .then(response => {
                  if (response.exists) {
                    const fireData = response.data();
                    info.city= fireData.city;
                    info.country = fireData.country;
                    info.timeZone = fireData.timeZone;
                    info.gtmOffset = fireData.gtmOffset;
                  }
                  commit('saveInfo', info);
                })

              }
          );
    }
  },
  getters: {},
};

export default Auth;
