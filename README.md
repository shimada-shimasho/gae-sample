# gae-sample
Google App Engine + node.js Sample App

* サーバー側(Google App Engine/node.js)のコードサンプルです。
* クライアント側(JavaScript)のコードは含まれていません。
----
# フォルダ構成
* routes: ルーティング先処理
* static: 静的ファイル(HTML, CSSなど)
----
# URLパス-機能
* /: 観光客向けエントリー
* /pos: 屋台向けエントリー
* /api/pos: 位置情報API(GET: 位置情報取得, POST: 位置情報登録)
* /tasks/pos_cache: 位置情報キャッシュタスク
