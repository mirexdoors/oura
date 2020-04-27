const Auth = {
  state: {
    user: "user",
    token: null,
    client_id: "RKDF3YTKZSPGAPJO",
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
