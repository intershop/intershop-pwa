import { HttpParams, HttpRequest } from '@angular/common/http';

import { TokenHelper } from './token.helper';

describe('Token Helper', () => {
  const refreshGrant = new HttpParams().set('grant_type', 'refresh_token').set('refresh_token', 'refresh');

  describe('isTokenGrant', () => {
    it('should detect a token grant', () => {
      expect(
        TokenHelper.isTokenGrant(new HttpRequest('POST', 'https://icm/-;loc=en_US/token', refreshGrant))
      ).toBeTrue();
    });

    it.each([
      ['the logout request', new HttpRequest('PUT', 'https://icm/token/logout', undefined)],
      ['a request without grant_type', new HttpRequest('POST', 'https://icm/token', new HttpParams())],
      ['a request with JSON body', new HttpRequest('POST', 'https://icm/token', { grant_type: 'refresh_token' })],
    ])('should not detect %s as token grant', (_, request) => {
      expect(TokenHelper.isTokenGrant(request)).toBeFalse();
    });
  });

  describe('getRefreshToken', () => {
    it('should return the refresh token of a token refresh', () => {
      expect(TokenHelper.getRefreshToken(new HttpRequest('POST', 'https://icm/token', refreshGrant))).toEqual(
        'refresh'
      );
    });

    it('should return undefined for other grants', () => {
      const passwordGrant = new HttpParams().set('grant_type', 'password').set('refresh_token', 'refresh');
      expect(TokenHelper.getRefreshToken(new HttpRequest('POST', 'https://icm/token', passwordGrant))).toBeUndefined();
    });
  });
});
