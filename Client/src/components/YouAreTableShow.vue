<template>
  <div v-if="isValid" class="you-are-table-show">
    <table>
      <caption>Personal Infomation</caption>
      <thead>
        <tr>
          <th scope="col">Key</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) of rows" :key="index"
          @click="onEditData(row.key)">
          <td>{{ row.key }}</td>
          <td>{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'YouAreTabelShow',
  props: {
    /** @type {Object} */
    source: {
      type: Object,
      default: (() => {})(),
    },
  },
  emits: ['onedit'],
  data() {
    return {
      isValid: false,
      rows: [],
    };
  },
  methods: {
    onEditData(key) {
      const target = this.rows.find((row) => row.key === key);
      this.$emit('onedit', { dataType: target.key, value: target.value });
    },
  },
  created() {
    const { source } = this;
    if (!source || source === null) return;

    this.rows = Object.keys(source).map((key) => ({
      key,
      value: source[key],
    }));

    this.isValid = true;
  },
};
</script>
<style lang="scss" scoped>
@use "@/assets/styles/color.scss" as c;
table {
  margin: 0 auto;
  background-color: rgb(0, 0, 0);
  th{
    padding: 0 1rem;
  }
  td {
    padding: 0 1rem;
  }
  thead {
    color: white;
  }
  tbody {
    // tr, th, td {
    //   background-color: white;
    //   border: 1px solid c.cp("black");
    // }
    tr {
      background-color: white;
      &:nth-child(odd) {
        background-color: gray;
        &:hover {
          background-color: rgb(57, 57, 57);
          color: white;
          cursor: pointer;
        }
      }
      &:nth-child(even) {
        background-color: white;
        border-bottom: 1px solid black;
        &:hover {
          background-color: rgb(198, 198, 198);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
