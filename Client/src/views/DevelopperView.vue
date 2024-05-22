<template>
  <div class="dev">
    <AppMainHeader title="Dev"/>
    <h3>Services</h3>
    <section>
      <ServiceTableShow
        :key="table.key"
        :services="this.xo.services.service"
        @onedit="onTableEdit"
      />
    </section>
    <EditServiceWindow
      :key="edit.key"
      :service="edit.targetService"
      @onsave="onEditorSave"
      @oncancel="onEditorCancel"
    />
  </div>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
import EditServiceWindow from '@/components/EditServiceWindow.vue';
import ServiceTableShow from '@/components/ServiceTableShow.vue';

export default {
  name: 'DevelopperView',
  components: {
    AppMainHeader, EditServiceWindow, ServiceTableShow,
  },
  data() {
    return {
      table: {
        key: 0,
      },
      edit: {
        targetService: null,
        targetIndex: -1,
        key: 0,
      },
      xo: {
        services: {
          service: [
            { id: 'abc', credential: { id: 'abcID', password: 'abcPASS' }, scope: ['aaa', 'bbb', 'ccc'] },
            { id: '123', credential: { id: '123ID', password: '123PASS' } },
            { id: 'abc', credential: { id: 'abcID', password: 'abcPASS' }, scope: ['aaa', 'bbb', 'ccc'] },
          ],
        },
        youare: {
          aaa: 'xxx',
          bbb: 'yyy',
        },
      },
    };
  },
  methods: {
    onTableEdit({ index, service }) {
      this.edit.targetService = service;
      this.edit.targetIndex = index;
      this.edit.key += 1;
    },
    onEditorSave({ service }) {
      const idx = this.edit.targetIndex;
      Object.assign(this.xo.services.service[idx], service);
      this.tableUpdate();
    },
    onEditorCancel({ service }) {
      this.$log.debug('onCancel', service);
    },
    tableUpdate() {
      this.table.key += 1;
    },
  },
};

</script>
