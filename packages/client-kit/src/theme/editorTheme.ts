import type { CSSProperties } from "react";

export type MdKitEditorTheme = {
  background: string;
  blockGap: string;
  border: string;
  codeBackground: string;
  codeRadius: string;
  fontFamily: string;
  fontSize: string;
  foreground: string;
  lineHeight: string;
  link: string;
  muted: string;
  mutedForeground: string;
  surfacePadding: string;
};

export type MdKitEditorThemeStyle = CSSProperties &
  Record<`--hsk-${string}`, string>;

export const defaultMdKitEditorTheme: MdKitEditorTheme = {
  background: "#ffffff",
  blockGap: "0.75rem",
  border: "#d8dee8",
  codeBackground: "#eef1f4",
  codeRadius: "0.35rem",
  fontFamily: "inherit",
  fontSize: "16px",
  foreground: "#18212f",
  lineHeight: "1.7",
  link: "#4f46e5",
  muted: "#eef1f4",
  mutedForeground: "#5b6472",
  surfacePadding: "1rem",
};

export const darkMdKitEditorTheme: MdKitEditorTheme = {
  background: "#0b1220",
  blockGap: "0.75rem",
  border: "#314158",
  codeBackground: "#111827",
  codeRadius: "0.35rem",
  fontFamily: "inherit",
  fontSize: "16px",
  foreground: "#e5edf7",
  lineHeight: "1.7",
  link: "#38bdf8",
  muted: "#172033",
  mutedForeground: "#94a3b8",
  surfacePadding: "1rem",
};

export const createMdKitEditorThemeStyle = (
  theme: MdKitEditorTheme,
): MdKitEditorThemeStyle => ({
  "--hsk-background": theme.background,
  "--hsk-block-gap": theme.blockGap,
  "--hsk-border": theme.border,
  "--hsk-code-background": theme.codeBackground,
  "--hsk-code-radius": theme.codeRadius,
  "--hsk-code-block-radius": theme.codeRadius,
  "--hsk-font-family": theme.fontFamily,
  "--hsk-font-size": theme.fontSize,
  "--hsk-foreground": theme.foreground,
  "--hsk-line-height": theme.lineHeight,
  "--hsk-link": theme.link,
  "--hsk-muted": theme.muted,
  "--hsk-muted-foreground": theme.mutedForeground,
  "--hsk-quote-border-color": theme.border,
  "--hsk-surface-padding": theme.surfacePadding,
});

