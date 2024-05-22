<template>
  <div v-if="isValidSrv" class="service-table-show">
    <table>
      <caption>Services</caption>
      <thead>
        <tr>
          <th scope="col">Service ID</th>
          <th scope="col">Credential</th>
          <th scope="col">Scope</th>
        </tr>
      </thead>
      <tbody :key="tableKey">
        <tr v-for="(serv, servIndex) of srvs"
          :key="servIndex" @click="onEditData(servIndex)">
          <td>{{ serv.id }}</td>
          <td>
            <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
            <label v-if="serv.credential.id"
              :for="'id_' + servIndex">
              ID: <span :id="'id_' + servIndex">{{ serv.credential.id }}</span>
            </label>
            <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
            <label v-if="serv.credential.password" :for="'pass_' + servIndex">
              Pass: <span :id="'pass_' + servIndex">{{ serv.credential.password }}</span>
            </label>
          </td>
          <td v-if="serv.scope != undefined">{{ serv.scope.join(', ') }}</td>
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
  thead {
    background-color: rgb(0, 0, 0);
    color: white;
  }
  tbody {
    tr {
      background-color: white;
    }
    tr {
      &:nth-child(odd) {
        background-color: gray;
      }
      &:nth-child(even) {
        border-bottom: 1px solid black;
      }
    }
  }
}
</style>
