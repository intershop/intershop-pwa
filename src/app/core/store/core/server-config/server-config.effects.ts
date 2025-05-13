import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY, identity } from 'rxjs';
import { concatMap, filter, first, map, switchMap, take, takeWhile } from 'rxjs/operators';

import { FeatureToggleService, FeatureToggleType } from 'ish-core/feature-toggle.module';
import { ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { applyConfiguration, getAvailableLocales, getCurrentLocale } from 'ish-core/store/core/configuration';
import { ConfigurationState } from 'ish-core/store/core/configuration/configuration.reducer';
import { serverConfigError } from 'ish-core/store/core/error';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { MultiSiteService } from 'ish-core/utils/multi-site/multi-site.service';
import { delayUntil, mapErrorToAction, mapToPayloadProperty, whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import {
  loadExtraConfigFail,
  loadExtraConfigSuccess,
  loadServerConfig,
  loadServerConfigFail,
  loadServerConfigSuccess,
} from './server-config.actions';
import { isExtraConfigurationLoaded, isServerConfigurationLoaded } from './server-config.selectors';

@Injectable()
export class ServerConfigEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private configService: ConfigurationService,
    private featureToggleService: FeatureToggleService,
    private cookiesService: CookiesService,
    private multiSiteService: MultiSiteService
  ) {}

  /**
   * get server configuration on routing event, if it is not already loaded
   */
  loadServerConfigOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      SSR ? first() : identity,
      switchMap(() => this.store.pipe(select(isServerConfigurationLoaded))),
      whenFalsy(),
      map(() => loadServerConfig())
    )
  );

  loadServerConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadServerConfig),
      switchMap(() =>
        this.configService.getServerConfiguration().pipe(
          map(([config, definitions]) => loadServerConfigSuccess({ config, definitions })),
          mapErrorToAction(loadServerConfigFail)
        )
      )
    )
  );

  switchToPreferredLanguage$ =
    !SSR &&
    createEffect(
      () =>
        this.actions$.pipe(
          ofType(loadServerConfigSuccess),
          take(1),
          takeWhile(() => this.featureToggleService.enabled('saveLanguageSelection')),
          concatLatestFrom(() => [
            this.store.pipe(select(getAvailableLocales)),
            this.store.pipe(select(getCurrentLocale)),
          ]),
          map(([, availableLocales, currentLocale]) => ({
            cookieLocale: this.cookiesService.get('preferredLocale'),
            availableLocales,
            currentLocale,
          })),
          filter(
            ({ cookieLocale, availableLocales, currentLocale }) =>
              cookieLocale && availableLocales?.includes(cookieLocale) && cookieLocale !== currentLocale
          ),
          concatMap(({ cookieLocale }) => {
            const splittedUrl = location.pathname?.split('?');
            const newUrl = splittedUrl?.[0];

            return this.multiSiteService.getLangUpdatedUrl(cookieLocale, newUrl).pipe(
              whenTruthy(),
              take(1),
              map(modifiedUrl => {
                const modifiedUrlParams = modifiedUrl === newUrl ? { lang: cookieLocale } : {};
                return this.multiSiteService.appendUrlParams(modifiedUrl, modifiedUrlParams, splittedUrl?.[1]);
              }),
              concatMap(url => {
                location.assign(url);
                return EMPTY;
              })
            );
          })
        ),
      { dispatch: false }
    );

  loadExtraServerConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadServerConfig),
      takeWhile(() => this.featureToggleService.enabled('extraConfiguration')),
      switchMap(() => this.store.pipe(select(isExtraConfigurationLoaded))),
      whenFalsy(),
      delayUntil(this.actions$.pipe(ofType(personalizationStatusDetermined))),
      switchMap(() =>
        this.configService.getExtraConfiguration().pipe(
          map(extra => loadExtraConfigSuccess({ extra })),
          mapErrorToAction(loadExtraConfigFail)
        )
      )
    )
  );

  setThemeConfiguration$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadExtraConfigSuccess),
        mapToPayloadProperty('extra'),
        whenTruthy(),
        concatMap(config => {
          this.configService.setThemeConfiguration(config);
          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  setFeatureConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExtraConfigSuccess),
      mapToPayloadProperty('extra'),
      whenTruthy(),
      map(config => this.mapFeatures(config)),
      whenTruthy(),
      map(config => applyConfiguration(config))
    )
  );

  mapToServerConfigError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadServerConfigFail),
      mapToPayloadProperty('error'),
      map(error => serverConfigError({ error }))
    )
  );

  // mapping extra configuration feature toggle overrides to features/addFeatures state used by the feature toggle functionality
  private mapFeatures(config: ServerConfig): Partial<ConfigurationState> {
    const featureConfig: Partial<ConfigurationState> = {};
    if (config.Features) {
      featureConfig.features = (config.Features as string).split(',') as FeatureToggleType[];
    }
    if (config.AddFeatures) {
      featureConfig.addFeatures = (config.AddFeatures as string).split(',') as FeatureToggleType[];
    }
    return featureConfig.features?.length || featureConfig.addFeatures?.length ? featureConfig : undefined;
  }
}
