<template>
    <div>
        <v-select
            v-model="parameter"
            :items="parameters"
            label="Choose parameter"
            color="secondary"
            @change="emitData"
        >
            <template v-slot:selection="{ item }">
                <span class="white--text">{{ item }}</span>
            </template>
        </v-select>

        <v-row>
            <v-col cols=3 sm="5" lg="2">
                <v-select
                    v-model="operator"
                    color="secondary"
                    :items="['=', '>', '<']"
                    @change="emitData"
                >
                    <template v-slot:selection="{ item }">
                        <span class="white--text">{{ item }}</span>
                    </template>
                </v-select>
            </v-col>

            <v-col cols="10" sm="6">
                <v-dialog
                    v-if="isTime"
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="value"
                    persistent
                    width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="value"
                            label="value"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            class="white-input"
                            v-on="on"
                            @input="emitData"
                        />
                    </template>
                    <v-time-picker
                        v-if="modal"
                        format="24hr"
                        v-model="value"
                        @change="emitData"
                        @click:hour="emitData"
                        @click:minute="emitData"
                        full-width
                    >

                        <v-spacer/>

                        <v-btn
                            text
                            color="primary"
                            @click="modal = false"
                        >
                            Cancel
                        </v-btn>

                        <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog.save(value)"
                        >
                            OK
                        </v-btn>
                    </v-time-picker>
                </v-dialog>
                <v-text-field
                    v-else
                    v-model="value"
                    label="value"
                    color="secondary"
                    class="white-input"
                    @input="emitData"
                />
            </v-col>

            <slot>
                <v-col cols="10" sm="6"/>
            </slot>
        </v-row>
    </div>
</template>

<script>
const timeParameters = ['Bedtime', 'Get-out-of-bed time'];

export default {
    name: "ControlAdvancedSearchItem",

    props: {parameters: Array, id: Number},

    data() {
        return {
            parameter: '',
            operator: '=',
            value: '',
            modal: false,
        }
    },

    computed: {
        isTime() {
            return !!(this.parameter && timeParameters.some(item => item === this.parameter));
        }
    },

    methods: {
        emitData() {
            const payload = {
                id: this.id,
                parameter: this.parameter,
                operator: this.operator,
                value: this.value,
                isTime: !!this.isTime,
                isDirty: false,
            };

            if (!(this.parameter && this.operator && this.value)) {
                payload.isDirty = true;
            }
            this.$emit('change', payload);
        }
    },
}
</script>

