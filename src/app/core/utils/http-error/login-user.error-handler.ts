import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppFacade } from 'ish-core/facades/app.facade';
import { SpecialHttpErrorHandler } from 'ish-core/interceptors/icm-error-mapper.interceptor';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/* eslint-disable @typescript-eslint/no-restricted-types */

@Injectable()
export class LoginUserErrorHandler implements SpecialHttpErrorHandler {
  private loginType: string;
  private destroyRef = inject(DestroyRef);

  constructor(appFacade: AppFacade) {
    appFacade
      .serverSetting$<string>('preferences.UserCredentialPreferences.UserRegistrationLoginType')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loginType => {
        this.loginType = loginType;
      });
  }

  test(error: HttpErrorResponse): boolean {
    return (error.status === 401 || error.status === 403) && error.url.includes('token');
  }
  map(error: HttpErrorResponse): Partial<HttpError> {
    if (error.status === 403) {
      return { code: 'account.login.customer_approval.error.invalid' };
    }
    if (this.loginType === 'email') {
      return { code: 'account.login.email_password.error.invalid' };
    } else {
      return { code: 'account.login.username_password.error.invalid' };
    }
  }
}
