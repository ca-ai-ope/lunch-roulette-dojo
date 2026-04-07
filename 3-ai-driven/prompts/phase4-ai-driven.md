# Phase 4: AI駆動開発 — 投票機能をAIチームメンバーとして実装

## 仕様駆動開発からの積み上げ — 1つずつ追加して育てる

| Phase 3 で体験 | Phase 4 で追加 | なぜ必要？ |
|---|---|---|
| SPEC.md（仕様書） | REQUIREMENT.md（ストーリー単位の仕様） | 機能ごとに仕様を分離 |
| CLAUDE.md（SSoT指示） | CLAUDE.md（ルール・参照・境界・ワークフローを追記） | AIが自律的に判断できるように |
| — | PROJECT_RULES.md（技術規約） | コーディングスタイルを統一 |
| — | CONTEXT.json（進捗の記録） | AIに「記憶」を持たせる |

---

## ステップ1: Destination確認（2分）

対象ストーリーの成功条件（初期状態では story-002: 投票機能）:
- 各レストランに投票ボタン
- 1人1票制限
- 投票の取り消し可能
- 投票数のリアルタイム表示
- 既存カード・ルーレットに統合

---

## ステップ2: CLAUDE.md 育成（3分）

`templates/CLAUDE-full.md` を `CLAUDE.md` にコピーして、自分のプロジェクトに合わせてカスタマイズします。

```bash
cp templates/CLAUDE-full.md CLAUDE.md
```

CLAUDE.md には以下が含まれています：
- AIの役割定義
- 参照すべきドキュメントの順番（PROJECT_RULES.md / CONTEXT.json）
- 作業ルール（計画先行・仕様書優先・CONTEXT.json更新）
- ファイルアクセス境界（読み取り専用 / 読み書き）
- 禁止事項

> 自分で編集・追記してOK。AIはこのファイルを自動で読みます。

---

## ステップ3: 実装（12分）

### スキルを使う場合（推奨）:
```
/start
```
AIが自動的に以下を行います：
1. ドキュメントを順番に読む
2. 受け入れ条件を一覧表示
3. 実装計画を提示
4. **あなたの承認を待ってから** 実装開始

### 手動でプロンプトを入力する場合:
```
対象ストーリーの REQUIREMENT.md を読んで、実装計画を立ててください。
計画には新規作成ファイルと変更ファイルを明示してください。
承認したら実装を開始します。
```

### 途中経過を確認したいとき:
```
/progress
```
受け入れ条件の達成状況が一覧で表示されます。

---

## ステップ4: CONTEXT.json 更新（8分）

### スキルを使う場合（推奨）:
```
/finish
```
AIが自動的に以下を行います：
1. TypeScript 型チェック（`npx tsc --noEmit`）
2. コード品質チェック（`node scripts/check-code.mjs`）
3. 受け入れ条件を1つずつ確認
4. CONTEXT.json を完了状態に更新
5. 判断理由（decisions）を記録

### 手動で更新する場合:
```
対象ストーリーの実装が完了しました。
CONTEXT.json を更新してください。
- status: "completed"
- created_files と modified_files を正確に記録
- acceptance_criteria を全て true に
- decisions に判断理由を記録
```

---

## スキル一覧

Claude Code で `/` を入力するとスキルが表示されます。

| コマンド | いつ使う？ | 何をする？ |
|---|---|---|
| `/story 〇〇` | 新機能を企画するとき | 要件を構造化 → REQUIREMENT.md + CONTEXT.json 生成 |
| `/start` | 実装を始めるとき | ドキュメント読み込み → 計画提示 → 承認後に実装 |
| `/finish` | 実装が終わったとき | 型チェック → 品質チェック → 受け入れ条件確認 → CONTEXT.json 更新 |
| `/progress` | 途中で進捗を確認したいとき | ストーリーの状況と残りの受け入れ条件を表示 |

### スキルの流れ

```
/story 〇〇の機能がほしい（任意: 新ストーリー作成）
  ↓ 既存ストーリーの状態を確認
  ↓ 要件を Why/What/How/Edge Cases に構造化
  ↓ REQUIREMENT.md + CONTEXT.json を生成
  ↓ 「この内容で作成してよいですか？」
  Done!

/start
  ↓ ドキュメント読み込み
  ↓ 受け入れ条件の確認
  ↓ 実装計画の提示
  ↓ 「この計画で進めてよいですか？」
  ↓ 承認 → 実装開始
  :
  : （実装中）
  :
/progress（任意）
  ↓ 進捗確認
  :
  : （実装続行）
  :
/finish
  ↓ 型チェック（npx tsc --noEmit）
  ↓ コード品質チェック（node scripts/check-code.mjs）
  ↓ 受け入れ条件を1つずつ ✅/❌ で確認
  ↓ 全て ✅ → CONTEXT.json を更新
  ↓ 「更新内容を確認してください」
  Done!
```

---

## Vibe Coding / 仕様駆動開発 との違いを体感するポイント
- AIは既存コードの構造を **理解** しているか？（CONTEXT.json の効果）
- AIは **計画を立ててから** 実装しているか？（CLAUDE.md の作業ルール）
- AIは **既存機能を壊さず** に新機能を追加できているか？（project-rules の効果）
- CONTEXT.json があることで、**別のメンバーが明日続きを書ける** か？
