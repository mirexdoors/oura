<template>
    <v-app app class="mx-lg-4">
        <preloader-app v-if="isGlobalPreloader"/>

        <template
                v-else-if="!isAuth"
                class="d-flex"
        >
            <authorization-app class="fill-height justify-center align-self-center align-center"/>
            <footer-app/>
        </template>

        <template
                v-else
                class="d-flex fill-height"
        >
            <preloader-app v-if="isPreloader"/>
            <header-app/>

            <v-container
                    fluid
                    class="d-flex flex-column justify-center align-center mt-0 mt-lg-12 px-md-6 mx-auto px-0"
            >
                <v-layout
                        row
                        style="width: 100%"
                >
                    <v-flex
                            lg6
                            xs12
                            class="d-flex flex-column mx-auto px-0"
                    >
                        <router-view/>
                    </v-flex>
                </v-layout>
            </v-container>

            <footer-app/>
        </template>
    </v-app>
</template>

<script>
    import axios from "axios";
    import Cookies from "js-cookie";

    import PreloaderApp from "./components/PageBlocks/PreloaderApp";
    import HeaderApp from "./components/PageBlocks/HeaderApp";
    import FooterApp from "./components/PageBlocks/FooterApp";
    import AuthorizationApp from "./components/PageBlocks/AuthorizationApp";

    export default {
        name: "App",
        components: {
            HeaderApp,
            FooterApp,
            PreloaderApp,
            AuthorizationApp,
        },

        data() {
            return {
                isGlobalPreloader: true,
                isOpenSettings: false,
            }
        },

        mounted() {
            let token = this.getToken();
            if (token) {
                this.checksTokenEnDecay(token);
            }
            this.dropGlobalPreloader();
        },

        computed: {
            isAuth: function () {
                return this.$store.state.Auth.token;
            },
            isPreloader: function () {
                return this.isGlobalPreloader || this.$store.state.Data.preloader;
            },
        },

        methods: {
            dropGlobalPreloader() {
                setTimeout(() => {
                    this.isGlobalPreloader = false;
                }, 400);
            },
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
                        this.globalPreloader = false;
                        this.$store.dispatch('processEmail', response.data.email);
                    })
                    .catch(e => {
                        const codeError = new Error(e);
                        if (codeError.message.includes(401)) {
                            Cookies.remove("token_oura");
                            this.isGlobalPreloader = false;
                        }
                    });
            }
        }
    }
</script>

<style>
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

    h4 {
        margin: .5em 0;
    }
</style>
