<template>
  <div className="index">
    <div className="keyvisual">
      <div className="keyvisual__message">
        <p>
          Hello World
          <br>新しいシングルサインオン
        </p>
      </div>
      <div className="keyvisual__start">
        <router-link to="/start" className="keyvisual__start--btn">Get Started</router-link>
      </div>
    </div>
    <AppMainHeader title="概要" description="Hashed Potato とは" />
    <MarkdownParser pubfile="/doc/index.md" />
  </div>
</template>

<script>
import AppMainHeader from '@/components/AppMainHeader.vue';
import MarkdownParser from '@/components/MarkdownParser.vue';

export default {
  name: 'IndexView',
  components: {
    AppMainHeader,
    MarkdownParser,
  },
};
</script>

<style lang="scss" scoped>
  @use "@/assets/styles/color.scss" as c;
  @use "@/assets/styles/mediaquery.scss" as m;
  .keyvisual {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    gap: 1rem;
    .keyvisual__message {
      p {
        text-align: center;
        font-size: 2rem;
        font-weight: bold;
      }
    }
    .keyvisual__start {
      .keyvisual__start--btn {
        border: 1px solid c.cp("blue");
        border-radius: 30px;
        padding: 3px 6px;
        text-decoration: none;
        &:visited, &:active {
          color: c.cp("blue");
        }

        &:hover {
          cursor: pointer;
          color: c.cp("blue", "hovered");
          transition: var(--trs-duration);
          border: 1px solid c.cp("blue", "hovered");
        }
      }
    }
  }

  section {
    margin: 0 auto;

    img {
      width: 100%;
      @include m.mq(pc) {
        width: 80%;
      }
      max-width: 500px;
    }
  }
</style>
