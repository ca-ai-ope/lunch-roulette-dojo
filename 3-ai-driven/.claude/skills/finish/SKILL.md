---
name: finish
description: |
  ストーリーの実装を完了するスキル。TypeScript型チェックとコード品質チェックで
  品質を確認し、受け入れ条件を実装コードを根拠に1つずつ検証し、
  CONTEXT.jsonをcompleted状態に更新する。
  /finish で自動選択、/finish story-003 で指定ストーリーを完了。
---

ストーリーの実装を完了し、CONTEXT.json に記録を残します。

対象ストーリー指定: $ARGUMENTS

CONTEXT.json の更新は単なる作業記録ではない。
次にこのプロジェクトを開いた人（別のエンジニアでも、別のAIセッションでも）が、
「何が作られ、何が変更され、なぜその判断をしたか」を理解できるようにするためのもの。
これがAI駆動開発で「AIが継続して走れる」状態を作る核心。

## Step 1: 品質チェックを実行する

2つのチェックを**両方**実行する。pre-commit hook と同じゲートを `/finish` 時点で通す。

### 1-a. TypeScript 型チェック

```bash
npx tsc --noEmit
```

- エラーが出た場合: エラー内容を表示し、修正してから再度 1-a を実行する

### 1-b. コード品質チェック

```bash
node scripts/check-code.mjs
```

- `console.log` 残留 → 該当行を削除してから再実行
- `any` 型 → `unknown` + 型ガードに修正してから再実行
- 200行超ファイル → 警告のみ（ブロックしない）

1-a と 1-b の**両方がエラーなし**になるまで Step 1 を繰り返す。

## Step 2: 受け入れ条件を1つずつ検証する

対象ストーリーを特定する（CLAUDE.md「ストーリーの特定ルール」に従う）:
- 引数でストーリー番号が指定されている場合（例: `/finish story-003`）→ そのストーリーを対象にする
- 引数なしの場合:
  - `status` が `in_progress` のストーリーを最優先で選ぶ
  - `in_progress` がなければ、`pending` のうち番号が最も小さいものを選ぶ

そのストーリーの REQUIREMENT.md と CONTEXT.json を読み、
受け入れ条件を1つずつ、**実装したコードのファイル名と具体的な実装内容を根拠に**判定する:

```
## story-002: 投票機能 の検証結果

✅ 投票ボタンが表示される
   → VoteButton.tsx を RestaurantCard.tsx に統合済み

✅ 投票済み状態が表示される
   → VoteButton が voted prop で「投票済み」テキストに切り替え

✅ 投票数が即座に反映される
   → useVote.ts の toggleVote が setState で即時更新

✅ 取り消しができる
   → toggleVote が投票済みなら vote を削除する分岐あり

✅ 同じお店に2回投票できない
   → hasVoted チェックで重複投票を防止

✅ リロードしても投票が保持される
   → saveVotes が localStorage に書き込み、useEffect で loadVotes

✅ ルーレット機能が壊れていない
   → Roulette.tsx は変更なし

結果: 7 / 7 ✅
```

**❌ がある場合:**
- 未達成の条件と、何が足りないかを具体的に説明する
- 「未達成の条件があります。実装してから再度 `/finish` を実行してください。」と伝える
- CONTEXT.json は更新**しない**。ここでスキルの実行を終了する

## Step 3: CONTEXT.json を完了状態に更新する

**全条件が ✅ の場合のみ**、対象ストーリーの CONTEXT.json を以下のように更新する:

### status
```json
"status": "completed"
```

### created_files
実装中に**新規作成**したファイルのパスを、`src/` からの相対パスで列挙する。
```json
"created_files": [
  "src/components/VoteButton.tsx",
  "src/hooks/useVote.ts"
]
```

### modified_files
既存ファイルを**変更**したもののパスを列挙する。
```json
"modified_files": [
  "src/lib/types.ts",
  "src/lib/storage.ts",
  "src/components/RestaurantCard.tsx",
  "src/components/RestaurantList.tsx"
]
```

### acceptance_criteria
全項目を `true` に更新する。

### decisions
実装中に行った設計判断を、what（何をしたか）と why（なぜそうしたか）のペアで記録する。
「何をしたか」だけでなく「なぜ」が重要。次の人が同じ判断に至った背景を理解できるように。

```json
"decisions": [
  {
    "what": "VoteButton を独立コンポーネントとして作成",
    "why": "RestaurantCard の責務を分離し、投票UIのテストを独立させるため"
  },
  {
    "what": "useVote カスタムフックで投票ロジックを管理",
    "why": "投票状態の読み書きをコンポーネントから分離し、RestaurantList で一元管理するため"
  },
  {
    "what": "visitorId を crypto.randomUUID() で生成し localStorage に保存",
    "why": "DB禁止の制約下でユーザーを識別する最もシンプルな方法"
  }
]
```

上記は story-002 の場合の例。実際の decisions は実装時の判断を記録する。

## Step 4: 更新結果を確認する

更新後の CONTEXT.json の**全文**を表示し、ユーザーに確認する:

「CONTEXT.json を更新しました。内容に問題がないか確認してください。」

その後:
- 次の pending ストーリーがあれば: 「`/start` で story-XXX の実装を開始できます。」
- なければ: 「全ストーリーが完了しました。`/story` で新しいストーリーを作成できます。」
