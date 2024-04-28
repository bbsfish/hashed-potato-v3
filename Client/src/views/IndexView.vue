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
      <h1>ポテトシステム - hashed-potato とは</h1>
      <hr>
      <div className="document">
        <h2>インターネット上の個人情報を管理し、プライバシーを守ります</h2>
        <div>
          <span className="emphasis">インターネットにある個人情報を管理し、保護することは重要です。</span>
          hashed-potatoは、この管理を手助けするシステムです。
        </div>
        <div>
          例えば、あなたがインターネットで買い物をすることを考えてください。
          アカウントを作成するために、電話番号やメールアドレスなど必要な個人情報を登録し、
          パスワードで<span className="key">鍵</span>をかけていることでしょう。
          そこはあなた専用の<span className="vault">ロッカー</span>であり、個人情報は、
          そこにしまわれた大切な<span className="asset">資産</span>であると、
          考えることができます。
        </div>
        <div>
          <figure>
              <img src="@/assets/img/weare1.png" alt="個人情報が無秩序に拡散">
              <figcaption>
                素晴らしいウェブサイトであふれている今日では、あなたの<span className="key">鍵</span>の数は膨れ上がり、
                どの<span className="vault">ロッカー</span>に
                どんな<span className="asset">資産</span>がしまわれているか、
                わからなくなってくるはずです。
                （複数のロッカーに同じ鍵をかけてはいけません！）
              </figcaption>
          </figure>
        </div>
        <div>
          <figure>
            <img src="@/assets/img/weare2.png" alt="個人情報の所在を明確化">
            <figcaption>
              hashed-potatoとウェブサイトがパートナーであるならば、
              <span className="emphasis">どこにどんな<span className="asset">資産</span>がしまわれているのかを
              管理することができるようになります。</span>
              また、大量の<span className="key">鍵</span>に悩ませれることも少なくなることでしょう。
            </figcaption>
          </figure>
        </div>
      </div>
      <div className="document">
        <h2>個人情報を秘匿化し、プライバシーを守ります</h2>
        <div>
          <span className="emphasis">
              個人情報はその人の資産です。
              個人情報の実体をコピーし、外部に送信することには慎重にならなければなりません。
          </span>
        </div>
        <div>
          <figure>
              <img src="@/assets/img/weare3.png" alt="個人情報のコピーを送信">
              <figcaption>
                  <span className="vault">ロッカー</span>のセキュリティが何らかの原因で壊れた場合、
                  そこにあるあなたの<span className="asset">資産</span>も危険にさらされてしまいます。
              </figcaption>
          </figure>
        </div>
        <div>
          <figure>
              <img src="@/assets/img/weare4.png" alt="個人情報の代替情報を送信">
              <figcaption>
                  hashed-potatoでは、<span className="asset">資産</span>を、その場所のみを記した"手形"に置き換え、
              <span className="emphasis">
                  可能な限り<span className="asset">資産</span>を手元に保持します。
              </span>
              </figcaption>
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
