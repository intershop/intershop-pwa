import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { isEqual } from 'lodash-es';
import { Observable, filter, map, take } from 'rxjs';

import { ApiService } from 'ish-core/services/api/api.service';

const TOKEN_ENDPOINT = '-/token';

@Injectable({
  providedIn: 'root',
})
export class OAuthConfigurationService {
  constructor(private apiService: ApiService) {}

  get config$(): Observable<AuthConfig> {
    return this.apiService
      .constructUrlForPath(TOKEN_ENDPOINT, {
        sendCurrency: false,
        sendLocale: false,
        sendApplication: false,
      })
      .pipe(
        filter(url => !isEqual(url, `/${TOKEN_ENDPOINT}`)), // token endpoint should not be relative
        take(1),
        map<string, AuthConfig>(url => ({
          scope: 'openid profile email voucher offline_access',
          tokenEndpoint: url,
          requireHttps: url.startsWith('https'),
        }))
      );
  }
}
