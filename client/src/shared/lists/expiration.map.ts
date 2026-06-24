export const expirationMap = {
  never: "Never",
  burn: "Burn after read",
  "10m": "10 Minutes",
  "1h": "1 Hour",
  "1d": "1 Day",
  "3d": "3 Days",
  "7d": "1 Week",
  "14d": "2 Weeks",
  "30d": "1 Month",
  "180d": "6 Months",
  "1y": "1 Year",
} as const;

export type Expiration = keyof typeof expirationMap;
export type ExpirationLabel = (typeof expirationMap)[Expiration];
