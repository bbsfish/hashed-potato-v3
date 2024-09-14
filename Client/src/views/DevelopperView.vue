<template>
  <div class="dev">
    <AppMainHeader title="Dev"/>
    <PopupPromptWindow />
  </div>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
import PopupPromptWindow from '@/components/PopupPromptWindow.vue';

export default {
  name: 'DevelopperView',
  components: {
    AppMainHeader,
    PopupPromptWindow,
  },
  data() {
    return {
      popupBody: [
        {
          type: 'button', name: 'name-1', value: 'Push Me', centering: true,
        },
        {
          type: 'button', name: 'name-2', value: 'Push Me', row: true,
        },
        {
          type: 'button', name: 'name-3', value: 'Push Me', row: true,
        },
        {
          type: 'input', name: 'name-4', value: '',
        },
      ],
    };
  },
  computed: {
  },
  methods: {
  },
};

</script>
