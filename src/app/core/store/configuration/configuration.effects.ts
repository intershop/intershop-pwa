import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ApplicationRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationStart, NavigationEnd, ParamMap, Router } from '@angular/router';
import { Actions, Effect, ROOT_EFFECTS_INIT, ofType } from '@ngrx/effects';
import { filter, map, mergeMap, take, takeWhile, tap, withLatestFrom } from 'rxjs/operators';

import { SelectLocale } from 'ish-core/store/locale';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { ApplyConfiguration, SetGTMToken } from './configuration.actions';
import { ConfigurationState } from './configuration.reducer';

@Injectable()
export class ConfigurationEffects {
  constructor(
    private actions$: Actions,
    private stateProperties: StatePropertiesService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string,
    private appRef: ApplicationRef
  ) {}

  @Effect({ dispatch: false })
  $stable = this.appRef.isStable.pipe(
    takeWhile(() => isPlatformBrowser(this.platformId)),
    // tslint:disable-next-line:no-any
    tap(stable => ((window as any).angularStable = stable))
  );

  @Effect()
  routerWatch$ = this.router.events.pipe(
    takeWhile(event => !(event instanceof NavigationEnd)),
    filter<ActivationStart>(event => event instanceof ActivationStart),
    map(event => event.snapshot),
    tap(snapshot => this.redirectIfNeeded(snapshot)),
    mergeMap(({ paramMap }) => [...this.extractConfigurationParameters(paramMap), ...this.extractLanguage(paramMap)])
  );

  @Effect()
  setInitialRestEndpoint$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    take(1),
    withLatestFrom(
      this.stateProperties.getStateOrEnvOrDefault<string>('icmBaseURL', 'ICM_BASE_URL'),
      this.stateProperties.getStateOrEnvOrDefault<string>('icmURLPrefix'),
      this.stateProperties.getStateOrEnvOrDefault<string>('icmServerGroup'),
      this.stateProperties.getStateOrEnvOrDefault<string>('icmRestURLPath'),
      this.stateProperties.getStateOrEnvOrDefault<string>('icmStaticURLPath'),
      this.stateProperties.getStateOrEnvOrDefault<string>('icmChannel', 'ICM_CHANNEL'),
      this.stateProperties.getStateOrEnvOrDefault<string>('icmApplication', 'ICM_APPLICATION'),
      this.stateProperties
        .getStateOrEnvOrDefault<string | string[]>('features', 'FEATURES')
        .pipe(map(x => (typeof x === 'string' ? x.split(/,/g) : x))),
      this.stateProperties.getStateOrEnvOrDefault<string>('theme', 'THEME').pipe(map(x => x || 'default'))
    ),
    map(
      ([, baseURL, urlPrefix, serverGroup, restURLPath, staticURLPath, channel, application, features, theme]) =>
        new ApplyConfiguration({
          baseURL,
          urlPrefix,
          serverGroup,
          restURLPath,
          staticURLPath,
          channel,
          application,
          features,
          theme,
        })
    )
  );

  @Effect()
  setGTMToken$ = this.actions$.pipe(
    takeWhile(() => isPlatformServer(this.platformId)),
    ofType(ROOT_EFFECTS_INIT),
    take(1),
    withLatestFrom(this.stateProperties.getStateOrEnvOrDefault<string>('gtmToken', 'GTM_TOKEN')),
    map(([, gtmToken]) => gtmToken),
    whenTruthy(),
    map(gtmToken => new SetGTMToken({ gtmToken }))
  );

  extractConfigurationParameters(paramMap: ParamMap) {
    const keys: (keyof ConfigurationState)[] = ['channel', 'application'];
    const properties: Partial<ConfigurationState> = keys
      .filter(key => paramMap.has(key))
      .map(key => ({ [key]: paramMap.get(key) }))
      .reduce((acc, val) => ({ ...acc, ...val }), {});

    if (paramMap.has('icmHost')) {
      properties.baseURL = `${paramMap.get('icmScheme') || 'https'}://${paramMap.get('icmHost')}`;
    }

    if (paramMap.has('features') && paramMap.get('features') !== 'default') {
      if (paramMap.get('features') === 'none') {
        properties.features = [];
      } else {
        properties.features = paramMap.get('features').split(/,/g);
      }
    }

    if (paramMap.has('theme')) {
      properties.theme = paramMap.get('theme');
    }

    return Object.keys(properties).length ? [new ApplyConfiguration(properties)] : [];
  }

  extractLanguage(paramMap: ParamMap) {
    return paramMap.has('lang') && paramMap.get('lang') !== 'default'
      ? [new SelectLocale({ lang: paramMap.get('lang') })]
      : [];
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    const url = route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
    const params = Object.entries(route.queryParams)
      .map(kvp => kvp.join('='))
      .join('&');
    return url + (params ? '?' + params : '');
  }

  redirectIfNeeded(snapshot: ActivatedRouteSnapshot) {
    if (snapshot.paramMap.has('redirect')) {
      const url = this.getResolvedUrl(snapshot);
      const params = url.match(/\/.*?(;[^?]*).*?/);
      const navigateTo = url.replace(params[1], '');
      return this.router.navigateByUrl(navigateTo);
    }
  }
}
