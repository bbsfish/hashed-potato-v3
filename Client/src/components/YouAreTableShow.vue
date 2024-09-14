<template>
  <div v-if="isValid" class="you-are-table-show">
    <table>
      <caption>Personal Infomation</caption>
      <thead>
        <tr>
          <th scope="col">Key</th>
          <th scope="col">Index</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) of rows" :key="index"
          @click="onEditData(row.id)">
          <td>{{ row.key }}</td>
          <td>{{ row.id }}</td>
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
    /** @type {{
     *    key: string,
     *    value: string,
     *  }[]} */
    source: {
      type: Object,
      default: (() => {})(),
    },
  },
  emits: ['onedit'],
  data() {
    return {
      isValid: false,
      srcNeo: [],
      rows: [],
    };
  },
  methods: {
    onEditData(id) {
      const target = this.srcNeo.find((row) => row.id === id);
      this.$emit('onedit', { index: id - 1, info: target });
    },
  },
  created() {
    const { source } = this;
    if (!source || source === null) return;

    // Source を成形して ID やキーにアクセスしやすくする
    this.srcNeo = source.map((row, index) => {
      const key = Object.keys(row)[0];
      return {
        id: index + 1, key, value: row[key],
      };
    });

    const { srcNeo } = this;

    // SrcNeo の順番を並べ替える
    let nextRows = [];
    const keys = [];
    srcNeo.forEach((row) => {
      const curtKey = row.key;
      if (!(keys.includes(curtKey))) {
        const rowsHavingTheKey = srcNeo.filter((row2) => row2.key === curtKey);
        nextRows = nextRows.concat(rowsHavingTheKey);
        keys.push(curtKey);
      }
    });
    this.rows = nextRows;

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
