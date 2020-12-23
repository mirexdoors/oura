<template>
    <v-app class="mx-lg-4">
        <div
            v-if="!globalPreloader"
            :class="!isAuth ? 'd-flex' : ''"
            class="fill-height"
        >
            <preloader
                v-if="getPreloader"
                class="mx-auto"
            />

            <v-toolbar
                v-if="isAuth"
                color="primary"
            >
                <v-btn>
                    <a
                        class=" text-decoration-none"
                        target="_blank"
                        href="https://vllesh.medium.com/healthboard-tech-user-manual-5d075d46c408">
                            <span class="text-decoration-underline">
                            READ USER MANUAL
                            </span>
                        &#128214;
                    </a>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon
                        settings
                        class="secondary--text"
                        @click.stop="isOpenSettings = !isOpenSettings">settings
                    </v-icon>
                </v-btn>
                <v-btn icon>
                    <Logout class="align-content-end secondary--text"/>
                </v-btn>
                <v-dialog
                    v-model="isOpenSettings"
                    max-width="300"
                >
                    <settings @closeSettings="isOpenSettings = false"/>
                </v-dialog>
            </v-toolbar>

            <v-main :class="isAuth ? '' : 'align-center'">
                <v-card-title
                    v-if="!getPreloader"
                    class="text-center justify-center py-6">
                    <h1 class="font-weight-bold display-3 primary--text text-break px-2">
                        Health Board
                    </h1>
                </v-card-title>
                <v-col
                    v-if="isAuth"
                    cols="12"
                    lg="7"
                    class="d-flex flex-column mx-auto px-0 px-md-12 py-0"
                >
                    <Tabs/>
                    <Data/>
                </v-col>
                <Authorization
                    v-else
                    class="mx-auto"
                />
            </v-main>
            <v-footer
                light
                absolute
                inset
                app
                min-height="50"
                class="d-flex justify-center"
            >
                Feedback Email:&nbsp;
                <a href="mailto:expample@mail.ru">example@mail.ru</a>
            </v-footer>
        </div>
        <div
            v-else
            class="my-auto"
        >
            <Preloader class="mx-auto"/>
        </div>
    </v-app>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

import Logout from "./components/Logout";
import Authorization from "./components/Authorization";
import Data from "./components/main/Data";
import Tabs from "./components/Tabs";
import Settings from './components/settings';
import Preloader from "./components/Preloader";

export default {
    name: "App",

    components: {
        Authorization,
        Data,
        Logout,
        Tabs,
        Preloader,
        Settings
    },

    data() {
        return {
            auth: false,
            globalPreloader: true,
            isOpenSettings: false,
        };
    },

    computed: {
        isAuth: function () {
            return this.$store.state.Auth.token;
        },
        getPreloader: function () {
            return this.$store.state.Data.preloader;
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

    methods: {
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

        getToken() {
            let token = Cookies.get("token_oura") || null;
            if (!token) token = this.getTokenInHref();
            const url = location.origin + "/";
            history.pushState({page: 1}, document.title, url);
            return token;
        },

        checksTokenEnDecay(token) {
            axios
                .get(`https://api.ouraring.com/v1/userinfo?access_token=${token}`)
                .then(() => {
                    if (!this.$store.state.Auth.token)
                        this.$store.commit("saveToken", token);
                    this.auth = true;
                    this.globalPreloader = false;
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
    },
};
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
