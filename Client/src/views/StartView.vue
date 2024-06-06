<template>
  <div className="start">
    <AppMainHeader title="Start" description="データストアを作成して、ポテトシステムを使い始めることができます"/>
    <section>
      <p>
        ポテトシステムでは、"データストア" と呼ばれるローカルファイルに、あなたのアカウント情報や個人情報を書き込んでゆきます。
        このセクションでは、あなたのデータストアを作成することができます。
      </p>
      <p>
        データストアは、以下のボタンを押すだけ作成できます。
        ボタンを押すと、ファイルが任意の名前で作成できます。わかりやすいフォルダにファイルを保管して、紛失しないようにしてください。
        ファイルの中身は、あなたのデバイスの、このブラウザだけで利用することができます。ほかのデバイスやブラウザで開くことができないことに注意して下さい。
        なお、ファイル名の初期値は "AccountStore_by_hashed-potato.XML" です。
      </p>
      <p>
        ファイルが作成されると、パスフレーズの入力が求められます。これは、ファイルの中の個人的なデータを暗号化するために使用されます。
        次にファイルを複合化するとき必要になるため、忘れないでください。忘れてしまったときに、そのデータを復元するすべはありません。
      </p>
      <p>
        それでは、さっそく以下のボタンをおして、データストアを作成しましょう。
        <CreateDatastore label='ファイルを作成する' />
      </p>
      <p>
        ポテトシステムを使い始めるためのステップはすべて完了しました。
        ファイルデータを確認および編集するためには、<router-link to='/content'>Editor</router-link>にアクセスしてください。
      </p>
    </section>
  </div>
</template>

<script>
import CreateDatastore from '@/components/CreateDatastore.vue';
import AppMainHeader from '@/components/AppMainHeader.vue';

export default {
  name: 'StartView',
  components: {
    CreateDatastore, AppMainHeader,
  },
  methods: {},
};

</script>

<style lang="scss" scoped>
  p {
    margin: 1rem 0;
  }
  a:hover {
    cursor: pointer;
  }
</style>
