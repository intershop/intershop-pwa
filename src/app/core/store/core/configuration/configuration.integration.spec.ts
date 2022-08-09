import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { PWAUrlSerializer } from 'ish-core/routing/pwa-url.serializer';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { LocalizationsService } from 'ish-core/services/localizations/localizations.service';
import { applyConfiguration, getFeatures, getRestEndpoint } from 'ish-core/store/core/configuration';
import { ConfigurationEffects } from 'ish-core/store/core/configuration/configuration.effects';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadServerConfigSuccess } from 'ish-core/store/core/server-config';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { getAvailableLocales, getCurrentLocale } from './configuration.selectors';

describe('Configuration Integration', () => {
  let router: Router;
  let location: Location;
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    const configurationService = mock(ConfigurationService);
    when(configurationService.getServerConfiguration()).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(
          ['router', 'configuration', 'serverConfig'],
          [ConfigurationEffects],
          [configurationMeta]
        ),
        RouterTestingModule.withRoutes([{ path: 'home', children: [] }]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: LocalizationsService, useFactory: () => instance(mock(LocalizationsService)) },
        { provide: UrlSerializer, useClass: PWAUrlSerializer },
        provideStoreSnapshots(),
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store$ = TestBed.inject(StoreWithSnapshots);
    store$.dispatch(
      applyConfiguration({
        baseURL: 'http://example.org',
        server: 'INTERSHOP/rest/WFS',
        channel: 'site',
        application: 'rest',
      })
    );
    store$.dispatch(
      loadServerConfigSuccess({
        config: {
          general: {
            locales: ['en_US', 'de_DE'],
            defaultLocale: 'en_US',
          },
        },
      })
    );
  });

  it('should set imported channel to state', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/rest"`);
  }));

  it('should set imported channel and application to state', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site;application=app');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/app"`);
  }));

  it('should preserve query parameters when setting state', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site?foo=bar&test=hello');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home?foo=bar&test=hello"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/rest"`);
  }));

  it('should set imported features to state', fakeAsync(() => {
    router.navigateByUrl('/home;features=a,b,c');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getFeatures(store$.state)).toMatchInlineSnapshot(`
      Array [
        "a",
        "b",
        "c",
      ]
    `);
  }));

  it('should unset features if "none" was provided', fakeAsync(() => {
    store$.dispatch(applyConfiguration({ features: ['a', 'b', 'c'] }));
    router.navigateByUrl('/home;features=none');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getFeatures(store$.state)).toMatchInlineSnapshot(`Array []`);
  }));

  it('should not set features if "default" was provided', fakeAsync(() => {
    store$.dispatch(applyConfiguration({ features: ['a', 'b', 'c'] }));
    router.navigateByUrl('/home;features=default');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getFeatures(store$.state)).toMatchInlineSnapshot(`
      Array [
        "a",
        "b",
        "c",
      ]
    `);
  }));

  it('should set imported locale to state', fakeAsync(() => {
    router.navigateByUrl('/home;lang=de_DE');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getCurrentLocale(store$.state)).toMatchInlineSnapshot(`"de_DE"`);
  }));

  it('should have a default locale on startup in state', fakeAsync(() => {
    expect(getCurrentLocale(store$.state)).toMatchInlineSnapshot(`"en_US"`);
    expect(getAvailableLocales(store$.state)).toMatchInlineSnapshot(`
      Array [
        "en_US",
        "de_DE",
      ]
    `);
  }));
});
