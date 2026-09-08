# Pilot_one

ポートフォリオサイト。仕様は `docs/site-architecture.md` と `docs/motion-system.md`。

公開: https://shrimp-mini.github.io/Pilot_one/

```bash
cd C:\AI_learning\Pilot_one
npm install
npm run dev
```

開発サーバーは **http://localhost:4321/Pilot_one/** 。`dist/index.html` をファイルとして開かない。

本名・肩書きは `src/data/site.ts` だけ差し替える。制作物は `src/content/works/`、連載は `src/content/blog/`。

## 確認（段階6）

- ナビとハブから `/about` `/works` `/blog` `/certifications` `/contact` へ行ける
- `prefers-reduced-motion` ではピンとクリップが落ち、情報がそのまま読める
- 幅 768px 未満では右目盛りが消え、ハブのピンが短くなる
- 制作物 0件は「準備中」、1件は重ならない、6件は先頭5件が重なり残りはグリッド
- JS オフでもロゴ・本文・ハッシュ目盛り・全リンクが残る
