export const categoryMap = {
  none: null,
  programming: "Programming",
  gaming: "Gaming",
  art: "Art",
  music: "Music",
  science: "Science",
  math: "Math",
  history: "History",
} as const;

export type Category = keyof typeof categoryMap;
export type CategoryLabel = (typeof categoryMap)[Category];
