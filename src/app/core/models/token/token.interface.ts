/**
 * return correct token options for given grantType (NOTE: 'anonymous' grant type has no token options)
 */
export type FetchTokenOptions<T extends GrantType> = T extends 'password'
  ? FetchTokenPasswordOptions
  : T extends 'client_credentials'
  ? FetchTokenClientCredentialsOptions
  : FetchTokenRefreshTokenOptions;

interface FetchTokenPasswordOptions {
  username: string;
  password: string;
  organization?: string;
}

interface FetchTokenClientCredentialsOptions {
  username: string;
  password: string;
  organization?: string;
}

interface FetchTokenRefreshTokenOptions {
  refresh_token: string;
}

export type GrantType = 'anonymous' | 'password' | 'client_credentials' | 'refresh_token';
