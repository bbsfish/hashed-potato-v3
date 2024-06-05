<template>
  <div v-if="isValidSrv" class="service-table-show">
    <table>
      <caption>Services</caption>
      <thead>
        <tr>
          <th scope="col">Service ID</th>
          <th scope="col">Login ID</th>
          <th scope="col">PassWord</th>
          <th scope="col">Scope</th>
        </tr>
      </thead>
      <tbody :key="tableKey">
        <tr v-for="(serv, servIndex) of srvs"
          :key="servIndex" @click="onEditData(servIndex)">
          <td>{{ serv?.id }}</td>
          <td>{{ serv?.credential?.id }}</td>
          <td>{{ serv?.credential?.password }}</td>
          <td v-if="serv?.scope">{{ serv.scope.join(', ') }}</td>
          <td v-else>none</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ServiceTableShow',
  props: {
    /** @type {{
     * id: string,
     * scope: string[],
     * credential: { id: string, password: string },
     * }[]} */
    services: {
      type: Object,
      default: null,
    },
  },
  emits: ['onedit'],
  data() {
    return {
      isValidSrv: (this.services !== null),
      srvs: (!this.services) ? [] : this.services,
      tableKey: 0,
    };
  },
  methods: {
    onEditData(idx) {
      this.$emit('onedit', { index: idx, service: this.srvs[idx] });
    },
  },
  mounted() {
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
