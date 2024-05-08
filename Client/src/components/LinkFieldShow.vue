<template>
  <div class="linkfieldshow">
    <p>Type: {{ type??'' }}</p>
    <p>Scope: {{ scope??'' }}</p>
    <p>Requester ID: {{ id??'' }}</p>
    <p>Redirect URI: {{ redirectURI??'' }}</p>
  </div>
</template>

<script>
export default {
  name: 'LinkFieldShow',
  components: {},
  props: {
    // visibleCheck: Object,
    fields: {
      Type: String,
      Scope: Array,
      RedirectURI: String,
      ID: String, // Requester ID
    },
  },
  data() {
    return {
      type: this.fields?.Type,
      scope: this.fields?.Scope,
      redirectURI: this.fields?.RedirectURI,
      id: this.fields?.ID,
    };
  },
  watch: {
  },
};
</script>
