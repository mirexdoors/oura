<template>
    <v-footer
            inset
            padless
            min-height="50"
            class="sticky-footer d-flex flex-column align-center justify-center py-4"
    >

        <div>
            Feedback Email:
            <a href="mailto:feedback@healthboard.tech" class="pl-2">feedback@healthboard.tech</a>
        </div>

        <v-divider></v-divider>

        <v-card-text class="py-2 white--text text-center d-flex justify-center flex-column flex-lg-row">
            <a href="/terms" class="px-2">Terms and Conditions</a>
            <div>
                <a href="/privacy" class="px-2">Privacy Policy</a>
            </div>
        </v-card-text>

    </v-footer>
</template>

<style scoped>
    .sticky-footer {
        position: sticky;
        top: 100%;
    }
</style >
