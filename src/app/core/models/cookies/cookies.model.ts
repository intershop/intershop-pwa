export interface CookieConsentOptions {
  options: {
    [id: string]: {
      name: string;
      description: string;
      required?: boolean;
    };
  };
  allowedCookies?: string[];
}

export interface CookieConsentSettings {
  enabledOptions: string[];
  version: number;
}
