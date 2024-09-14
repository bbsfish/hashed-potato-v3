# Remote - データストアのデバイスを超えた移動
リモートサーバに、一定時間データを保管することができます。
本来は、デバイスが変わると、データストアは複合化できませんが、
複合化に必要な情報を一時的にクラウドへおくことで、デバイスの変更が可能になります。
## エンドポイント
`https://script.google.com/macros/s/AKfycbznWo6xaQyifin9k4FtPIPPxwgS-kp-XBTMxUd1AIIE04vcUrJY6BjQgyXPC7R2t5-B/exec`
## GET
`devicefileid` パラメータを指定して GET リクエストを送ると、対象の DeviceFileID を持つファイルデータを取得できます。
### パラメータ
+ devicefileid: String,
Device File ID.
### 戻り値
該当するファイルデータがあった場合、そのデータを返します。見つからない場合や、エラーの場合、エラーメッセージが返されます。いずれの場合も、JSON フォーマットです。
#### 成功時のオブジェクト
+ content: String,
データストアのファイル内容 (XML 文字列).
+ devicefileid: String,
データストアのDeviceFileID
+ key_iv: String,
データストア複合化の鍵の初期ベクトル
+ key_salt: String,
データストア複合化の鍵のソルト
+ requested_time: Number,
データが POST されたタイムスタンプ.
+ expires_in: Number,
データの最大有効タイムスタンプ.
#### 失敗時のオブジェクト
+ error: String
エラーの内容を知らせるメッセージ.

## POST
パラメータを指定して POST リクエストを送ると、ファイルデータの保管ができます。
### パラメータ
+ devicefileid: String,
Device File ID.
+ content: String,
保管するデータストアのファイル内容 (XML 文字列).
+ key_iv: String,
データストア複合化の鍵の初期ベクトル.
+ key_salt: String,
データストア複合化の鍵のソルト.
