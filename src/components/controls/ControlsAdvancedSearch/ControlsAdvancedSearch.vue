<template>
    <div class="pl-2 pb-4 pr-2">
        <div class="subtitle-2">Select parameter(s) to search. Use ">" and SDFSSD symbols to specify required value
            range
        </div>
        {{selectedValues}}
        <control-advanced-search-item
                v-for="control in selectedValues"
                :key="control.id"
                :ref="control.id"
                :id="control.id"
                :parameters="parametersList"
                @change="processParameterItem"
        >
            <v-icon
                    class="align-self-center"
                    style="max-height: 24px"
                    @click="addParameter"
            >
                mdi-plus-thick
            </v-icon>
            <v-icon
                    style="max-height: 24px"
                    class="pl-2 align-self-center"
                    @click="deleteParameter(control.id)"
            >
                mdi-close-circle-outline
            </v-icon>
        </control-advanced-search-item>

        <div class="py-4">
            <v-btn :disabled="checkDisable()" min-width="150" rounded color="primary"
                   @click="processSearch()">
                Get
            </v-btn>
        </div>
    </div>
</template>

<script>
  import {APINames} from "../../../helpers/helper";
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
      processSearch() {
        if (window.innerWidth < 768) {
          this.$emit("changeDrawer", false);
        }
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
          operand: '=',
          isDirty: true,
        }
      }
    }
  }
</script>
