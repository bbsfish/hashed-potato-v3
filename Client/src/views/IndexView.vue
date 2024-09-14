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
    <section id="about">
      <h1>概要 - HASHED POTATO とは</h1>
      <hr>
      <div className="document">
        <h2>個人情報をローカルで取り扱うシングルサインオンシステム</h2>
        <div>
          ウェブサービスの急増によって、ユーザは日々複数のアカウントの管理を余儀なくされている。
          これを受け、様々なシングルサインオン（SSO）のソリューションが開発・提供されており、
          個人が SSO を利用するためには、そのような事業者の提供するサービスを利用することになる。
          しかしこの状況は、「個人情報保護」と「プライバシー保護」の観点から、好ましいとは言えない。
          そこで、これらの課題に対応した、新しい SSO システムを考案し、実装することが本研究の目的である。
          このウェブサービスは、その実装された新しい SSO システムの一部であり、「クライアント」アプリケーションと呼ばれる。
          HASHED POTATO とは、新しい SSO システム全体の名称だ。
        </div>
        <h2>従来の SSO サービスの課題</h2>
        <div>
          従来の SSO サービスには、次のふたつの課題がある。
        </div>
        <div>
          <figure>
              <img src="@/assets/img/fig-abstruct-1.png" alt="従来のSSOサービスのふたつの課題">
              <figcaption></figcaption>
          </figure>
          <figure>
              <img src="@/assets/img/fig-abstruct-2.png" alt="従来のSSOサービスのプライバシー保護上の懸念">
              <figcaption></figcaption>
          </figure>
          <figure>
              <img src="@/assets/img/fig-abstruct-3.png" alt="従来のSSOサービスの個人情報保護上の懸念">
              <figcaption></figcaption>
          </figure>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'IndexView',
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
