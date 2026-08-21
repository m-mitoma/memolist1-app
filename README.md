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
デプロイ・インフラ: Vercel  
バージョン管理: Git, GitHub  
パッケージ管理: npm  
コード品質 / コードフォーマット: ESLint, Prettier  
コードエディタ: Visual Studio Code

【実装上の工夫】  
TypeScriptを導入（リファクタリング）  
useMemoを導入しています。  
メモの個別追加・編集・削除（CRUD）に対応し、localStorageで永続化しています。  
React Hook Formによる入力バリデーション（必須項目・文字数制限）を実装しています。

【得られた学び / 挑戦した点】  
TypeScriptでtypeエイリアスを使った型定義の使い方を学びました。  
（ここは実装後にご自身の言葉で追記してください）

【次回以降】  
テスト（Vitest + React Testing Library）の導入、型安全性の改善（as キャストの削減）を予定。