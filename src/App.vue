<script lang="ts">
import { defineComponent } from 'vue';
import DatePicker from 'vue-datepicker-next';
import { format, parse } from 'date-format-parse';

export default defineComponent({
  components: {
    DatePicker,
  },
  data() {
    return {
      shortcuts: [
        {
          text: 'range',
          onClick() {
            return [new Date(), new Date()];
          },
        },
      ],
      value: new Date(),
      append: false,
      rangeValue: [new Date(2019, 9, 4, 8, 30, 0), new Date(2019, 9, 4, 18, 30, 0)],
      formatter: {
        stringify(date: Date) {
          return format(date, 'DD/MMM/YYYY');
        },
        parse(value: string) {
          return parse(value, 'DD/MMM/YYYY');
        },
        getWeek(date: Date) {
          return date.getDate();
        },
      },
    };
  },
  methods: {
    handleChange() {
      console.log('change');
    },
    handleUpdate(val: Date) {
      this.value = val;
    },
  },
});
</script>

<template>
  <div>
    <button @click="append = !append">ass</button>
    <DatePicker
      v-model:value="value"
      :clearable="false"
      multiple
      :append-to-body="append"
      type="date"
      :disabled-date="(date) => date < new Date(2021, 10, 9)"
      :open="true"
    ></DatePicker>
    <DatePicker
      v-model:value="rangeValue"
      :append-to-body="false"
      range
      :shortcuts="shortcuts"
      :editable="false"
    ></DatePicker>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
