<template>
    <v-card v-if="items">
        <v-card-title>
            Mean
            <v-spacer></v-spacer>
            <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="10"
                :search="search"
        />
    </v-card>

</template>

<script>
    export default {
        name: "Mean",
        props: {
            items: Array,
        },
        data() {
            return {
                search: '',
                headers: [
                    {
                        text: 'Parameter',
                        value: 'parameter',
                        sortable: false,
                    },
                    {
                        text: 'Mean ± SD',
                        sortable: false,
                        value: 'mean',
                    },
                    {
                        text: 'Range mean ± SD',
                        sortable: false,
                        value: 'range',
                    },
                    {
                        text: `User's mean ± SD`,
                        sortable: false,
                        value: 'users_mean',
                    },
                ],
            }
        },
    }
</script>
