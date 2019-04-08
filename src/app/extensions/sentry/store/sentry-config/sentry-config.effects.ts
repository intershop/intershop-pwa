import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, UPDATE, select } from '@ngrx/store';
import * as Sentry from '@sentry/browser';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { filter, map, take, takeWhile, tap, withLatestFrom } from 'rxjs/operators';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { SetSentryConfig } from './sentry-config.actions';
import { getSentryDSN } from './sentry-config.selectors';

@Injectable()
export class SentryConfigEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private stateProperties: StatePropertiesService,
    private transferState: TransferState,
    private store: Store<{}>,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  @Effect()
  setSentryConfig$ = this.actions$.pipe(
    takeWhile(() => isPlatformServer(this.platformId) && this.featureToggleService.enabled('sentry')),
    ofType<{ features: string[] } & Action>(UPDATE),
    filter(action => action.features.includes('sentry')),
    take(1),
    withLatestFrom(this.stateProperties.getStateOrEnvOrDefault<string>('SENTRY_DSN', 'sentryDSN')),
    map(([, sentryDSN]) => sentryDSN),
    whenTruthy(),
    map(dsn => new SetSentryConfig({ dsn }))
  );

  @Effect({ dispatch: false })
  configureSentry$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    take(1),
    filter(() => this.featureToggleService.enabled('sentry')),
    withLatestFrom(this.store.pipe(select(getSentryDSN))),
    map(([, sentryDSN]) => sentryDSN),
    whenTruthy(),
    tap(dsn => {
      const release = this.transferState.get<string>(DISPLAY_VERSION, 'development');
      Sentry.init({ dsn, release });
    })
  );
}
