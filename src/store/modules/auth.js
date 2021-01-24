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
            dst: '',
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
            state.info.dst = payload.dst;
        },
        updateTimeZone(state, payload) {
            state.info.timeZone = payload;
        },
        updateGmt(state, payload) {
            state.info.gtmOffset = payload;
        },
        updateDst(state, payload) {
            state.info.dst = Number(payload);
        }
    },
    actions: {
        processEmail(type, email) {
            if (email) {
                db.collection('email')
                    .where('email', '==', email)
                    .get()
                    .then(response => {
                        let isEmailExist = false;
                        response.forEach(doc => {
                            if (doc.data().email === email) isEmailExist = true;
                        });

                        if (!isEmailExist) {
                            db.collection('email').add({email});
                        }
                    });
            }
        },

        getInfo({commit, dispatch}) {
            const token = this.state.Auth.token;
            axios.get(`https://api.ouraring.com/v1/userinfo?access_token=${token}`)
                .then(response => {
                        const info = {};
                        info.email = response.data.email;

                        dispatch('getDataByLastWeek',{email:  info.email});

                        db.collection('locations')
                            .where('email', '==', response.data.email)
                            .get()
                            .then(response => {
                                response.forEach(doc => {
                                    const fireData = doc.data();
                                    info.city = fireData.city;
                                    info.country = fireData.country;
                                    info.timeZone = fireData.timeZone;
                                    info.gtmOffset = fireData.gtmOffset;
                                    info.dst = fireData.dst;
                                    commit('saveInfo', info);
                                });
                            });
                    }
                );
        }
    },
    getters: {
        userInfo: state => state.info,
        email: state => state.info.email,
    },
};

export default Auth;
