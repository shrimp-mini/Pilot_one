export const themeColors = {
  cover: {
    bg: "#0A0D12",
    fg: "#F4EFE6",
    muted: "#B3AFA6",
    surface: "#161C26",
  },
  dusk: {
    bg: "#161C26",
    fg: "#F4EFE6",
    muted: "#A8A49C",
    surface: "#1C2430",
  },
  paper: {
    bg: "#F4EFE6",
    fg: "#0A0D12",
    muted: "#5C5852",
    surface: "#E7E0D4",
  },
  mist: {
    bg: "#E4E2DC",
    fg: "#0A0D12",
    muted: "#5A5752",
    surface: "#EFEDE7",
  },
  about: {
    bg: "#141A22",
    fg: "#F4EFE6",
    muted: "#A8A49C",
    surface: "#1C2430",
  },
} as const;

export type ThemeId = keyof typeof themeColors;
