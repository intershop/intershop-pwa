import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { defer, fromEvent, iif, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take, takeWhile, withLatestFrom } from 'rxjs/operators';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { NGRX_STATE_SK } from 'ish-core/configurations/ngrx-state-transfer';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { distinctCompareWith, mapToProperty, whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { applyConfiguration } from './configuration.actions';
import { getCurrentLocale, getDeviceType } from './configuration.selectors';

@Injectable()
export class ConfigurationEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private stateProperties: StatePropertiesService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: number,
    translateService: TranslateService,
    appRef: ApplicationRef
  ) {
    appRef.isStable
      .pipe(takeWhile(() => isPlatformBrowser(platformId)))
      // tslint:disable-next-line:no-any - window can only be used with any here
      .subscribe(stable => ((window as any).angularStable = stable));

    store
      .pipe(
        select(getCurrentLocale),
        mapToProperty('lang'),
        distinctUntilChanged(),
        // https://github.com/ngx-translate/core/issues/1030
        debounceTime(0),
        whenTruthy()
      )
      .subscribe(lang => translateService.use(lang));
  }

  setInitialRestEndpoint$ = createEffect(() =>
    iif(
      () => !this.transferState.hasKey(NGRX_STATE_SK),
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        take(1),
        withLatestFrom(
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_BASE_URL', 'icmBaseURL'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_SERVER', 'icmServer'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_SERVER_STATIC', 'icmServerStatic'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_CHANNEL', 'icmChannel'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_APPLICATION', 'icmApplication'),
          this.stateProperties
            .getStateOrEnvOrDefault<string | string[]>('FEATURES', 'features')
            .pipe(map(x => (typeof x === 'string' ? x.split(/,/g) : x))),
          this.stateProperties.getStateOrEnvOrDefault<string>('THEME', 'theme').pipe(map(x => x || 'default')),
          this.stateProperties
            .getStateOrEnvOrDefault<string>('ICM_IDENTITY_PROVIDER', 'identityProvider')
            .pipe(map(x => x || 'ICM')),
          this.stateProperties
            .getStateOrEnvOrDefault<string | object>('IDENTITY_PROVIDERS', 'identityProviders')
            .pipe(map(config => (typeof config === 'string' ? JSON.parse(config) : config)))
        ),
        map(
          ([
            ,
            baseURL,
            server,
            serverStatic,
            channel,
            application,
            features,
            theme,
            identityProvider,
            identityProviders,
          ]) =>
            applyConfiguration({
              baseURL,
              server,
              serverStatic,
              channel,
              application,
              features,
              theme,
              identityProvider,
              identityProviders,
            })
        )
      )
    )
  );

  setDeviceType$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      defer(() =>
        merge(this.actions$.pipe(ofType(ROOT_EFFECTS_INIT)), fromEvent(window, 'resize')).pipe(
          map<unknown, DeviceType>(() => {
            if (window.innerWidth < this.mediumBreakpointWidth) {
              return 'mobile';
            } else if (window.innerWidth < this.largeBreakpointWidth) {
              return 'tablet';
            } else {
              return 'desktop';
            }
          }),
          distinctCompareWith(this.store.pipe(select(getDeviceType))),
          map(deviceType => applyConfiguration({ _deviceType: deviceType }))
        )
      )
    )
  );
}
