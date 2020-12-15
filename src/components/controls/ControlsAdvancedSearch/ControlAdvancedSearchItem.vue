<template>
    <div>
        <v-select
                v-model="parameter"
                :items="parameters"
                label="Choose parameter"
                @change="emitData"
        />
        <v-row>
            <v-col cols=3 sm="5" lg="3">
                <v-select
                        v-model="operand"
                        :items="['=', '>', '<']"
                        @change="emitData"
                />
            </v-col>
            <v-col cols="10" sm="6">
                <v-text-field label="value" v-model="value" @input="emitData"/>
            </v-col>
            <slot>
                <v-col cols="10" sm="6"></v-col>
            </slot>
        </v-row>
    </div>
</template>

<script>

  export default {
    name: "ControlAdvancedSearchItem",

    props: {parameters: Array, id: Number},

    data() {
      return {
        parameter: '',
        operand: '=',
        value: '',
      }
    },

    methods: {
      emitData() {
        const payload = {
          id: this.id,
          parameter: this.parameter,
          operand: this.operand,
          value: this.value,
          isDirty: false,
        };

        if (!(this.parameter && this.operand && this.value)) {
          payload.isDirty = true;
        }
        this.$emit('change', payload);
      }
    },
  }
</script>

