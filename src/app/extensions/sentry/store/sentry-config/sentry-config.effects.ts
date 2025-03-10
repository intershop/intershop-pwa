import { Injectable, TransferState } from '@angular/core';
import { Actions, concatLatestFrom, createEffect } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { addBreadcrumb, captureEvent, configureScope, init } from '@sentry/browser';
import { EMPTY, iif } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeWhile, tap } from 'rxjs/operators';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { getGeneralError } from 'ish-core/store/core/error';
import { ofUrl, selectRouter } from 'ish-core/store/core/router';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
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
    private cookiesService: CookiesService
  ) {}

  setSentryConfig$ = createEffect(() =>
    this.actions$.pipe(
      takeWhile(() => SSR && this.featureToggleService.enabled('sentry')),
      take(1),
      concatLatestFrom(() => this.stateProperties.getStateOrEnvOrDefault<string>('SENTRY_DSN', 'sentryDSN')),
      map(([, sentryDSN]) => sentryDSN),
      whenTruthy(),
      map(dsn => setSentryConfig({ dsn }))
    )
  );

  configureSentry$ = createEffect(
    () =>
      iif(
        () => this.cookiesService.cookieConsentFor('tracking'),
        this.store.pipe(
          select(getSentryDSN),
          whenTruthy(),
          tap(dsn => {
            const release = this.transferState.get<string>(DISPLAY_VERSION, 'development');
            init({ dsn, release });
          })
        ),
        EMPTY
      ),
    { dispatch: false }
  );

  trackUserLogin$ = createEffect(
    () =>
      this.store.pipe(
        select(getLoggedInUser),
        mapToProperty('email'),
        distinctUntilChanged(),
        // eslint-disable-next-line etc/no-deprecated
        tap(email => configureScope(scope => scope.setUser(email ? { email } : undefined)))
      ),
    { dispatch: false }
  );

  trackRouting$ = createEffect(
    () =>
      this.store.pipe(
        select(selectRouter),
        map(payload => JSON.stringify(payload)),
        tap(message => addBreadcrumb({ category: 'routing', message }))
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
          captureEvent({
            level: 'error',
            message: typeof error === 'string' ? error : `${error.code} - ${error.message}`,
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
          captureEvent({
            level: 'error',
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
