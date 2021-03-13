<template>
    <v-app-bar
            app
            color="primary"
            :prominent="isMobile"
            class="d-flex justify-space-between py-2 align-center"
            :class="isMobile ? 'pt-4' : ''"
    >
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

        <a href="/" class="white--text headline text-uppercase font-weight-bold toolbar-title">Healthboard</a>

        <div>
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
        flex-wrap: wrap;
        width: 100%;
    }
</style>
