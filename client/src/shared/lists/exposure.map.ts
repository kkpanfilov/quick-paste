export const exposureMap = {
  public: "Public",
  unlisted: "Unlisted",
  private: "Private",
  protected: "Protected",
  shared: "Shared",
} as const;

export type Exposure = keyof typeof exposureMap;
export type ExposureLabel = (typeof exposureMap)[Exposure];
