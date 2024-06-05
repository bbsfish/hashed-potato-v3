<template>
  <div v-if="isValidSrv" class="edit-service-window">
    <h3>データ編集</h3>
    <div class="body">
      <h4>Service ID</h4>
      <label for="serv_id">
        <input type="text" name="serv_id" id="serv_id"
          v-model="srv.id" />
      </label>

      <h4>Scope</h4>
      <div v-if="srv.scope" :key="scopeKey">
        <label v-for="(scopeType, scopeIndex) of srv.scope"
          :key="scopeIndex"
          :for="'scope_list' + scopeIndex"
        >
          <input v-model="srv.scope[scopeIndex]"
            type="text" name="scope_list" id="scope_list" />
        </label>
      </div>
      <button @click="addScope">
        追加
      </button>

      <h4>Credential</h4>
      <label for="credential_id">
        <span>ID</span>
        <input v-model="srv.credential.id"
          type="text" name="credential_id" id="credential_id" />
      </label>
      <label for="credential_password">
        <span>Password</span>
        <input v-model="srv.credential.password"
          type="text" name="credential_password" id="credential_password" />
      </label>
    </div>
    <div class="footer">
      <input type="button" value="Cancel" id="data_cancel" @click="onCancel">
      <input type="button" value="Save" id="data_save" @click="onSave">
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditServiceWindow',
  props: {
    /** @type {{
     * id: string,
     * scope: string[],
     * credential: { id: string, password: string },
     * }} */
    service: {
      type: Object,
      default: null,
    },
  },
  emits: ['onsave', 'oncancel'],
  data() {
    return {
      isValidSrv: (this.service !== null),
      srv: {
        id: this.service?.id,
        scope: this.service?.scope,
        credential: {
          id: this.service?.credential?.id,
          password: this.service?.credential?.password,
        },
      },
      scopeKey: 0,
    };
  },
  methods: {
    addScope() {
      console.log(this.srv.scope);
      if (!this.srv.scope) {
        this.srv.scope = [''];
        return;
      }
      this.srv.scope.push('');
      this.scopeKey += 1;
    },
    onSave() {
      this.$emit('onsave', { service: this.srv });
      this.isValidSrv = false;
    },
    onCancel() {
      this.$emit('oncancel', { service: this.service });
      this.isValidSrv = false;
    },
  },
  mounted() {
  },
};
</script>
<style lang="scss" scoped>
@use "@/assets/styles/color.scss" as c;
.edit-service-window {
  width: 80vw;
  min-width: 300px;
  max-width: 500px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%)
             translateY(-50%);
  padding: 1rem;
  border: 1px solid c.cp("black");
  border-radius: .5rem;
  background-color: c.cp("white");
  box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .5);

  .body {
    label {
      margin-left: 1rem;
      display: block;
      span {
        // margin-right: 1rem;
        display: inline-block;
        width: 7rem;
      }
    }
    button {
      margin-left: 1rem;
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>
