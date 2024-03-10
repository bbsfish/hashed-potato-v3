<template>
  <main>
    <div className="keyvisual">
      <div id="kv-message">Hello World</div>
      <div id="kv-start"><router-link to="/start" id="getstarted">Get Started</router-link></div>
    </div>
    <section id="about">
        <h1>ポテトシステム - hashed-potato とは</h1>
        <hr>
    </section>
    <section class="outline-list">
      <h2>インターネット上の個人情報を管理し、プライバシーを守ります</h2>
      <div>
        <span class="emphasis">インターネットにある個人情報を管理し、保護することは重要です。</span>
        hashed-potatoは、この管理を手助けするシステムです。
      </div>
      <div>
        例えば、あなたがインターネットで買い物をすることを考えてください。
        アカウントを作成するために、電話番号やメールアドレスなど必要な個人情報を登録し、
        パスワードで<span class="key">鍵</span>をかけていることでしょう。
        そこはあなた専用の<span class="vault">ロッカー</span>であり、個人情報は、
        そこにしまわれた大切な<span class="asset">資産</span>であると、
        考えることができます。
      </div>
      <div>
        <figure>
            <img src="@/assets/img/weare1.png" alt="個人情報が無秩序に拡散">
            <figcaption>
              素晴らしいウェブサイトであふれている今日では、あなたの<span class="key">鍵</span>の数は膨れ上がり、
              どの<span class="vault">ロッカー</span>にどんな<span class="asset">資産</span>がしまわれているか、
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
            <span class="emphasis">どこにどんな<span class="asset">資産</span>がしまわれているのかを
            管理することができるようになります。</span>
            また、大量の<span class="key">鍵</span>に悩ませれることも少なくなることでしょう。
          </figcaption>
        </figure>
      </div>
    </section>
    <section class="outline-list">
      <h2>個人情報を秘匿化し、プライバシーを守ります</h2>
      <div>
        <span class="emphasis">
            個人情報はその人の資産です。
            個人情報の実体をコピーし、外部に送信することには慎重にならなければなりません。
        </span>
      </div>
      <div>
        <figure>
            <img src="@/assets/img/weare3.png" alt="個人情報のコピーを送信">
            <figcaption>
                <span class="vault">ロッカー</span>のセキュリティが何らかの原因で壊れた場合、
                そこにあるあなたの<span class="asset">資産</span>も危険にさらされてしまいます。
            </figcaption>
        </figure>
      </div>
      <div>
        <figure>
            <img src="@/assets/img/weare4.png" alt="個人情報の代替情報を送信">
            <figcaption>
                hashed-potatoでは、<span class="asset">資産</span>を、その場所のみを記した"手形"に置き換え、
            <span class="emphasis">
                可能な限り<span class="asset">資産</span>を手元に保持します。
            </span>
            </figcaption>
        </figure>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'IndexView',
};
</script>

<style lang="scss" scoped>
  .keyvisual {
    height: 50vh;
    position: relative;

    div {
      position: absolute;
      text-align: center;
      width: 100%;
    }

    #kv-message {
      font-size: 1.8rem;
      font-weight: bolder;
      top: 20%;
    }

    #kv-start {
      font-size: 1.2rem;
      top: 60%;

      #getstarted {
        $blue: rgb(3, 7, 201);
        $hover-blue: rgba(3, 6, 201, 0.647);
        border: 1px solid $blue;
        border-radius: 30px;
        padding: 3px 6px;
        text-decoration: none;

        &:visited, &:active {
          color: $blue;
        }

        &:hover {
          cursor: pointer;
          color: $hover-blue;
          transition: .8s;
        border: 1px solid $hover-blue;
        }
      }
    }
  }

  section {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
  img {
    max-width: 500px;
  }
</style>
