import { common, createLowlight } from "lowlight";

export const mdKitCodeThemeNames = [
  "github",
  "github-dark",
  "github-dark-dimmed",
  "atom-one-light",
  "atom-one-dark",
  "vs",
  "vs2015",
  "xcode",
  "monokai",
  "nord",
  "night-owl",
  "tokyo-night-dark",
  "stackoverflow-light",
  "stackoverflow-dark",
  "darcula",
  "dracula",
] as const;

export type MdKitCodeThemeName = (typeof mdKitCodeThemeNames)[number];

export type MdKitCodeTheme =
  | "auto"
  | MdKitCodeThemeName
  | {
      dark: MdKitCodeThemeName;
      light: MdKitCodeThemeName;
    };

export type MdKitSyntaxHighlightingOptions = {
  /**
   * Override the default lowlight instance. MDKit's default uses lowlight's
   * common language set.
   */
  lowlight?: unknown;
  defaultLanguage?: string | null;
  enableTabIndentation?: boolean;
  tabSize?: number;
};

export const defaultMdKitLowlight = createLowlight(common);

export const normalizeMdKitCodeThemeName = (
  theme: MdKitCodeThemeName,
): MdKitCodeThemeName => theme;

export const getMdKitCodeThemeAttributes = (
  theme: MdKitCodeTheme | undefined,
): Record<string, string | undefined> => {
  if (!theme || theme === "auto") {
    return {
      "data-code-theme": "auto",
      "data-code-theme-dark": "github-dark",
      "data-code-theme-light": "github",
    };
  }

  if (typeof theme === "string") {
    return {
      "data-code-theme": normalizeMdKitCodeThemeName(theme),
      "data-code-theme-dark": undefined,
      "data-code-theme-light": undefined,
    };
  }

  return {
    "data-code-theme": "auto",
    "data-code-theme-dark": normalizeMdKitCodeThemeName(theme.dark),
    "data-code-theme-light": normalizeMdKitCodeThemeName(theme.light),
  };
};
