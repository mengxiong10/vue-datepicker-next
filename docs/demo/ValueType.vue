<template>
  <div class="box">
    <section>
      <p>format</p>
      <date-picker v-model:value="value2" value-type="format" format="YYYY-MM-DD"></date-picker>
      <p>
        <code>v-model:value = {{ value2 }}</code>
      </p>
    </section>
    <section>
      <p>date (Date Object)</p>
      <date-picker v-model:value="value1" value-type="date"></date-picker>
      <p>
        <code>v-model:value = {{ value1 }}</code>
      </p>
    </section>
    <section>
      <p>timestamp</p>
      <date-picker v-model:value="value3" value-type="timestamp"></date-picker>
      <p>
        <code>v-model:value = {{ value3 }}</code>
      </p>
    </section>
    <section>
      <p>DD/MM/YYYY</p>
      <date-picker v-model:value="value4" value-type="DD/MM/YYYY" format="YYYY-MM-DD"></date-picker>
      <p>
        <code>v-model:value = {{ value4 }}</code>
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ValueType',
  data() {
    return {
      value1: new Date(2019, 9, 9),
      value2: '2019-10-09',
      value3: new Date(2019, 9, 9).getTime(),
      value4: '09/10/2019',
    };
  },
};
</script>
