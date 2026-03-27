export interface CookieConsentOptions {
  options: Record<
    string,
    {
      name: string;
      description: string;
      required?: boolean;
    }
  >;
  allowedCookies?: string[];
}

export interface CookieConsentSettings {
  enabledOptions: string[];
  version: number;
}
