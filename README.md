簡易メモリスト作成アプリ

React基礎学習後3回目に作ったアプリです。  
この簡易メモリスト作成アプリは、検索・並び替え・メモの追加/編集/削除ができます。

【URL】  
https://memolist1-app.vercel.app/

【工数】  
平日の夜30分ずつ設計や使う技術の選定、実装手順を整理、  
土曜日3時間でコードを実装

【技術スタック】  
フロントエンド: React, TypeScript, Vite, React Hook Form  
テスト: Vitest, React Testing Library  
デプロイ・インフラ: Vercel  
バージョン管理: Git, GitHub  
パッケージ管理: npm  
コード品質 / コードフォーマット: ESLint, Prettier  
コードエディタ: Visual Studio Code

【実装上の工夫】  
TypeScriptを導入（リファクタリング）  
useMemoを導入しています。  
メモの個別追加・編集（インライン編集）・削除（CRUD）に対応し、localStorageで永続化しています。  
React Hook Formによる入力バリデーション（必須項目・文字数制限）を実装しています。  
検索・並び替えロジックを純粋関数（src/utils/memoUtils.ts）に切り出し、Vitest + React Testing Libraryで単体テスト・結合テストを実装しています（27件）。  
localStorageから読み込んだデータを`as`で無条件にキャストせず、型ガード（src/utils/memoValidation.ts）で実際の形を確認してから使うようにしています。想定と異なるデータが入っていた場合は初期データにフォールバックします。

【テストの実行方法】  
`npm test`

【得られた学び / 挑戦した点】  
TypeScriptでtypeエイリアスを使った型定義の使い方を学びました。  
（ここは実装後にご自身の言葉で追記してください）

【次回以降】  
カスタムフックへのロジック分離、GitHub Actionsによるlint/test/buildの自動化を予定。