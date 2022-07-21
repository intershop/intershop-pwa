import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { Observable, map, take } from 'rxjs';

import { ApiService } from 'ish-core/services/api/api.service';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable({
  providedIn: 'root',
})
export class OAuthConfigurationService {
  constructor(private apiService: ApiService) {}

  get config$(): Observable<AuthConfig> {
    return this.apiService
      .constructUrlForPath('-/token', {
        sendCurrency: false,
        sendLocale: false,
        sendApplication: false,
      })
      .pipe(
        whenTruthy(),
        take(1),
        map<string, AuthConfig>(url => ({
          scope: 'openid profile email voucher offline_access',
          tokenEndpoint: url,
          requireHttps: url.startsWith('https'),
        }))
      );
  }
}
