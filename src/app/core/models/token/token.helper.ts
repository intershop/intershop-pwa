import { HttpParams, HttpRequest } from '@angular/common/http';

export class TokenHelper {
  /**
   * checks whether the request fetches tokens from the token endpoint, which authenticates it by its grant only
   */
  static isTokenGrant(req: HttpRequest<unknown>): boolean {
    return (
      req?.method === 'POST' &&
      req.url.endsWith('/token') &&
      req.body instanceof HttpParams &&
      req.body.has('grant_type')
    );
  }

  /**
   * @returns the refresh token of a token refresh request
   */
  static getRefreshToken(req: HttpRequest<unknown>): string {
    return req?.body instanceof HttpParams && req.body.get('grant_type') === 'refresh_token'
      ? req.body.get('refresh_token')
      : undefined;
  }
}
