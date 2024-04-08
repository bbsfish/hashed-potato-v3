<template>
  <div>
    <table>
      <tr>
        <th
          v-for='(row, idxA) of icolumns' :key='idxA'
          @click='sortBy(row.field)'
          >
          {{row.title}}
        </th>
      </tr>
      <tr v-for='(dataRow, idxB) of tdata' :key='1000*(idxB+1)'>
        <td v-for='(columnsRow, idxC) of icolumns' :key='["k", idxC].join("-")'>
          {{dataRow[columnsRow.field]}}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['idata', 'icolumns', 'show'],
  data() {
    return {
      tdata: this.idata,
      currentSortField: '',
    };
  },
  methods: {
    sortBy(targetField) {
      if (targetField === this.currentSortField) {
        // 2回連続押しで Order by Desc
        this.tdata.sort((a, b) => {
          const A = a[targetField];
          const B = b[targetField];
          if (typeof A === 'number') return -1 * (A - B);
          if (typeof A === 'string') return -1 * a[targetField].localeCompare(b[targetField], 'ja');
          return 0;
        });
        this.currentSortField = '';
      } else {
        // 1回押し(通常)で Order by Desc
        this.tdata.sort((a, b) => {
          const A = a[targetField];
          const B = b[targetField];
          if (typeof A === 'number') return A - B;
          if (typeof A === 'string') return a[targetField].localeCompare(b[targetField], 'ja');
          return 0;
        });
        this.currentSortField = targetField;
      }
    },
  },
  watch: {
    idata(next) {
      this.tdata = next;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
