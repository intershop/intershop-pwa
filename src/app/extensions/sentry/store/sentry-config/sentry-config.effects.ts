import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Actions, createEffect } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import * as Sentry from '@sentry/browser';
import { distinctUntilChanged, filter, map, switchMapTo, take, takeWhile, tap, withLatestFrom } from 'rxjs/operators';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CookiesService } from 'ish-core/services/cookies/cookies.service';
import { getGeneralError } from 'ish-core/store/core/error';
import { ofUrl, selectRouter } from 'ish-core/store/core/router';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { setSentryConfig } from './sentry-config.actions';
import { getSentryDSN } from './sentry-config.selectors';

@Injectable()
export class SentryConfigEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private stateProperties: StatePropertiesService,
    private transferState: TransferState,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: string,
    private cookiesService: CookiesService
  ) {}

  setSentryConfig$ = createEffect(() =>
    this.actions$.pipe(
      takeWhile(() => isPlatformServer(this.platformId) && this.featureToggleService.enabled('sentry')),
      take(1),
      withLatestFrom(this.stateProperties.getStateOrEnvOrDefault<string>('SENTRY_DSN', 'sentryDSN')),
      map(([, sentryDSN]) => sentryDSN),
      whenTruthy(),
      map(dsn => setSentryConfig({ dsn }))
    )
  );

  configureSentry$ = createEffect(
    () =>
      this.cookiesService.cookieLawSeen$.pipe(
        whenTruthy(),
        switchMapTo(
          this.store.pipe(
            select(getSentryDSN),
            whenTruthy(),
            tap(dsn => {
              const release = this.transferState.get<string>(DISPLAY_VERSION, 'development');
              Sentry.init({ dsn, release });
            })
          )
        )
      ),
    { dispatch: false }
  );

  trackUserLogin$ = createEffect(
    () =>
      this.store.pipe(
        select(getLoggedInUser),
        mapToProperty('email'),
        distinctUntilChanged(),
        tap(email => Sentry.configureScope(scope => scope.setUser(email ? { email } : undefined)))
      ),
    { dispatch: false }
  );

  trackRouting$ = createEffect(
    () =>
      this.store.pipe(
        select(selectRouter),
        map(payload => JSON.stringify(payload)),
        tap(message => Sentry.addBreadcrumb({ category: 'routing', message }))
      ),
    { dispatch: false }
  );

  trackErrorPageErrors$ = createEffect(
    () =>
      this.store.pipe(
        ofUrl(/^\/error.*/),
        select(getGeneralError),
        whenTruthy(),
        distinctUntilChanged(),
        tap(error => {
          Sentry.captureEvent({
            level: Sentry.Severity.Error,
            message: error.message,
            extra: { error },
            tags: { origin: 'Error Page' },
          });
        })
      ),
    { dispatch: false }
  );

  trackFailActions$ = createEffect(
    () =>
      this.actions$.pipe(
        filter<{ payload: { error: Error } } & Action>(action => action.type.endsWith('Fail')),
        tap(action => {
          const err = action.payload.error;
          Sentry.captureEvent({
            level: Sentry.Severity.Error,
            message: err.message,
            extra: {
              error: err,
              action,
            },
            tags: {
              origin: action.type,
            },
          });
        })
      ),
    { dispatch: false }
  );
}
