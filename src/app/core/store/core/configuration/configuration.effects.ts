import { DOCUMENT } from '@angular/common';
import { ApplicationRef, Inject, Injectable, isDevMode } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, combineLatest, defer, fromEvent, iif, merge } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, take, takeWhile, withLatestFrom } from 'rxjs/operators';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { NGRX_STATE_SK } from 'ish-core/configurations/ngrx-state-transfer';
import { SSR_LOCALE } from 'ish-core/configurations/state-keys';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { LocalizationsService } from 'ish-core/services/localizations/localizations.service';
import { distinctCompareWith, mapToPayload, whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import {
  ConfigurationType,
  applyConfiguration,
  loadSingleServerTranslation,
  loadSingleServerTranslationSuccess,
} from './configuration.actions';
import { getCurrentLocale, getDeviceType } from './configuration.selectors';

@Injectable()
export class ConfigurationEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private stateProperties: StatePropertiesService,
    private transferState: TransferState,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: number,
    @Inject(DOCUMENT) document: Document,
    translateService: TranslateService,
    appRef: ApplicationRef,
    private localizationsService: LocalizationsService
  ) {
    appRef.isStable
      .pipe(takeWhile(() => !SSR))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- window can only be used with any here
      .subscribe(stable => ((window as any).angularStable = stable));

    store
      .pipe(
        takeWhile(() => SSR || isDevMode()),
        select(getCurrentLocale),
        whenTruthy(),
        distinctUntilChanged()
      )
      .subscribe(lang => {
        this.transferState.set(SSR_LOCALE, lang);
        translateService.use(lang);
        document.querySelector('html').setAttribute('lang', lang.replace('_', '-'));
      });
  }

  transferEnvironmentProperties$ = createEffect(() =>
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
          combineLatest([
            this.stateProperties.getStateOrEnvOrDefault<string>('IDENTITY_PROVIDER', 'identityProvider'),
            this.stateProperties.getStateOrEnvOrDefault<string>('ICM_IDENTITY_PROVIDER', 'identityProvider'),
          ]).pipe(map(([x, y]) => x || y || 'ICM')),
          this.stateProperties.getStateOrEnvOrDefault<ConfigurationType['identityProviders']>(
            'IDENTITY_PROVIDERS',
            'identityProviders'
          ),
          this.stateProperties.getStateOrEnvOrDefault<ConfigurationType['multiSiteLocaleMap']>(
            'MULTI_SITE_LOCALE_MAP',
            'multiSiteLocaleMap'
          )
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
            identityProvider,
            identityProviders,
            multiSiteLocaleMap,
          ]) =>
            applyConfiguration({
              baseURL,
              server,
              serverStatic,
              channel,
              application,
              features,
              identityProvider,
              identityProviders,
              multiSiteLocaleMap,
            })
        )
      ),
      EMPTY
    )
  );

  setDeviceType$ = createEffect(() =>
    iif(
      () => !SSR,
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
      ),
      EMPTY
    )
  );

  loadSingleServerTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSingleServerTranslation),
      mapToPayload(),
      mergeMap(({ lang, key }) =>
        this.localizationsService
          .getSpecificTranslation(lang, key)
          .pipe(map(translation => loadSingleServerTranslationSuccess({ lang, key, translation })))
      )
    )
  );
}
