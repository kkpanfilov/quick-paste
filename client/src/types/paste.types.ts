import type { ISODateString } from "./common.types.ts";

type Exposure = "public" | "unlisted" | "private" | "protected" | "shared";

type Category =
  | "none"
  | "programming"
  | "gaming"
  | "art"
  | "music"
  | "science"
  | "math"
  | "history";

type Expiration =
  | "never"
  | "burn"
  | "10m"
  | "1h"
  | "1d"
  | "3d"
  | "7d"
  | "14d"
  | "30d"
  | "180d"
  | "1y";

type Language =
  | "plain"
  | "markdown"
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "markup"
  | "css"
  | "scss"
  | "sass"
  | "less"
  | "json"
  | "yaml"
  | "toml"
  | "ini"
  | "bash"
  | "shell-session"
  | "powershell"
  | "batch"
  | "python"
  | "java"
  | "c"
  | "cpp"
  | "csharp"
  | "go"
  | "rust"
  | "php"
  | "ruby"
  | "kotlin"
  | "swift"
  | "dart"
  | "sql"
  | "graphql"
  | "docker"
  | "nginx"
  | "git"
  | "diff"
  | "regex"
  | "lua"
  | "r";

export type Author = {
  id: string;
  username: string;
};

export type ReplyItem = Omit<CommentItem, "replies">;

export type CommentItem = {
  id: string;
  content: string;
  author: Author;
  replies: ReplyItem[];
  createdAt: ISODateString;
};

export type Paste = {
  id: string;

  title: string;
  description: string | null;
  content: string;

  category: Category;
  exposure: Exposure;
  language: Language;

  likesCount: number;
  isBurn: boolean;
  isLiked: boolean;

  comments: CommentItem[];
  pasteTags: string[];

  author: string;
  authorId: string;

  createdAt: ISODateString;
  expiresAt: ISODateString | null;
};

export type CreatePasteDto = {
  title: string;
  description: string | null;
  content: string;

  category: Category;
  expiration: Expiration;
  exposure: Exposure;
  language: Language;

  isBurn: boolean;
  password: string;

  tags: string[];
};

export type UpdatePasteDto = Omit<CreatePasteDto, "expiration" | "isBurn">;
