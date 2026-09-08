export const site = {
  name: "氏名",
  role: "制作と記録",
  lead: "版を重ねて、残したものをここに置く。",
  email: "hello@example.com",
  nav: [
    { href: "/about", label: "略歴", theme: "dusk", tickId: "about" },
    { href: "/works", label: "制作", theme: "paper", tickId: "works" },
    { href: "/blog", label: "連載", theme: "mist", tickId: "blog" },
    {
      href: "/certifications",
      label: "奥付",
      theme: "mist",
      tickId: "certifications",
    },
    { href: "/contact", label: "刊記", theme: "cover", tickId: "contact" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];

export function withBase(path: string): string {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("#")
  ) {
    return path;
  }
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}
