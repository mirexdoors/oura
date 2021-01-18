<template>
    <v-col cols="4">
        <v-data-table
                :headers="headers"
                :items="[]"
                :items-per-page="1000"
        />
    </v-col>
</template>

<script>
    export default {
        name: "ServiceEmails",

        data() {
            return {
                headers: [{
                    text: 'Email',
                    align: 'start',
                    sortable: false,
                    value: 'email',
                },
                ]
            }
        }
    }
</script>
