# 3-ai-driven: Phase 4 — AI駆動開発（CA流）

> **人間は目的地（Why/What）を握り、AIがルート（How）を提案・実行する。**
> ルール・記憶・状態を整えることで、AIを"チームメンバー"として機能させます。

## このリポジトリについて

AI駆動開発を体験するためのリポジトリです。
Phase 3（仕様駆動開発）から一歩進み、CLAUDE.md を「AIの長期記憶」として育成し、
PROJECT_RULES.md・CONTEXT.json を使ってAIを自律的に動かします。

### 仕様駆動開発からの積み上げ

| Phase 3 で体験 | Phase 4 で追加 | なぜ必要? |
|---|---|---|
| SPEC.md（仕様書） | REQUIREMENT.md（ストーリー単位の仕様） | 機能ごとに仕様を分離 |
| CLAUDE.md（SSoT指示） | CLAUDE.md（ルール・参照・境界・ワークフローを追記） | AIが自律的に判断できるように |
| — | PROJECT_RULES.md（技術規約） | コーディングスタイルを統一 |
| — | CONTEXT.json（進捗の記録） | AIに「記憶」を持たせる |

---

## セットアップ

```bash
cd repos/3-ai-driven
npm install
claude
```

---

## リポジトリの構成 — ナビゲーションの比喩

| ファイル | 役割 | ナビに例えると |
|---|---|---|
| `CLAUDE.md` | AIの長期記憶・作業ルール・ワークフロー | ドライバーの好み・行動マニュアル |
| `PROJECT_RULES.md` | コーディング規約・技術制約 | 交通ルール |
| `stories/*/CONTEXT.json` | 各ストーリーの進捗・決定記録 | 走行ログ・現在地 |
| `stories/*/REQUIREMENT.md` | 各ストーリーの仕様 | 目的地の住所 |
| `templates/CLAUDE-full.md` | AI駆動版 CLAUDE.md の完全テンプレート | — |

---

## Phase 4 の進め方（25分）

### Step 1: Destination確認（2分）

対象ストーリーの成功条件を合意します（初期状態では story-002: 投票機能）:

- 各レストランに投票ボタン
- 1人1票制限
- 投票の取り消し可能
- 投票数のリアルタイム表示
- 既存カード・ルーレットに統合

### Step 2: CLAUDE.md 育成（3分）

`templates/CLAUDE-full.md` を `CLAUDE.md` にコピーして、自分のプロジェクトに合わせてカスタマイズします。

```bash
cp templates/CLAUDE-full.md CLAUDE.md
```

CLAUDE.md には以下が含まれています:
- AIの役割定義
- 参照すべきドキュメントの順番（PROJECT_RULES.md → CONTEXT.json）
- 作業ルール（計画先行・仕様書優先・CONTEXT.json更新）
- ファイルアクセス境界（読み取り専用 / 読み書き）
- 禁止事項

> 自分で編集・追記してOK。AIはこのファイルを自動で読みます。

### Step 3: 実装（12分）

スキルで実装を開始します:

```
/start
```

AIが自動的に以下を行います:
1. ドキュメントを順番に読む（CLAUDE.md → PROJECT_RULES.md → CONTEXT.json → REQUIREMENT.md）
2. 受け入れ条件をチェックボックス形式で一覧表示
3. 新規作成ファイル・変更ファイル・実装順を計画として提示
4. **「この計画で進めてよいですか?」と確認** → 承認後に実装開始

途中経過の確認:
```
/progress
```

### Step 4: CONTEXT.json 更新（8分）

実装が終わったら完了処理を実行します:

```
/finish
```

AIが自動的に以下を行います:
1. TypeScript 型チェック（`npx tsc --noEmit`）
2. コード品質チェック（`node scripts/check-code.mjs`）
3. 受け入れ条件を1つずつ ✅ / ❌ で確認
4. 全て ✅ なら CONTEXT.json を更新（status, files, decisions）
5. 更新結果を表示して確認を求める

---

## スキル（カスタムコマンド）

Claude Code で `/` を入力するとスキル一覧が表示されます。

| コマンド | いつ使う? | 何をする? |
|---|---|---|
| `/story` | 新機能を企画するとき | 要件を構造化 → REQUIREMENT.md + CONTEXT.json 生成 |
| `/start` | 実装を始めるとき | ドキュメント読み込み → 計画提示 → 承認後に実装（`/start story-003` で指定可） |
| `/finish` | 実装が終わったとき | 型チェック → 品質チェック → 受け入れ条件確認 → CONTEXT.json 更新（`/finish story-003` で指定可） |
| `/progress` | 途中で確認したいとき | ストーリーの状況と残タスクを表示 |

### スキルの流れ

```
/story 〇〇の機能がほしい（任意: 新ストーリー作成）
  | 既存ストーリーの状態を確認
  | 要件を Why/What/How/Edge Cases に構造化
  | REQUIREMENT.md + CONTEXT.json を生成
  | 「この内容で作成してよいですか?」
  Done!

/start
  | ドキュメント読み込み
  | 受け入れ条件の確認
  | 実装計画の提示
  | 「この計画で進めてよいですか?」
  | 承認 → 実装開始
  :
  : （実装中）
  :
/progress（任意）
  | 進捗確認
  :
  : （実装続行）
  :
/finish
  | 型チェック（npx tsc --noEmit）
  | コード品質チェック（node scripts/check-code.mjs）
  | 受け入れ条件を1つずつ ✅/❌ で確認
  | 全て ✅ → CONTEXT.json を更新
  | 「更新内容を確認してください」
  Done!
```

---

## Claude Code Hooks（自動ガードレール）

意識しなくてもAIが安全に動作するよう、Hooks が設定されています。

### ファイル編集前（PreToolUse）

| チェック | 内容 |
|---|---|
| CLAUDE.md 未設定検知 | プレースホルダーのままなら育成を促すヒントを表示 |
| REQUIREMENT.md 確認 | pending ストーリーがあれば仕様確認のリマインダーを表示 |
| ファイルアクセス境界 | `src/data/`・`REQUIREMENT.md`・`PROJECT_RULES.md` への書き込みを警告 |
| 破壊的操作ブロック | `git reset --hard`・`rm -rf`・`git push --force` 等をブロック |

### ファイル編集後（PostToolUse）

| チェック | 内容 |
|---|---|
| CONTEXT.json リマインダー | 編集のたびに `/finish` での更新を促す |
| `any` 型検出 | PROJECT_RULES.md 違反（`any` 型の使用）を自動検知 |
| ビルド失敗ガイド | `npm run build` 失敗時に修正→再検証のループを案内 |

---

## Pre-commit Hook（品質ゲート）

AIが書いたコードを commit する前に、自動で品質チェックが実行されます。

| ステップ | 内容 |
|---|---|
| 1. TypeScript 型チェック | `npx tsc --noEmit` — 型エラーがあれば commit 拒否 |
| 2. コード品質チェック | `node scripts/check-code.mjs` — 以下3項目を検出 |

### コード品質チェックの検出項目

| 項目 | 検出基準 | 理由 |
|---|---|---|
| `console.log` 残存 | 本番コード内の `console.log()` | デバッグコードの残留防止 |
| `any` 型の使用 | `: any`・`<any>`・`as any` | 型安全性の破壊防止 |
| 巨大ファイル | 200行超のファイル | AIが1ファイルに詰め込む傾向への対策 |

---

## stories ディレクトリ

```
stories/
├── story-001/
│   ├── REQUIREMENT.md   # ルーレット機能の仕様（読み取り専用）
│   └── CONTEXT.json     # ルーレット機能（completed）
└── story-002/
    ├── REQUIREMENT.md   # 投票機能の仕様（読み取り専用）
    └── CONTEXT.json     # 投票機能の進捗（pending → completed）
```

### story-001: ランチルーレット基本機能（完了済み）

| 受け入れ条件 | 状態 |
|---|---|
| お店一覧が表示される | ✅ |
| 5件のお店が登録されている | ✅ |
| ルーレットでランダムに1件選べる | ✅ |
| リロードしてもデータが保持される | ✅ |

### story-002: 投票機能（初期状態: pending）

| 受け入れ条件 | 状態 |
|---|---|
| 投票ボタンが表示される | ☐ |
| 投票済み状態が表示される | ☐ |
| 投票数が即座に反映される | ☐ |
| 取り消しができる | ☐ |
| 同じお店に2回投票できない | ☐ |
| リロードしても投票が保持される | ☐ |
| ルーレット機能が壊れていない | ☐ |

---

## リポジトリ構成

```
3-ai-driven/
├── CLAUDE.md                          # AIの長期記憶・作業ルール・ワークフロー
├── PROJECT_RULES.md                   # 技術スタック・コーディング規約
├── package.json                       # Next.js 14 + TypeScript + Tailwind CSS
├── templates/
│   └── CLAUDE-full.md                 # AI駆動版 CLAUDE.md の完全テンプレート
├── prompts/
│   └── phase4-ai-driven.md            # Phase 4 の詳細ガイド
├── scripts/
│   └── check-code.mjs                 # コード品質チェック（3項目）
├── .husky/
│   └── pre-commit                     # Pre-commit Hook（型チェック + 品質チェック）
├── .claude/
│   ├── settings.json                  # Hooks 設定（ガードレール）
│   └── skills/
│       ├── story.md                   # /story スキル定義
│       ├── start.md                   # /start スキル定義
│       ├── finish.md                  # /finish スキル定義
│       └── progress.md                # /progress スキル定義
├── stories/
│   ├── story-001/
│   │   ├── REQUIREMENT.md             # ルーレット機能の仕様（読み取り専用）
│   │   └── CONTEXT.json               # ルーレット機能の完了記録
│   └── story-002/
│       ├── REQUIREMENT.md             # 投票機能の仕様（読み取り専用）
│       └── CONTEXT.json               # 投票機能の進捗
└── src/                               # story-001 実装済みコード
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── RestaurantCard.tsx          # レストランカード（投票ボタンをここに追加）
    │   ├── RestaurantList.tsx          # レストラン一覧
    │   └── Roulette.tsx               # ルーレット（壊さない）
    ├── hooks/                          # カスタムフック（例: useVote.ts）
    ├── lib/
    │   ├── types.ts                   # 型定義（Restaurant型）
    │   └── storage.ts                 # localStorage ラッパー
    └── data/
        └── restaurants.ts             # 初期データ（読み取り専用）
```

## 技術スタック

- **Next.js 14**（App Router）
- **TypeScript**（strict mode）
- **Tailwind CSS**
- **localStorage**（データ保存・DB禁止）
- **Husky**（Pre-commit Hook）

---

## Vibe Coding / 仕様駆動開発 との違いを体感するポイント

- AIは既存コードの構造を **理解** しているか?（CONTEXT.json の効果）
- AIは **計画を立ててから** 実装しているか?（CLAUDE.md の作業ルール）
- AIは **既存機能を壊さず** に新機能を追加できているか?（PROJECT_RULES.md の効果）
- CONTEXT.json があることで、**別のメンバーが明日続きを書ける** か?
- Hooks / Pre-commit が品質の **ガードレール** として機能しているか?

---

## 評価軸

| 観点 | 見るポイント | 計測方法 |
|---|---|---|
| **Speed**（爆速度） | 最初に動いたまでの時間（分） | ストップウォッチで計測 |
| **Correctness**（要件達成度） | 受け入れ条件を満たした数 | 画面を見て動作チェック |
| **Change-resilience**（変更への強さ） | CONTEXT.json で引き継ぎ可能か | 別メンバーが読んで理解できるか |
