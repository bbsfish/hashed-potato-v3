<template>
  <div class="reference">
    <AppMainHeader title="Reference" description="システム仕様書" />
    <MarkdownParser pubfile="/doc/reference.md" />
  </div>
</template>

<script>
import 'the-new-css-reset';
import AppMainHeader from '@/components/AppMainHeader.vue';
import MarkdownParser from '@/components/MarkdownParser.vue';

export default {
  name: 'ReferenceView',
  components: {
    AppMainHeader,
    MarkdownParser,
  },
};

</script>
