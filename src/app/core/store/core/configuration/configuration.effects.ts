import { ApplicationRef, Inject, Injectable, TransferState, isDevMode } from '@angular/core';
import { Actions, ROOT_EFFECTS_INIT, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, defer, fromEvent, iif, merge } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, take, takeWhile } from 'rxjs/operators';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { NGRX_STATE_SK } from 'ish-core/configurations/ngrx-state-transfer';
import { SSR_LOCALE } from 'ish-core/configurations/state-keys';
import { FeatureToggleType } from 'ish-core/feature-toggle.module';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { LocalizationsService } from 'ish-core/services/localizations/localizations.service';
import { DomService } from 'ish-core/utils/dom/dom.service';
import { InjectSingle } from 'ish-core/utils/injection';
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
    private domService: DomService,
    private store: Store,
    private stateProperties: StatePropertiesService,
    private transferState: TransferState,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: InjectSingle<typeof MEDIUM_BREAKPOINT_WIDTH>,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: InjectSingle<typeof LARGE_BREAKPOINT_WIDTH>,

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
        this.domService.setAttributeForSelector('html', 'lang', lang.replace('_', '-'));
      });
  }

  transferEnvironmentProperties$ = createEffect(() =>
    iif(
      () => !this.transferState.hasKey(NGRX_STATE_SK),
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        take(1),
        concatLatestFrom(() => [
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_BASE_URL', 'icmBaseURL'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_SERVER', 'icmServer'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_SERVER_STATIC', 'icmServerStatic'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_SERVER_WEB', 'icmServerWeb'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_CHANNEL', 'icmChannel'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICM_APPLICATION', 'icmApplication'),
          this.stateProperties
            .getStateOrEnvOrDefault<string | string[]>('FEATURES', 'features')
            .pipe(map(x => (typeof x === 'string' ? x.split(/,/g) : x) as FeatureToggleType[])),
          this.stateProperties
            .getStateOrEnvOrDefault<string>('IDENTITY_PROVIDER', 'identityProvider')
            .pipe(map(x => x || 'ICM')),
          this.stateProperties.getStateOrEnvOrDefault<ConfigurationType['identityProviders']>(
            'IDENTITY_PROVIDERS',
            'identityProviders'
          ),
          this.stateProperties.getStateOrEnvOrDefault<ConfigurationType['multiSiteLocaleMap']>(
            'MULTI_SITE_LOCALE_MAP',
            'multiSiteLocaleMap'
          ),
        ]),
        map(
          ([
            ,
            baseURL,
            server,
            serverStatic,
            serverWeb,
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
              serverWeb,
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

  setDeviceType$ =
    !SSR &&
    createEffect(() =>
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
