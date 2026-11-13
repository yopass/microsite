import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import * as fs from "fs";
import * as path from "path";

const config: Config = {
  title: "Yopass",
  tagline: "Share Secrets Securely",
  favicon: "logo/favicon.ico",
  headTags: [
    {
      tagName: "link",
      attributes: { rel: "icon", type: "image/svg+xml", href: "/logo/favicon.svg" },
    },
    {
      tagName: "link",
      attributes: { rel: "apple-touch-icon", sizes: "180x180", href: "/logo/apple-touch-icon.png" },
    },
  ],

  url: "https://yopass.se",
  baseUrl: "/",
  trailingSlash: false,

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  customFields: {
    checkoutUrl:
      process.env.CHECKOUT_URL ?? "https://license.yopass.se/checkout",
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: path.resolve(__dirname, ".yopass-docs/docs"),
          routeBasePath: "docs",
          sidebarPath: "./sidebars.ts",
          // Renders the generated API reference pages.
          docItemComponent: "@theme/ApiItem",
          // Swap the flat, generated api-reference folder for the plugin's
          // sidebar, which groups endpoints by tag.
          async sidebarItemsGenerator({ defaultSidebarItemsGenerator, ...args }) {
            const items = await defaultSidebarItemsGenerator(args);
            const generated = require("./.yopass-docs/docs/api-reference/sidebar");
            const apisidebar: any[] = generated.default;
            // The plugin writes ids relative to the repo root; docs ids start below docs/.
            const relative = (item: any): any => ({
              ...item,
              ...(item.id && { id: item.id.replace(/^docs\//, "") }),
              ...(item.link?.id && { link: { ...item.link, id: item.link.id.replace(/^docs\//, "") } }),
              ...(item.items && { items: item.items.map(relative) }),
            });
            return items.map((item) =>
              item.type === "category" && item.label === "api-reference"
                ? { type: "category", label: "API reference", collapsed: true, items: apisidebar.map(relative) }
                : item,
            );
          },
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],

  plugins: [
    "docusaurus-plugin-sass",
    [
      // Per-endpoint pages from the spec in the fetched yopass docs. The output
      // is generated at build time (`npm run docs:generate`) and not committed.
      "docusaurus-plugin-openapi-docs",
      {
        id: "api",
        docsPluginId: "classic",
        config: {
          yopass: {
            specPath: ".yopass-docs/docs/openapi.yaml",
            outputDir: ".yopass-docs/docs/api-reference",
            sidebarOptions: { groupPathsBy: "tag", categoryLinkSource: "tag" },
            hideSendButton: true,
          },
        },
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/docs",
            to: "/docs/intro",
          },
        ],
      },
    ],
    async function tailwindPlugin() {
      return {
        name: "docusaurus-tailwindcss",
        // the landing page body is plain HTML (src/pages/_home/body.html), imported as a string
        configureWebpack() {
          return { module: { rules: [{ test: /_home\/.*\.html$/, type: "asset/source" }] } };
        },
        configurePostCss(postcssOptions: { plugins: unknown[] }) {
          postcssOptions.plugins.push(require("@tailwindcss/postcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],

  themeConfig: {
    image: "logo/apple-touch-icon.png",
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },

    navbar: {
      hideOnScroll: false,
      logo: {
        alt: "Yopass",
        src: "logo/yopass-full.svg",
        width: 138,
        height: 28,
        href: "/",
      },
      items: [
        {
          to: "/docs/intro",
          label: "Docs",
          position: "left",
          activeBasePath: "docs",
        },
        {
          href: "https://github.com/jhaals/yopass",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://share.yopass.se",
          label: "Demo",
          position: "right",
        },
        {
          type: "html",
          position: "right",
          value: '<a href="/#pricing" class="navbar-cta">Get a license</a>',
        },
      ],
    },

    footer: {
      style: "light",
      copyright: `© ${new Date().getFullYear()} Yopass AB`,
      links: [
        {
          items: [
            { label: "GitHub", href: "https://github.com/jhaals/yopass" },
            { label: "Documentation", to: "/docs/intro" },
            { label: "Demo", href: "https://share.yopass.se" },
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms of Service", to: "/tos" },
          ],
        },
      ],
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },

    metadata: [
      { name: "twitter:card", content: "summary" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Yopass" },
      { name: "theme-color", content: "#ffffff" },
      { name: "color-scheme", content: "light" },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
