<template>
  <div class="markdown-parser markdown" v-html="content"></div>
</template>

<script>
import 'highlight.js/styles/default.css'; // eslint-disable-line import/no-extraneous-dependencies
import axios from 'axios'; // eslint-disable-line import/no-extraneous-dependencies
import MarkdownIt from 'markdown-it'; // eslint-disable-line import/no-extraneous-dependencies
import hljs from 'highlight.js'; // eslint-disable-line import/no-extraneous-dependencies

const md = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        console.log('hljs.highlight(str, { language: lang }).value', hljs.highlight(str, { language: lang }).value);
        return `<code class='hljs'>${hljs.highlight(str, { language: lang }).value}</code>`;
      } catch (__) {
        console.error(__);
      }
    }

    return `<code class='hljs'>${str}</code>`; // 使用言語が見つからない場合はハイライトなしの空文字を返す
  },
});

// インラインコード (e.g. `foo`) のハイライトを追加
md.renderer.rules.code_inline = (tokens, idx) => {
  const token = tokens[idx];
  return `<code class="hljs">${token.content}</code>`;
};

export default {
  name: 'MarkdownParser',
  props: {
    // コンテンツを直接渡す場合 (優先)
    source: {
      type: String,
      default: null,
    },
    // Public のファイル URL を指定
    pubfile: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      content: '',
    };
  },
  methods: {
    setContent(contentText) {
      this.content = md.render(contentText);
    },
    async fetchFile(fileURL) {
      try {
        const response = await axios.get(fileURL);
        return response.data;
      } catch (error) {
        console.error(error);
        return '# ファイルが見つかりませんでした';
      }
    },
  },
  async created() {
    const { source, pubfile } = this;
    if (source) {
      this.setContent(source);
    } else {
      this.$log.debug('@MarkdownParser Import file URL: ', pubfile);
      const mdText = await this.fetchFile(pubfile);
      this.setContent(mdText);
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
