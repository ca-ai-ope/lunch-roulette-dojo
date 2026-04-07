# 2-sdd: Phase 3 — 仕様駆動開発（Spec-Driven Development）

> **Phase 2 で壊れたコードはここにはありません。**
> クリーンな状態から「仕様書を先に書いて」正しく実装し直します。

## このリポジトリについて

仕様駆動開発を体験するためのリポジトリです。
SPEC.md を SSoT（Single Source of Truth）として、AIの出力を収束させます。

Phase 2 で壊れた投票機能を、**仕様書（SPEC.md）+ CLAUDE.md を書いてから**正しく実装し直します。
GitHub Spec Kit が示す **Specify → Plan → Tasks → Implement** の縮約版です。

### Phase 2（Vibe Coding）との違い

| 観点 | Phase 2（Vibe） | Phase 3（仕様駆動） |
|---|---|---|
| 仕様書 | なし | SPEC.md を先に書く |
| AIへの指示 | 「投票機能つけて」 | SPEC.md に基づいて実装 |
| 仕様変更 | 口頭で追加 → 破綻 | SPEC.md を更新 → コード修正 |
| AIの判断基準 | なし（推測する） | SPEC.md（SSoT） |

---

## セットアップ

```bash
cd repos/2-sdd
npm install
claude
```

---

## 含まれるもの

| ファイル | 役割 | 状態 |
|---|---|---|
| `src/` | ルーレットアプリ（Phase 1 完成版） | 実装済み・正常動作 |
| `SPEC.md` | 投票機能の仕様書テンプレート | **穴埋め式 — 自分で記入** |
| `CLAUDE.md` | AIへのプロジェクト指示 | **プレースホルダー — 自分で書く** |
| `templates/CLAUDE-template.md` | CLAUDE.md の参考テンプレート | 参考資料 |
| `prompts/` | 各ステップのプロンプト集 | ガイド |

---

## Phase 3 の進め方（25分）

### 4ステップ

| ステップ | 時間 | 内容 |
|---|---|---|
| 1. Specify | 5分 | SPEC.md をチームで記入 |
| 2. Plan | 2分 | 技術/制約を追記 |
| 3. Tasks | 3分 | AIにタスク分解を出させ優先順を決める |
| 4. Implement | 15分 | AIに実装させ spec に照らして修正 |

### ハンズオンタイマー: 25分

| 目安 | やること |
|---|---|
| 0〜5分 | SPEC.md を記入（`/spec-check` で確認） |
| 5〜7分 | CLAUDE.md を記入 |
| 7〜25分 | `/implement` でAIに実装させる |
| **15分頃** | **仕様変更カード配布!** |

### Step 1: SPEC.md を記入する（5分）

`SPEC.md` を開いて、穴埋め部分をチームで議論しながら記入します。

特に議論すべきポイント:
- 1人何票まで?
- 投票の取り消しは?
- ボタン連打対策は?

```
→ prompts/01-specify.md を参照
```

### Step 2: CLAUDE.md を作成する

Claude Code は CLAUDE.md を自動で読みます。
SPEC.md を書いただけでは、AIはその存在を知りません。

```
# プロジェクト指示

## SSoT（Single Source of Truth）
このプロジェクトの仕様書は SPEC.md です。
実装・修正・判断はすべて SPEC.md を参照してください。
SPEC.md に記載のない機能は実装しないでください。
仕様変更が入った場合は、まず SPEC.md を更新してからコードを修正してください。
```

> 参考: `templates/CLAUDE-template.md` にテンプレートがあります

### Step 3: Plan + Tasks

AIに実装計画とタスク分解を出させます（まだ実装しない）。

```
→ prompts/02-plan.md、prompts/03-tasks.md を参照
```

### Step 4: Implement（15分）

AIに実装させ、SPEC.md に照らして修正します。

スキル（カスタムコマンド）を使う場合:
```
/implement
```

手動でプロンプトを入力する場合:
```
SPEC.md に従って投票機能をリファクタリング（正しく作り直し）してください。
既存のルーレット機能は壊さないこと。
実装後、SPEC.md の What セクションのチェックボックスを更新してください。
```

```
→ prompts/04-implement.md を参照
```

### 仕様変更イベント（15分頃にファシリテーターから投入）

途中でファシリテーターから仕様変更が投入されます:

**追加要件:**
1. 1ユーザー1票に制限
2. 投票の取り消しが可能
3. 投票数は即時反映

**対応手順（仕様駆動開発流）:**
1. まず SPEC.md を更新する
2. 更新された SPEC.md に基づいてコードを修正する

> NG: 「1人1票にして」→ 即コード修正（仕様とコードが乖離する）
> OK: SPEC.md を更新 → コード修正（仕様がSSoTとして機能する）

```
→ prompts/05-仕様変更対応.md を参照
```

---

## Claude Code スキル（カスタムコマンド）

Claude Code で `/` を入力するとスキル一覧が表示されます。

| コマンド | 説明 |
|---|---|
| `/spec-check` | SPEC.md の充足度をチェック（Why/What/How/Edge Cases を評価） |
| `/implement` | SPEC.md に基づいて実装（計画→承認→実装→チェックボックス更新） |

## Claude Code Hooks（自動ガードレール）

| タイミング | 内容 |
|---|---|
| ファイル編集前 | SPEC.md が未記入 or Edge Cases が穴埋め未完了なら警告 |
| ファイル編集前 | CLAUDE.md がプレースホルダーのままなら SSoT 指示追記のヒントを表示 |

---

## 振り返り（5分）

- **SPEC.md があったことで何が変わった?** AIの出力は収束した?
- **仕様変更にどう対応できた?** SPEC.md → コードの順番で対応できた?
- **Vibeとの違いは?** コードの品質・一貫性に差はあった?
- **仕様駆動開発の壁は?** AIは既存コード構造を知っている? 作業履歴を覚えている?
  → これが Phase 4（AI駆動開発）で解決される

---

## リポジトリ構成

```
2-sdd/
├── CLAUDE.md                          # AIへの指示（自分で書く）
├── SPEC.md                            # 仕様書テンプレート（穴埋め式）
├── package.json                       # Next.js 14 + TypeScript + Tailwind CSS
├── templates/
│   └── CLAUDE-template.md             # CLAUDE.md の参考テンプレート
├── prompts/
│   ├── 01-specify.md                  # Step 1: 仕様記入 + CLAUDE.md 作成
│   ├── 02-plan.md                     # Step 2: 実装計画
│   ├── 03-tasks.md                    # Step 3: タスク分解
│   ├── 04-implement.md               # Step 4: 実装
│   └── 05-仕様変更対応.md             # 仕様変更イベント対応
├── .claude/
│   ├── settings.json                  # Hooks 設定（SPEC.md 未記入警告）
│   └── skills/
│       ├── implement.md               # /implement スキル定義
│       └── spec-check.md              # /spec-check スキル定義
└── src/                               # Phase 1 完成版（ルーレットアプリ）
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── RestaurantCard.tsx
    │   ├── RestaurantList.tsx
    │   └── Roulette.tsx
    ├── lib/
    │   ├── types.ts                   # Restaurant 型定義
    │   └── storage.ts                 # localStorage ラッパー
    └── data/
        └── restaurants.ts             # 初期データ
```

## 技術スタック

- **Next.js 14**（App Router）
- **TypeScript**
- **Tailwind CSS**
- **localStorage**（データ保存）

---

## 次のPhaseへ

Phase 3 の振り返りが終わったら、**ファシリテーターの指示で** `repos/3-ai-driven/` に移動します。

```bash
cd ../3-ai-driven
npm install
claude
```

---

## 評価軸

| 観点 | 見るポイント | 計測方法 |
|---|---|---|
| **Speed**（爆速度） | 最初に動いたまでの時間（分） | ストップウォッチで計測 |
| **Correctness**（要件達成度） | 受け入れ条件を満たした数 | 画面を見て動作チェック |
| **Change-resilience**（変更への強さ） | 仕様変更に何分で追従できたか | 変更投入後の対応時間を計測 |
