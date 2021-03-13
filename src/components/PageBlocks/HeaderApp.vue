<template>
    <v-app-bar
            app
            color="primary"
            :prominent="isMobile"
            class="d-flex justify-space-between py-2 align-center"
            :class="isMobile ? 'pt-4' : ''"
    >
        <div>
            <v-btn>
                <a
                        class="text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://vllesh.medium.com/healthboard-tech-user-manual-5d075d46c408"
                >
                            <span class="text-decoration-underline">
                            READ USER MANUAL
                            </span>
                    &#128214;
                </a>
            </v-btn>

            <a href="/"
               class="d-inline-block white--text headline text-uppercase font-weight-bold toolbar-title ml-0 ml-lg-12 mt-4 mt-lg-0">Healthboard</a>
        </div>
        <div class="d-flex">
            <v-btn
                    icon
                    @click="isOpenSettings = !isOpenSettings"
            >
                <v-icon
                        settings
                        class="secondary--text"
                >settings
                </v-icon>
            </v-btn>
            <v-btn icon>
                <Logout class="align-content-end secondary--text"/>
            </v-btn>
        </div>

        <v-dialog
                v-model="isOpenSettings"
                max-width="300"
        >
            <Settings @closeSettings="isOpenSettings = false"/>
        </v-dialog>
    </v-app-bar>
</template>

<script>
    import Settings from '../Settings';
    import Logout from "../Logout";

    export default {
        name: "HeaderApp",
        components: {Logout, Settings},
        data() {
            return {
                isOpenSettings: false,
            }
        },
        computed: {
            isMobile() {
                return this.$vuetify.breakpoint.xsOnly;
            }
        }
    }
</script>

<style>
    .toolbar-title {
        letter-spacing: 1px;
    }

    .v-toolbar__content {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
</style>
