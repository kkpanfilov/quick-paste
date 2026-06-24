export {};

declare global {
  interface Window {
    getAccessToken: () => string | null;
    clearAccessToken: () => void;
  }
}
