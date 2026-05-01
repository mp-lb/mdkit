import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Markdown Editor Kit",
  description: "Docs for the mdkit markdown editor package",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Quick Start", link: "/" },
      { text: "Styling", link: "/styling" },
      { text: "Shadcn", link: "/shadcn" },
      { text: "API", link: "/api" },
      { text: "Architecture", link: "/architecture" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Quick Start", link: "/" },
          { text: "Styling", link: "/styling" },
          { text: "Shadcn Plugin", link: "/shadcn" },
          { text: "API Reference", link: "/api" },
          { text: "Architecture", link: "/architecture" },
        ],
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/mp-lb/mdkit",
      },
    ],
  },
});
