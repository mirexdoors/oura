<template>
    <v-app class="mx-lg-4">
        <div
                v-if="!globalPreloader"
                :class="!isAuth ? 'd-flex' : ''"
                class="fill-height"
        >
            <Preloader
                    v-if="getPreloader"
                    class="mx-auto"
            />

            <HeaderApp v-if="isAuth" />

            <v-main :class="isAuth ? '' : 'align-center'">
                <v-card-title
                        v-if="!getPreloader"
                        class="text-center justify-center py-6">
                    <h1 class="font-weight-bold display-3 primary--text text-break px-2">
                        Health Board
                    </h1>
                </v-card-title>
                <router-view/>
            </v-main>
        </div>
        <div
                v-else
                class="my-auto"
        >
            <Preloader class="mx-auto"/>
        </div>

       <FooterApp />
    </v-app>
</template>

<script>
    import axios from "axios";
    import Cookies from "js-cookie";

    import Preloader from "./components/Preloader";
    import HeaderApp from "./components/PageBlocks/HeaderApp";
    import FooterApp from "./components/PageBlocks/FooterApp";

    export default {
        name: "App",
        components: {
            HeaderApp,
            FooterApp,
            Preloader,
        },

        data() {
            return {
                auth: false,
                globalPreloader: true,
                isOpenSettings: false,
            }
        },

        mounted() {
            let token = this.getToken();
            if (token) {
                this.checksTokenEnDecay(token);
            } else {
                this.auth = false;
                this.globalPreloader = false;
            }
        },

        computed: {
            isAuth: function () {
                return this.$store.state.Auth.token;
            },
            getPreloader: function () {
                return this.$store.state.Data.preloader;
            },
        },

        methods: {
            getToken() {
                let token = Cookies.get("token_oura") || null;
                if (!token) token = this.getTokenInHref();
                const url = location.origin + "/";
                history.pushState({page: 1}, document.title, url);
                return token;
            },
            getTokenInHref() {
                let token;
                const href = decodeURIComponent(location.href);
                const token_lifetime = this.$store.state.Auth.token_lifetime;

                if (href.includes("access_token")) {
                    token = href.split("access_token=")[1].split("&")[0];
                    Cookies.set("token_oura", token, {expires: token_lifetime});
                }
                const url = location.origin + "/";
                history.pushState({page: 1}, document.title, url);
                return token;
            },


            checksTokenEnDecay(token) {
                axios
                    .get(`https://api.ouraring.com/v1/userinfo?access_token=${token}`)
                    .then(response => {
                        if (!this.$store.state.Auth.token)
                            this.$store.commit("saveToken", token);
                        this.auth = true;
                        this.globalPreloader = false;
                        this.$store.dispatch('processEmail', response.data.email);
                    })
                    .catch(e => {
                        const codeError = new Error(e);
                        if (codeError.message.includes(401)) {
                            Cookies.remove("token_oura");
                            this.auth = false;
                            this.globalPreloader = false;
                        }
                    });
            }
        }
    }
</script>

<style>
    @media screen and (min-width: 991px) {
        ::-webkit-scrollbar-track {
            background: transparent
        }

        ::-webkit-scrollbar {
            position: absolute;
            width: 8px;
            z-index: 1000;
            background-color: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 3px;
            border: 1px solid #fff;
        }
    }

    .theme--dark.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
        background-color: #ccc !important;
    }

    .white-input input {
        color: #fff !important;
    }

    .v-application .primary--text.white-input {
        color: #ffffff;
        caret-color: #fff;
    }
</style>
