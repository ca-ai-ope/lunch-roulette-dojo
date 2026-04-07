# 研修リポジトリ ガイド

## 概要

このフォルダには、研修の各Phaseに対応する3つのリポジトリがあります。
**Phase が切り替わるたびに、対応するリポジトリに移動してください。**

各Phaseでは **同じ「投票機能を追加する」という課題** に、**異なる手法** で挑みます。
同じ課題だからこそ、手法の違いが際立ちます。

## フロー

```
┌─────────────────────────────────────────────────────────────────┐
│ Phase 1 & 2: Vibe Coding（0:08〜0:43）                          │
│ リポジトリ: repos/1-vibe-coding/                                 │
│ → ランチルーレットを「いい感じで」作り、投票機能を追加して壊す     │
├─────────────────────────────────────────────────────────────────┤
│ ⬇ ファシリテーターの指示でリポジトリを切り替え                    │
├─────────────────────────────────────────────────────────────────┤
│ Phase 3: 仕様駆動開発（0:53〜1:18）                              │
│ リポジトリ: repos/2-sdd/                                         │
│ → ルーレットアプリ（実装済み）に SPEC.md + CLAUDE.md を書いて     │
│   投票機能を仕様駆動で追加する                                    │
├─────────────────────────────────────────────────────────────────┤
│ ⬇ ファシリテーターの指示でリポジトリを切り替え                    │
├─────────────────────────────────────────────────────────────────┤
│ Phase 4: AI駆動開発（1:23〜1:48）                                │
│ リポジトリ: repos/3-ai-driven/                                   │
│ → ルーレットアプリ（実装済み）に CLAUDE.md を育成し、             │
│   project-rules + CONTEXT.json を使って投票機能をAI駆動で追加     │
└─────────────────────────────────────────────────────────────────┘
```

## リポジトリの切り替え方

```bash
# Phase 1 & 2 開始時
cd repos/1-vibe-coding
claude

# Phase 3 開始時（ファシリテーターの指示で切り替え）
cd ../2-sdd
npm install
claude

# Phase 4 開始時（ファシリテーターの指示で切り替え）
cd ../3-ai-driven
npm install
claude
```

---

## 各リポジトリの詳細

### 1. `1-vibe-coding/` — Phase 1 & 2: Vibe Coding

**コンセプト**: ほぼ空の状態から、雑なプロンプトだけでAIにすべて作らせる。

| 項目 | 内容 |
|---|---|
| 初期状態 | ソースコードなし（空） |
| ガイドライン | 最小限の CLAUDE.md のみ |
| スキル | なし |
| Hooks | なし（AIは自由に動く） |

**ディレクトリ構成**:
```
1-vibe-coding/
├── CLAUDE.md                    # アプリ名のみの最小プレースホルダー
├── README.md                    # セットアップ手順
├── prompts/
│   ├── phase1-ルーレットアプリ.md  # Phase 1 用プロンプト例（わざと雑め）
│   └── phase2-投票機能追加.md      # Phase 2 用プロンプト例（仕様なし）
└── .claude/
    └── settings.json            # 基本的な権限設定
```

**Phase 1（感動）**: 雑なプロンプトでランチルーレットアプリを爆速で作る。
**Phase 2（挫折）**: 同じセッションのまま投票機能を追加 → コードが壊れる体験。

---

### 2. `2-sdd/` — Phase 3: 仕様駆動開発

**コンセプト**: SPEC.md を SSoT（Single Source of Truth）として、AIの出力を収束させる。

| 項目 | 内容 |
|---|---|
| 初期状態 | ルーレットアプリ実装済み |
| ガイドライン | SPEC.md テンプレート + CLAUDE.md プレースホルダー |
| スキル | `/spec-check`, `/implement` |
| Hooks | SPEC.md 未記入の警告、CLAUDE.md プレースホルダー検知 |

**ディレクトリ構成**:
```
2-sdd/
├── CLAUDE.md                    # プレースホルダー（参加者が育てる）
├── SPEC.md                      # 仕様テンプレート（Why/What/How/Edge Cases）
├── README.md
├── templates/
│   └── CLAUDE-template.md       # CLAUDE.md の記入例
├── prompts/
│   ├── 01-specify.md            # Step 1: SPEC.md 記入
│   ├── 02-plan.md               # Step 2: 実装計画
│   ├── 03-tasks.md              # Step 3: タスク分解
│   ├── 04-implement.md          # Step 4: 実装
│   └── 05-仕様変更対応.md        # Step 5: 仕様変更への対応
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── RestaurantCard.tsx   # レストランカード（投票ボタンのプレースホルダー付き）
│   │   ├── RestaurantList.tsx   # レストラン一覧
│   │   └── Roulette.tsx         # ルーレット機能
│   ├── lib/
│   │   ├── types.ts             # Restaurant インターフェース
│   │   └── storage.ts           # localStorage ラッパー
│   └── data/
│       └── restaurants.ts       # デフォルトレストラン5件
├── .claude/
│   ├── settings.json
│   └── skills/
│       ├── spec-check.md        # 仕様の妥当性チェック
│       └── implement.md         # 仕様に基づく実装開始
├── package.json                 # Next.js 14 + React 18 + Tailwind CSS
└── tailwind.config.ts
```

**進め方**: Specify → Plan → Tasks → Implement の4ステップ。
途中で仕様変更を投入し、SPEC.md を更新してからAIに修正させる体験がポイント。

**技術スタック**: Next.js 14, React 18, TypeScript, Tailwind CSS, localStorage

---

### 3. `3-ai-driven/` — Phase 4: AI駆動開発

**コンセプト**: 人間が目的地（Why/What）を握り、AIがルート（How）を提案・実行する。
CLAUDE.md を「長期記憶」、CONTEXT.json を「状態管理」として活用。

| 項目 | 内容 |
|---|---|
| 初期状態 | ルーレットアプリ実装済み + story-001 完了済み |
| ガイドライン | CLAUDE.md（完全版）+ PROJECT_RULES.md + REQUIREMENT.md |
| スキル | `/story`, `/start`, `/progress`, `/finish` |
| Hooks | 6つ以上のガード（読み取り専用ファイル保護、破壊的操作のブロック等） |

**ディレクトリ構成**:
```
3-ai-driven/
├── CLAUDE.md                    # AIの長期記憶（ロール・ルール・参照順序・境界）
├── PROJECT_RULES.md             # コードの交通ルール（技術スタック・命名規則・禁止事項）
├── README.md
├── templates/
│   └── CLAUDE-full.md           # CLAUDE.md の完全版テンプレート
├── prompts/
│   └── phase4-ai-driven.md      # Phase 4 の総合ガイド
├── stories/
│   ├── story-001/
│   │   └── CONTEXT.json         # ✅ 完了済み: ルーレット基本機能
│   └── story-002/
│       ├── REQUIREMENT.md       # 投票機能の詳細仕様
│       └── CONTEXT.json         # 📋 pending: 投票機能（参加者が実装）
├── scripts/
│   └── check-code.mjs           # コード品質チェッカー（console.log, any型, 行数）
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── RestaurantCard.tsx
│   │   ├── RestaurantList.tsx
│   │   └── Roulette.tsx
│   ├── lib/
│   │   ├── types.ts
│   │   └── storage.ts
│   └── data/
│       └── restaurants.ts
├── .claude/
│   ├── settings.json            # 包括的なHooks & ガード設定
│   └── skills/
│       ├── story.md             # 要件を構造化 → REQUIREMENT.md + CONTEXT.json 生成
│       ├── start.md             # ドキュメント読込 → 計画 → 承認 → 実装
│       ├── progress.md          # 進捗確認（ストーリー状態 + 受け入れ条件）
│       └── finish.md            # 型チェック → 検証 → CONTEXT.json 更新
├── .husky/                      # Git hooks
├── package.json                 # Next.js 14 + React 18 + Tailwind CSS
└── tailwind.config.ts
```

**進め方**:
1. 目的地確認 → 2. CLAUDE.md 育成 → 3. `/start` で実装 → 4. `/finish` で完了記録

**CLAUDE.md の主な設定**:
- ドキュメントの読み込み順序を強制
- ファイルアクセス境界（読み書き可能 / 読み取り専用を明示）
- 破壊的操作の禁止（`rm -rf`, `git push --force`, `git reset --hard`）

**CONTEXT.json の役割**:
- ストーリーごとの進捗状態を管理（pending → in_progress → completed）
- 作成・変更したファイルを記録
- 受け入れ条件の達成状況を追跡
- 設計判断の理由を記録

---

## なぜリポジトリが分かれているのか？

| Phase | リポジトリ | 初期状態 | 学びのポイント |
|---|---|---|---|
| Phase 1 & 2 | `1-vibe-coding/` | 空 | 速さの感動と、壊れる挫折 |
| Phase 3 | `2-sdd/` | 実装済み + spec テンプレート | 仕様がガードレールになる体感 |
| Phase 4 | `3-ai-driven/` | 実装済み + ルール + 状態管理 | AIをチームメンバーとして走らせる体感 |

Phase 2 で壊れたコードや Phase 3 で実装した投票機能は、次のリポジトリには引き継ぎません。
毎回クリーンな状態から始めることで、**手法の違いだけ**を比較できます。

---

## Phase間の統治レベルの進化

```
Phase 1&2          Phase 3              Phase 4
Vibe Coding        仕様駆動開発          AI駆動開発
─────────────────────────────────────────────────────

ガイドなし    →    SPEC.md (SSoT)   →   CLAUDE.md + PROJECT_RULES.md
                                         + CONTEXT.json + REQUIREMENT.md

Hooksなし     →    2つの警告        →   6つ以上のガード

スキルなし    →    /spec-check      →   /story  /start  /progress  /finish
                   /implement

自由放任      →    仕様で収束       →   ルール + 記憶 + 状態で自律
```

---

## 評価軸（全Phase共通）

| 観点 | 見るポイント | 計測方法 |
|---|---|---|
| **Speed** | 最初に動くまでの時間 | ストップウォッチ |
| **Correctness** | 受け入れ条件を満たした数 | 画面で動作チェック |
| **Change-resilience** | 仕様変更への追従時間 | 対応時間を計測 |

---

## 技術要件

- **Node.js**: v18 以上
- **AIツール**: Claude Code（社内標準）
- **ブラウザ**: Chrome / Edge / Safari（最新版）
