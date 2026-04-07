---
name: start
description: |
  ストーリーの実装を開始するスキル。全ドキュメントを決められた順番で読み込み、
  受け入れ条件をチェックリストで表示し、新規/変更ファイルを明示した実装計画を
  提示して、ユーザーの承認を得てから実装に入る。
  /start で自動選択、/start story-003 で指定ストーリーを開始。
---

ストーリーの実装を開始します。

対象ストーリー指定: $ARGUMENTS

## Step 1: ドキュメントを決められた順番で読む

順番が重要。ルールを先に理解し、既存コードの構造を掴んでから仕様に入る。
順番を変えると、既存コードと矛盾する計画を立てるリスクがある。

1. **CLAUDE.md** を読む
   - 作業ルール（計画先行・仕様書優先・既存コード尊重・CONTEXT.json更新）を確認
   - ファイルアクセス境界を確認（`src/data/` と REQUIREMENT.md は読み取り専用）
   - 禁止事項を確認（`rm -rf`, `git push --force`, 仕様の勝手な変更）

2. **PROJECT_RULES.md** を読む
   - 技術スタック: Next.js 14 (App Router), TypeScript (strict), Tailwind CSS
   - ディレクトリ構成と命名規約: コンポーネントはPascalCase、`lib/storage.ts`経由のlocalStorage
   - 禁止: 外部API, DB, `any`型, `console.log`残留

3. **stories/ 配下の全 CONTEXT.json** を読む
   - 各ストーリーの status を確認
   - completed ストーリーの `created_files` で、既存ファイル構成を把握
   - 例: story-001 の created_files には RestaurantCard.tsx, Roulette.tsx, storage.ts, types.ts 等がある

4. **実装対象のストーリーを特定する**（CLAUDE.md「ストーリーの特定ルール」に従う）
   - 引数でストーリー番号が指定されている場合（例: `/start story-003`）→ そのストーリーを対象にする
   - 引数なしの場合:
     - `status` が `in_progress` のストーリーを最優先で選ぶ
     - `in_progress` がなければ、`pending` のうち番号が最も小さいものを選ぶ
   - 対象が見つからない場合 → 「実装対象のストーリーがありません。`/story` で新しいストーリーを作成してください。」と伝えて終了

5. **対象ストーリーの REQUIREMENT.md** を読む
   - Why/What/How/Edge Cases の全セクションを確認
   - How セクションの技術指定（どのファイルを変更・作成するか）に注目

## Step 2: 受け入れ条件をチェックリストで表示する

CONTEXT.json の `acceptance_criteria` を読み、以下の形式で表示する:

```
## story-XXX: タイトル の受け入れ条件

□ 投票ボタンが表示される
□ 投票済み状態が表示される
□ 投票数が即座に反映される
□ 取り消しができる
□ 同じお店に2回投票できない
□ リロードしても投票が保持される
□ ルーレット機能が壊れていない
```

既に true の項目は ✅ で表示する（in_progress で再開した場合）。

## Step 3: 実装計画を提示する

REQUIREMENT.md の How セクションと、Step 1 で把握した既存コード構成を元に、
以下の形式で**具体的なファイルパス**を含む計画を提示する:

```
## 実装計画

### 新規作成ファイル
- src/components/VoteButton.tsx — 投票ボタンコンポーネント（voted/count/onToggle props）
- src/hooks/useVote.ts — 投票ロジックのカスタムフック（hasVoted, voteCount, toggleVote）

### 変更ファイル
- src/lib/types.ts — VoteRecord インターフェースを追加
- src/lib/storage.ts — getVisitorId, loadVotes, saveVotes 関数を追加
- src/components/RestaurantCard.tsx — VoteButton を統合、props に voted/voteCount/onToggleVote を追加
- src/components/RestaurantList.tsx — useVote フックを使用し、各カードに投票状態を渡す

### 変更しないファイル（壊さないことを明示）
- src/components/Roulette.tsx — 既存のルーレット機能はそのまま
- src/data/restaurants.ts — 初期データは読み取り専用

### 実装順序
1. src/lib/types.ts に VoteRecord 型を追加（依存なし）
2. src/lib/storage.ts に投票関連の関数を追加（types.ts に依存）
3. src/hooks/useVote.ts を新規作成（storage.ts に依存）
4. src/components/VoteButton.tsx を新規作成（UIのみ、ロジックなし）
5. src/components/RestaurantCard.tsx に VoteButton を統合
6. src/components/RestaurantList.tsx で useVote を接続
```

上記は story-002 の場合の例。実際の計画は対象ストーリーの REQUIREMENT.md に基づいて作る。

計画に含めること:
- ファイルパスは `src/` からの相対パスで正確に書く
- 各ファイルの責務を1行で説明する
- 依存関係を考慮した実装順序（依存がないものから先に）
- 変更しないファイルを明示する（特に Roulette.tsx と src/data/）

## Step 4: 承認を得てから実装を開始する

計画を表示した後:

「この計画で進めてよいですか？変更点があれば教えてください。」

承認後:
1. CONTEXT.json の status を `"in_progress"` に更新する
2. Step 3 の実装順序に沿って、1ファイルずつ実装する
3. 新規ファイルは Write、既存ファイルは Edit で変更する
4. 各ファイルの完了時に、何を作成/変更したかを1行で報告する

実装中に設計上の選択肢がある場合（例: コンポーネント分割の粒度、データ構造の選び方）は、
選択肢と推奨理由を添えてユーザーに確認する。勝手に判断しない。
