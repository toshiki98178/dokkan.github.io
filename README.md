# ドッカンキャラ管理 (React版)

ドラゴンボールZ ドッカンバトルのキャラクター管理アプリケーションのReact移行版です。

## 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite 6
- **UIライブラリ**: shadcn/ui + Tailwind CSS v4
- **状態管理**: React Hooks (useState, useEffect, useCallback, useMemo)
- **データ永続化**: LocalStorage
- **アイコン**: Lucide React

## 主要機能

### キャラクター管理
- ✅ キャラクター登録（名前、画像、凸数、属性、タグ）
- ✅ 画像アップロード（Base64変換、自動リサイズ）
- ✅ キャラクター編集・削除
- ✅ リアルタイム編集モード

### フィルタリング・ソート
- ✅ 凸数フィルタ（0-4凸）
- ✅ 属性フィルタ（超速、極速、超技、極技、超知、極知、超力、極力、超体、極体）
- ✅ タグフィルタ（動的生成）
- ✅ ソート機能（凸数、名前、属性順）
- ✅ フィルタ統計表示

### デザイン・UX
- ✅ iPhone風デザイン
- ✅ ガラスモーフィズム効果
- ✅ レスポンシブ対応（スマホ・タブレット・デスクトップ）
- ✅ アニメーション・トランジション
- ✅ タッチフレンドリーUI

### エラーハンドリング
- ✅ エラーバウンダリー
- ✅ 画像バリデーション
- ✅ フォームバリデーション
- ✅ ローディング状態管理

## プロジェクト構成

```
src/
├── components/          # Reactコンポーネント
│   ├── ui/             # shadcn/ui基本コンポーネント
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── label.tsx
│   │   └── card.tsx
│   ├── Header.tsx      # ヘッダーコンポーネント
│   ├── CharacterForm.tsx   # キャラクター登録フォーム
│   ├── Filters.tsx     # フィルタコンポーネント
│   ├── CharacterCard.tsx   # キャラクターカード
│   ├── CharacterList.tsx   # キャラクター一覧
│   └── ErrorBoundary.tsx   # エラーバウンダリー
├── hooks/              # カスタムフック
│   ├── useCharacters.ts    # キャラクター管理
│   ├── useFilters.ts   # フィルタ管理
│   └── useImageUpload.ts   # 画像アップロード
├── types/              # TypeScript型定義
│   └── character.ts    # キャラクター関連の型
├── constants/          # 定数
│   └── attributes.ts   # 属性・凸数・ソート定数
├── lib/               # ユーティリティ
│   ├── utils.ts       # shadcn/ui用ユーティリティ
│   ├── storage.ts     # LocalStorage操作
│   └── image.ts       # 画像処理ユーティリティ
├── App.tsx            # メインアプリケーション
└── main.tsx           # エントリーポイント
```

## セットアップ・起動方法

### 前提条件
- Node.js 18+ 
- npm または yarn

### インストール・起動

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## カスタマイズ

### 属性の追加・変更
`src/constants/attributes.ts` の `ATTRIBUTES` 配列を編集してください。

### 凸数の変更
`src/constants/attributes.ts` の `DUPE_OPTIONS` 配列を編集してください。

### スタイルのカスタマイズ
- グローバルスタイル: `src/index.css`
- Tailwind設定: `tailwind.config.js`
- コンポーネント固有スタイル: 各コンポーネントファイル

## データ仕様

### キャラクターデータ構造
```typescript
interface Character {
  id: number;                // 一意ID
  name: string;             // キャラクター名
  image: string;            // Base64画像データ
  dupe: number;             // 凸数（0-4）
  attribute: string;        // 属性
  tags: string[];           // タグ配列（最大5個）
  editing?: boolean;        // 編集モード
  originalData?: object;    // 編集バックアップ
}
```

### LocalStorageキー
- `dokkan_characters`: キャラクターデータ配列

## ブラウザ対応

- **推奨**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **モバイル**: iOS Safari 14+, Chrome Mobile 90+
- **機能**: ES2020, WebP画像、FileReader API、LocalStorage

## パフォーマンス最適化

- React.memo によるコンポーネント最適化
- useCallback、useMemo による再レンダリング抑制
- 画像の自動リサイズ（最大800x600px）
- LocalStorage容量監視

## 既知の制限

- LocalStorage容量制限（約5MB）
- 大量画像でのメモリ使用量増加
- IE11は非対応

## トラブルシューティング

### 画像が表示されない
- 画像ファイル形式を確認（JPEG、PNG、GIF、WebP対応）
- ファイルサイズが5MB以下であることを確認

### データが消える
- ブラウザのLocalStorageが無効になっていないか確認
- プライベートモードでは永続化されません

### パフォーマンス問題
- ブラウザの開発者ツールでメモリ使用量を確認
- 不要な画像を削除してLocalStorageを軽量化

## ライセンス

このプロジェクトは個人利用・学習目的での使用を想定しています。