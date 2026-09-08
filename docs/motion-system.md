# モーション契約

段階1では未実装。`html` は `data-motion="off"` のまま出す。演出は全部落ちても情報と導線は残る。

## 合成ルール（活版 × 暗転）

- 見えるもの: 紙、墨、罫、重ねた版、柱。言葉は印刷側
- 時間: Home は暗い開幕 → 灯が入って紙が見える → 終幕で暗い刊記
- やらない: 幕間ごとの暗転、opacity の瞬間カット、緞帳、スポット円、常時カスタムカーソル、横スクロール、Lenis、WebGL、本文中パララックス

アンバーは特色（箔）であり灯。下線と現在地だけ。

## プリミティブ（段階2以降）

| 部品 | 段階 | 役割 | off のとき |
|---|---|---|---|
| SectionTheme | 2 | `--bg/--fg` をスクロールで補間。同時1本 | ページ既定色を静的適用 |
| StickyExpand | 2 | 外側 vh、内側 sticky 100vh | 通常フロー |
| IdentityPin | 3 | 名前がヘッダーロゴへ（Home のみ、GSAP） | 名前は見出しとして静置 |
| StackedCards | 3 | 版の重なり。ハブと Works 先頭5件（GSAP） | 縦カード列。0件は非表示、1件は重ならない |
| MaskReveal | 4 | h1/h2 のクリップ開き。本文は対象外 | 即時表示 |
| ScrollTicks | 4 | 右目盛り。スマホ非表示 | 出してよいが拡大アニメなし |
| SharedTile | 5 | `view-transition-name: tile-{id}` | 即時遷移 |

共通: `data-motion="on" \| "off"`。`prefers-reduced-motion: reduce` は off。アニメ対象は transform / opacity / CSS 変数のみ。

## Home ビート（段階3で接続）

PC 目安。ハイジャックしない。

1. 表紙 100vh + 70vh スクラブ — cover、名前中央
2. リード 80vh — 柱へ受け渡し、灯入れ（cover→dusk）
3. About / Works / Blog / Cert ハブ — 版を重ねる。カード間で暗転しない
4. Contact 100vh — cover、刊記

スマホはピンを短くする（表紙 80vh、スクラブ 40vh、ハブ 110vh）。

## 下層の強度

- `/works` 高（先頭5件の重なり、6件目以降はグリッド）
- `/about` 中（PC のみ左列 sticky）
- 詳細ヒーローのみ低。本文・日付・資格名・フォームは動かさない
- `/blog` `/certifications` `/contact` 低

## 確認（各段階）

- ナビとハブから下層へ行ける
- 本文が読める
- 0件で空ピンを残さない。1件で重なりに依存しない
- キーボードでリンクに辿れる

## 段階6（耐久）

段階1の情報設計が演出の上でも残ること。直すのは壊れ、足すのは演出ではない。

- `prefers-reduced-motion: reduce` → `data-motion="off"`。Home は紙色。ヘッダーロゴは常時見える
- JS が走るまでロゴを隠さない（`data-identity-active` が付いてから IdentityPin が隠す）
- JS オフは `<noscript>` でピン高とクリップを通常フローへ戻す。Home 目盛りは `#cover` などのリンク
- 幅 768px 未満は目盛り非表示。カード板は `height: auto`
- Works 0 / 1 / 6: 空は「準備中」、1件はグリッド、6件は先頭5件ピン + 残りグリッド
