export const profile = {
  bio: "プレースホルダの略歴です。後から src/data/profile.ts だけ差し替える。",
  career: [
    {
      period: "2022 — 現在",
      title: "職種（仮）",
      org: "所属（仮）",
      summary: "担当したことの一行。",
    },
    {
      period: "2020 — 2022",
      title: "職種（仮）",
      org: "所属（仮）",
      summary: "担当したことの一行。",
    },
  ],
  skills: [
    {
      category: "制作",
      items: ["HTML", "CSS", "Astro"],
    },
    {
      category: "記録",
      items: ["Markdown", "Git"],
    },
  ],
} as const;
