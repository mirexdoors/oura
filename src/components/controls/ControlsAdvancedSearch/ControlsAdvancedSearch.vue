<template>
    <div>
        <slot></slot>
        <control-advanced-search-item
            v-for="control in selectedValues"
            :key="control.id"
            :ref="control.id"
            :id="control.id"
            :parameters="parametersList"
            @change="processParameterItem"
        >
            <v-icon
                class="align-self-center white--text"
                style="max-height: 24px"
                @click="addParameter"
            >
                mdi-plus-thick
            </v-icon>
            <v-icon
                v-if="selectedValues.length > 1"
                style="max-height: 24px"
                dark
                class="pl-2 align-self-center grey--text"
                @click="deleteParameter(control.id)"
            >
                mdi-close-circle-outline
            </v-icon>
        </control-advanced-search-item>

        <div class="text-center">
            <v-btn
                :disabled="checkDisable()"
                min-width="150"
                color="dark"
                @click="upload()">
                Submit
            </v-btn>
        </div>
    </div>
</template>

<script>
import {APINames} from "@/helpers/helper";
import ControlAdvancedSearchItem from "./ControlAdvancedSearchItem";

export default {
    name: "ControlsAdvancedSearch",

    components: {ControlAdvancedSearchItem},

    data() {
        return {
            componentId: 1,
            selectedValues: []
        }
    },

    mounted() {
        this.selectedValues.push(this.createNewControl(this.componentId));
    },

    computed: {
        parametersList() {
            return Object.values(APINames).reduce((acc, item) => {
                acc.push(Object.values(item));
                return acc;
            }, []).flat(1).filter(item => item !== 'timezone');
        }
    },

    methods: {
        upload() {

            this.$store.commit("setPreloader", true);

            this.$store.commit("setInfoCorrCoeffs", []);
            this.$store.commit("setInfoMean", null);
            this.$store.commit("setInfoDays", null);
            this.$store.commit("setInfoTravel", null);
            this.$store.commit("setInfoSearchParams", []);

            const start = new Date(2000, 0, 1).toISOString().substr(0, 10);
            const end = new Date().toISOString().substr(0, 10);
            const dates = [{start, end}];

            this.$store.dispatch("fireProcessInfo", {dates, param: 'search', parameters: this.selectedValues});
        },

        processParameterItem(payload) {
            if (!this.selectedValues.some(item => item.id === payload.id)) {
                this.selectedValues.push(payload);
            } else if (this.selectedValues.filter(item => item.id === payload.id)?.[0]) {
                this.selectedValues[this.selectedValues.findIndex(item => item.id === payload.id)] = payload;
                this.selectedValues = JSON.parse(JSON.stringify(this.selectedValues));
            }
        },

        checkDisable() {
            return !this.selectedValues.some(item => item.isDirty !== true);
        },

        addParameter() {
            this.componentId++;
            this.selectedValues.push(this.createNewControl(this.componentId));
        },

        deleteParameter(deletedId) {
            this.selectedValues = this.selectedValues.filter(item => item.id !== deletedId);
        },

        createNewControl(id) {
            return {
                id,
                parameter: '',
                operator: '=',
                isDirty: true,
            }
        }
    }
}
</script>
