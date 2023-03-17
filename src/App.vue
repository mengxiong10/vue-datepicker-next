<script lang="ts">
    import { format, parse } from "date-format-parse"
    import { defineComponent } from "vue"
    import DatePicker from "vue-datepicker-next"

    export default defineComponent({
        components: {
            DatePicker,
        },
        data() {
            return {
                inputProps: {
                    clearable: false,
                    editable: false,
                    placeholder: "test placeholder",
                    inputAttr: {
                        name: "test",
                        id: "test",
                    },
                },
                shortcuts: [
                    {
                        text: "range",
                        onClick() {
                            return [new Date(), new Date()]
                        },
                    },
                ],
                value: new Date(),
                append: false,
                rangeValue: [new Date(2019, 9, 4, 8, 30, 0), new Date(2019, 9, 4, 18, 30, 0)],
                formatter: {
                    stringify(date: Date) {
                        return format(date, "DD/MMM/YYYY")
                    },
                    parse(value: string) {
                        return parse(value, "DD/MMM/YYYY")
                    },
                    getWeek(date: Date) {
                        return date.getDate()
                    },
                },
            }
        },
        methods: {
            handleChange() {
                console.log("change")
            },
            handleUpdate(val: Date) {
                this.value = val
            },
        },
    })
</script>

<template>
    <div>
        <button @click="append = !append">ass</button>
        <DatePicker
            v-model:value="value"
            v-bind="inputProps"
            :clearable="false"
            :append-to-body="append"
            type="datetime"
            :time-picker-options="{ start: '00:00', end: '09:00', step: '00:30' }"
            :disabled-date="(date) => date < new Date(2021, 10, 9)"
            :holiday-clickable="false"
            :holiday-date="(date)=>date > new Date()"
            :open="true"
        ></DatePicker>
        <DatePicker
            v-model:value="rangeValue"
            :append-to-body="false"
            range
            :shortcuts="shortcuts"
            :disabled-date="(date) => date < new Date(2021, 10, 9)"
            :editable="false"
            :holiday-clickable="false"
            :holiday-date="(date)=>date > new Date()"
        ></DatePicker>
        <DatePicker v-model:value="value"
                    :holiday-clickable="true"
                    :holiday-date="()=>true">
        </DatePicker>
    </div>
</template>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* color: #2c3e50; */
        margin-top: 60px;
        margin-left: 60px;
    }

    .holiday {
        color: #ff0000;
    }
</style>
