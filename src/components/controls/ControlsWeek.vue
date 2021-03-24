<template>
    <div>
        <slot></slot>

        <v-radio-group
            v-model="period"
            class="radios"
            @change="setDates">
            <v-radio
                v-for="radio in this.radioButtons"
                :key="radio['type']"
                :label="radio['label']"
                :value="radio['type']"
                color="white"
            >
                <span slot="label" class="white--text">{{ radio['label'] }}</span>
            </v-radio>
        </v-radio-group>

        <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
        >
            <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="date1"
                    label="Date Start"
                    persistent-hint
                    class="white-input"
                    v-on="on"
                />
            </template>
            <v-date-picker
                v-model="date1"
                :allowed-dates="allowedDatesStart"
                no-title
                @change="changeDateInput"
                @input="menu1 = false"
            />
        </v-menu>

        <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
        >
            <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="date2"
                    label="Date End"
                    persistent-hint
                    readonly
                    class="white-input"
                    v-on="on"
                />
            </template>
            <v-date-picker
                v-model="date2"
                :allowed-dates="allowedDatesFinish"
                no-title
                @change="changeDateInput"
                @input="menu2 = false"/>
        </v-menu>

        <div class="text-center">
            <v-btn
                :disabled="isDisabled"
                min-width="150"
                color="dark"
                @click="upload()"
            >
                Submit
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: "ControlsWeek",

    data: () => ({
        menu1: false,
        menu2: false,
        date1: null,
        date2: new Date().toISOString().substr(0, 10),
        period: null,
        isDisabled: true,
        radioButtons: [
            {type: 'month', label: 'Last month'},
            {type: 'year', label: 'Last year'},
            {type: 'entire', label: 'Entire period'},
        ],
    }),

    watch: {
        period: function (val) {
            if (val !== null) {
                this.isDisabled = false
            } else {
                this.isDisabled = !(this.date1 && this.date2);
            }
        }
    },

    methods: {
        upload() {
            this.$store.commit("setPreloader", true);

            this.$store.commit("setInfoSleep", null);
            this.$store.commit("setInfoMean", null);
            this.$store.commit("setInfoTravel", null);
            this.$store.commit("setInfoSearch", null);

            const start = this.date1;
            const end = this.date2;
            const dates = [{start, end}];

            this.$store.dispatch("getSleepInfo", {dates, param: 'days'});
        },

        setDates() {
            const firstDate = new Date();
            switch (this.period) {
                case 'month':
                    firstDate.setMonth(firstDate.getMonth() - 1);
                    break;
                case 'year':
                    firstDate.setFullYear(firstDate.getFullYear() - 1);
                    break;
                case 'entire':
                    firstDate.setFullYear(2000, 0, 1);
                    break;
            }
            this.date1 = firstDate.toISOString().substr(0, 10);
            this.date2 = new Date().toISOString().substr(0, 10);
        },

        allowedDatesStart: val => val < new Date().toISOString().substr(0, 10),

        allowedDatesFinish: val => val <= new Date().toISOString().substr(0, 10),

        changeDateInput() {
            //убираем выбранное значение radio
            this.period = null;
            if (this.date1 >= this.date2) {
                this.date1 = null;
            }

            if (this.date1 && this.date2) {
                this.isDisabled = false;
            }
        }
    },
}
</script>
