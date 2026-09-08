# サイト構造

実装契約。URL とフォルダの置き場所は以後このファイルに従う。

## 確定事項

- 対象: このリポジトリ（Pilot_one）
- Home を入口にしたフラット下層。本文を Home に詰め込まない
- コンテンツはデータ、ページはビュー。ナビ定義は `src/data/site.ts` のみ
- 世界観の材質は活版印刷所。時間の切り方は開幕・終幕の灯のみ（幕間暗転は禁止）
- 画面の言葉: 目録・略歴・連載・奥付・刊記。開幕・暗転は仕様書専用

## URL（変えない）

| URL | 役割 |
|---|---|
| `/` | Home。要約とハブ |
| `/about` | 略歴・スキル・職歴サマリ |
| `/works` | 制作物一覧 |
| `/works/{slug}` | 制作物詳細 |
| `/blog` | 連載一覧 |
| `/blog/{slug}` | 記事 |
| `/certifications` | 奥付（資格。詳細ページなし） |
| `/contact` | 刊記 |

新しいカテゴリを足すときは、ディレクトリ 1 つ + `site.ts` の nav 1 項目。詳細が要るものは最初から `{slug}` の URL 空間を予約する。

## コンテンツの型

- コレクション（件数増）: works、blog。一覧 + 詳細
- 小さいコレクション: certifications。一覧のみ。JSON
- 固定ページ: about（`src/data/profile.ts`）、contact

frontmatter にモーション用フィールドを置かない。テーマはページ側が決める。

### works（`src/content/works/*.md`）

`title`, `summary`, `date`, `tags[]`, `cover?`, `url?`  
ファイル名が slug。

### blog（`src/content/blog/*.md`）

`title`, `summary`, `date`, `tags[]`, `draft?`  
ファイル名が slug。

### certifications（`src/content/certifications.json`）

配列。各要素: `id`, `name`, `issuer`, `date`, `url?`, `category?`

## フォルダ

```
src/pages/          ファイル配置 = URL
src/layouts/        BaseLayout のみ共通枠
src/components/ui/  カード・見出し（動きを持たない）
src/components/motion/  段階2以降。段階1では未接続または通し
src/content/        増えるもの
src/data/           サイト名・ナビ・テーマ・略歴
src/styles/         tokens → base → layout → components → motion
```

ページを足す手順: `src/pages/` にファイル、必要ならコレクション、`site.ts` の nav、Home のハブカード。

## 段階

1. 静的骨格（モーションなし）— 基準線
2. 以降は `docs/motion-system.md`
