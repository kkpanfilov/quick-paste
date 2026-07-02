import type { Language } from "@/shared/lists/language.map.ts";

export type AvailableLanguages = Exclude<Language, "plain">;

type LanguageLoaders = {
  [key in AvailableLanguages]: () => Promise<{ default: unknown }>;
};

export const languageLoaders: LanguageLoaders = {
  markdown: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/markdown"),
  javascript: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/javascript"),
  typescript: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/typescript"),
  jsx: () => import("react-syntax-highlighter/dist/esm/languages/prism/jsx"),
  tsx: () => import("react-syntax-highlighter/dist/esm/languages/prism/tsx"),
  markup: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/markup"),
  css: () => import("react-syntax-highlighter/dist/esm/languages/prism/css"),
  scss: () => import("react-syntax-highlighter/dist/esm/languages/prism/scss"),
  sass: () => import("react-syntax-highlighter/dist/esm/languages/prism/sass"),
  less: () => import("react-syntax-highlighter/dist/esm/languages/prism/less"),
  json: () => import("react-syntax-highlighter/dist/esm/languages/prism/json"),
  yaml: () => import("react-syntax-highlighter/dist/esm/languages/prism/yaml"),
  toml: () => import("react-syntax-highlighter/dist/esm/languages/prism/toml"),
  ini: () => import("react-syntax-highlighter/dist/esm/languages/prism/ini"),
  bash: () => import("react-syntax-highlighter/dist/esm/languages/prism/bash"),
  "shell-session": () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/shell-session"),
  powershell: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/powershell"),
  batch: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/batch"),
  python: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/python"),
  java: () => import("react-syntax-highlighter/dist/esm/languages/prism/java"),
  c: () => import("react-syntax-highlighter/dist/esm/languages/prism/c"),
  cpp: () => import("react-syntax-highlighter/dist/esm/languages/prism/cpp"),
  csharp: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/csharp"),
  go: () => import("react-syntax-highlighter/dist/esm/languages/prism/go"),
  rust: () => import("react-syntax-highlighter/dist/esm/languages/prism/rust"),
  php: () => import("react-syntax-highlighter/dist/esm/languages/prism/php"),
  ruby: () => import("react-syntax-highlighter/dist/esm/languages/prism/ruby"),
  kotlin: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/kotlin"),
  swift: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/swift"),
  dart: () => import("react-syntax-highlighter/dist/esm/languages/prism/dart"),
  sql: () => import("react-syntax-highlighter/dist/esm/languages/prism/sql"),
  graphql: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/graphql"),
  docker: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/docker"),
  nginx: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/nginx"),
  git: () => import("react-syntax-highlighter/dist/esm/languages/prism/git"),
  diff: () => import("react-syntax-highlighter/dist/esm/languages/prism/diff"),
  regex: () =>
    import("react-syntax-highlighter/dist/esm/languages/prism/regex"),
  lua: () => import("react-syntax-highlighter/dist/esm/languages/prism/lua"),
  r: () => import("react-syntax-highlighter/dist/esm/languages/prism/r"),
} satisfies LanguageLoaders;
