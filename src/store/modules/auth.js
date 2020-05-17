const Auth = {
  state: {
    user: "user",
    token: null,
    parameteres: {
      client_id: 'RKDF3YTKZSPGAPJO',
      state: 'XXX',
      response_type: 'token',
      scope: 'daily',
      redirect_uri:  location.origin + '/'      
    },
    token_lifetime: 29,
  },
  mutations: {
    saveToken(state, payload) {
      state.token = payload;
    },
  },
  actions: {},
  getters: {},
};

export default Auth;
