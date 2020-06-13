import axios from "axios";

const Auth = {
  state: {
    user: "user",
    email: "",
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
    saveEmail(state, payload) {
      state.email = payload;
    }
  },
  actions: {
    getEmail({commit}) {
      const token = this.state.Auth.token;
      axios.get(`https://api.ouraring.com/v1/userinfo?access_token=${token}`)
          .then(response => {
                commit('saveEmail', response.data.email);
              }
          );
    }
  },
  getters: {},
};

export default Auth;
