---
name: story
description: |
  新しいストーリーを企画するスキル。ユーザーの自然言語の要望を、
  構造化されたREQUIREMENT.md（Why/What/How/Edge Cases）と
  初期状態のCONTEXT.jsonに変換する。
  /story ランキング表示がほしい のように使う。
---

新しいストーリーを企画します。

ユーザーの要望: $ARGUMENTS

## Step 1: プロジェクトの現在地を把握する

以下を**この順番で**読み込む。既存コードとの整合性を保つために、
何が作られていて、どんな制約があるかを先に理解する必要がある。

1. **CLAUDE.md** を読む
   - アプリの概要（ランチルーレット）と技術制約を把握する
   - ファイルアクセス境界を確認する（`src/data/` は読み取り専用など）

2. **PROJECT_RULES.md** を読む
   - 技術スタック: Next.js 14 (App Router), TypeScript (strict), Tailwind CSS, localStorage
   - ディレクトリ構成: `src/components/`, `src/lib/`, `src/app/`, `src/data/`
   - コーディング規約: 関数コンポーネント、PascalCase、`lib/storage.ts` 経由のlocalStorage
   - 禁止事項: 外部API、DB、`any`型、`console.log`残留

3. **stories/ 配下の全 CONTEXT.json** を読む
   - 各ストーリーの status（completed / in_progress / pending）を確認
   - completed ストーリーの `created_files` を見て、既存のファイル構成を把握する
   - 例: story-001 で RestaurantCard.tsx, Roulette.tsx, storage.ts 等が作成済み

## Step 2: ストーリー番号を決める

stories/ ディレクトリを確認し、最大番号の次の連番にする。
- story-001, story-002 が存在 → **story-003**
- ゼロパディング3桁（001, 002, 003...）

slug はストーリーの内容を英語ケバブケースで要約する。
- 例: "003-ranking", "003-comment", "003-filter"

## Step 3: REQUIREMENT.md を生成する

story-002/REQUIREMENT.md を手本として、同じ構造で新ストーリーの仕様を書く。

具体的に気をつけること:
- **Why**: 「誰が」「何に困っていて」「どうなりたいか」を1-2文で書く。抽象的にしない
- **What / 必須要件**: ユーザーの要望から具体的な機能に分解する。3-7個が目安。各項目は `- [ ]` 形式
- **What / 受け入れ条件**: 画面を見て○×が判定できる文で書く。「〇〇すると△△される」の形式。これが後で CONTEXT.json の acceptance_criteria になる
- **How**: PROJECT_RULES.md の制約に沿って、具体的なファイルパスを書く
  - 既存の `src/components/` のどのファイルを変更するか
  - 新規ファイルのパスと責務（例: `src/hooks/useXxx.ts` — Xxxロジックのカスタムフック）
  - `src/lib/types.ts` に追加する型、`src/lib/storage.ts` への拡張
- **Edge Cases**: ユーザーが言及しなかった境界条件を自分で考えて追加する
  - 連打、リロード、空入力、0未満、localStorage無効化 などを検討

## Step 4: CONTEXT.json を生成する

Step 3 で書いた受け入れ条件をそのまま acceptance_criteria のキーにする。

```json
{
  "story": "003-slug",
  "title": "日本語タイトル",
  "status": "pending",
  "created_files": [],
  "modified_files": [],
  "acceptance_criteria": {
    "受け入れ条件1の文言そのまま": false,
    "受け入れ条件2の文言そのまま": false
  },
  "decisions": []
}
```

注意: acceptance_criteria のキーの文言は、REQUIREMENT.md の受け入れ条件と完全に一致させる。
後で /finish がこのキーと REQUIREMENT.md を突き合わせて検証するため。

## Step 5: ユーザーに確認して保存する

REQUIREMENT.md と CONTEXT.json の**全文**を表示する。部分的な要約ではなく全文。

以下を確認する:
- 「この仕様で stories/story-XXX/ に保存してよいですか？」
- 「追加・修正したい箇所があれば教えてください」

承認後:
1. `stories/story-XXX/` ディレクトリを作成
2. `REQUIREMENT.md` を保存
3. `CONTEXT.json` を保存
4. 完了メッセージ: 「stories/story-XXX/ を作成しました。`/start` で実装を開始できます。」
