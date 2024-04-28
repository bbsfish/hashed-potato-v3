<template>
  <div class="linkfieldshow">
    <p>Type: {{ getType() }}</p>
    <p>Scope: {{ getScope() }}</p>
    <p>Requester ID: {{ getRequesterId() }}</p>
  </div>
</template>

<script>
export default {
  name: 'LinkFieldShow',
  components: {},
  props: {
    content: {
      redirect_uri: String,
      scope: Array,
      type: String,
      self_request_auth_value: String,
      self_request_auth: String,
      requester_id: String,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    getContent() {
      if (this.content === null) return {};
      return this.content;
    },
    getType() {
      if ('type' in this.getContent()) return this.content.type;
      return '';
    },
    getScope() {
      if ('scope' in this.getContent()) {
        if (typeof this.content.scope === 'object') return this.content.scope.join(', ');
        return 'none';
      }
      return '';
    },
    getRequesterId() {
      if ('requester_id' in this.getContent()) return this.content.requester_id;
      return '';
    },
  },
};
</script>
