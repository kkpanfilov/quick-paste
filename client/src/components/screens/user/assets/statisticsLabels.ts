export const statisticsLabels = {
  pastes: "Total pastes",
  comments: "Comments",
  likes: "Likes",
  languages: "Languages",
} as const;

export type Statistic = keyof typeof statisticsLabels;
export type StatisticLabel = (typeof statisticsLabels)[Statistic];
