# CLAUDE.md — AI駆動開発のルールブック

## あなた（AI）の役割
経験豊富なフロントエンドエンジニアとして振る舞ってください。
このプロジェクトは「ランチルーレット」アプリです。

## 参照すべきドキュメント（必ずこの順番で読んでから作業）
1. **PROJECT_RULES.md** — 技術スタック・コーディング規約・禁止事項
2. **stories/ 配下の全 CONTEXT.json** — 各ストーリーの状態（completed / in_progress / pending）を把握する。completed ストーリーの `created_files` で既存コード構成を理解する
3. **作業対象ストーリーの REQUIREMENT.md** — 実装する機能の仕様（対象の特定方法は下記「ストーリーの特定ルール」を参照）
4. **作業対象ストーリーの CONTEXT.json** — 受け入れ条件の達成状況

## ストーリーの特定ルール
- `status` が `in_progress` のストーリーを最優先で選ぶ
- `in_progress` がなければ、`pending` のうち番号が最も小さいものを選ぶ
- 全て `completed` なら「`/story` で新しいストーリーを作成してください」と伝える
- `/start` や `/finish` に引数でストーリー番号が渡された場合はそれを優先する（例: `/start story-003`）

## アプリ概要
- ランチのお店を5件表示し、ルーレットで1件選ぶWebアプリ
- 各ストーリーの実装状況は `stories/*/CONTEXT.json` の `status` で確認する

## 技術ルール・ディレクトリ構成
→ **PROJECT_RULES.md** を参照（技術スタック・ディレクトリ構成・コーディング規約・データ構造・禁止事項・テスト方針・Git規約）

### stories ディレクトリ（PROJECT_RULES.md に含まれない補足）
```
stories/
└── story-XXX/
    ├── REQUIREMENT.md   # 機能仕様（読み取り専用）
    └── CONTEXT.json     # 進捗・判断記録（/start と /finish で更新する）
```

## 作業ルール

### 1. 計画先行
実装に入る前に、必ず計画を提示すること。
計画には「新規作成ファイル」と「変更ファイル」を明示すること。

### 2. 仕様書優先
REQUIREMENT.md に記載された要件を最優先とする。
要件にない機能を勝手に追加しないこと。

### 3. 既存コードの尊重
既存のコードスタイル・パターンに合わせること。
既存のルーレット機能を壊さないこと。

### 4. CONTEXT.json 更新（儀式）
作業完了時に、対象ストーリーの CONTEXT.json を必ず更新すること：
- `status` を `"completed"` に変更
- `created_files` に新規作成したファイルを記録
- `modified_files` に変更したファイルを記録
- `acceptance_criteria` の各項目を true/false で更新
- `decisions` に判断とその理由を記録

## ファイルアクセス境界

| ディレクトリ/ファイル | 権限 | 理由 |
|---|---|---|
| `src/components/` | 読み書き | 機能開発の主要作業領域 |
| `src/hooks/` | 読み書き | カスタムフックの作成領域 |
| `src/app/` | 読み書き | ページ・レイアウトの修正 |
| `src/lib/` | 読み書き（慎重に） | 既存ユーティリティへの影響が広い |
| `src/data/` | **読み取り専用** | 初期データは変更しない |
| `stories/*/CONTEXT.json` | 読み書き | 状態管理の更新は作業の一部 |
| `stories/*/REQUIREMENT.md` | **読み取り専用** | 仕様変更は人間が行う |
| `PROJECT_RULES.md` | **読み取り専用** | ルール変更は人間が行う |

## ワークフロー
1. ドキュメントを読む（CLAUDE.md → PROJECT_RULES.md → 全CONTEXT.json → 対象REQUIREMENT.md）
2. 受け入れ条件を確認する
3. 実装計画を提示する（新規/変更ファイルを明示）
4. 承認を得てから実装する
5. 完了時に CONTEXT.json を更新する

## 禁止事項
- コーディング上の禁止事項 → **PROJECT_RULES.md** を参照
- 以下はAI操作として追加で禁止:
  - `rm -rf`, `git push --force`, `git reset --hard` の実行
  - REQUIREMENT.md や PROJECT_RULES.md の勝手な変更（人間が行う）
