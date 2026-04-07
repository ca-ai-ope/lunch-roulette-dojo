# PROJECT_RULES.md: ランチルーレットアプリ

## 技術スタック
- **フレームワーク**: Next.js 14+（App Router）
- **言語**: TypeScript（strict mode）
- **スタイリング**: Tailwind CSS
- **データ保存**: localStorage のみ（外部DB・API禁止）
- **パッケージマネージャ**: npm

## ディレクトリ構成
```
src/
├── app/
│   ├── layout.tsx        ← 共通レイアウト
│   ├── page.tsx          ← メインページ
│   └── globals.css       ← グローバルスタイル
├── components/
│   ├── RestaurantCard.tsx ← レストランカードコンポーネント
│   ├── RestaurantList.tsx ← レストラン一覧コンポーネント
│   ├── Roulette.tsx       ← ルーレットコンポーネント
│   └── （新規コンポーネントはここに追加）
├── hooks/
│   └── （カスタムフックはここに追加。例: useVote.ts）
├── lib/
│   ├── storage.ts        ← localStorage ラッパー
│   └── types.ts          ← 型定義
└── data/
    └── restaurants.ts    ← レストランの初期データ
```

## コーディング規約
- コンポーネントは関数コンポーネント + hooks で記述
- `"use client"` ディレクティブは必要なコンポーネントにのみ付与
- localStorage の読み書きは `lib/storage.ts` を経由する
- 型定義は `lib/types.ts` に集約する
- コンポーネントファイル名は PascalCase（例: `VoteButton.tsx`）

## データ構造
```typescript
interface Restaurant {
  id: string;
  name: string;
  genre: string;
  votes: number;
}
```

## 禁止事項
- 外部APIへのリクエスト
- データベース（SQLite含む）の使用
- `any` 型の使用（`unknown` + 型ガードを使う）
- `console.log` のプロダクションコードへの残留

## テスト方針
- コンポーネントのレンダリングテストを最低限記述
- 投票ロジック（1人1票、取り消し）のユニットテストを必須とする

## Git 規約
- コミットメッセージ: `feat:`, `fix:`, `refactor:`, `test:`, `docs:` プレフィックスを使用
- 1コミット1機能を原則とする
