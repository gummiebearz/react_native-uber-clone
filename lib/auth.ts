export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, value: string) => Promise<void>;
  clearToken?: (key: string) => void;
}
