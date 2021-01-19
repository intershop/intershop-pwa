import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { mock, when } from 'ts-mockito';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { ConfigurationGuard } from 'ish-core/guards/configuration.guard';
import { Locale } from 'ish-core/models/locale/locale.model';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { applyConfiguration, getFeatures, getRestEndpoint } from 'ish-core/store/core/configuration';
import { ConfigurationEffects } from 'ish-core/store/core/configuration/configuration.effects';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { getAvailableLocales, getCurrentLocale } from './configuration.selectors';

describe('Configuration Integration', () => {
  let router: Router;
  let location: Location;
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    const configurationService = mock(ConfigurationService);
    when(configurationService.getServerConfiguration()).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        BrowserTransferStateModule,
        CoreStoreModule.forTesting(['router', 'configuration'], [ConfigurationEffects], [configurationMeta]),
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent, canActivate: [ConfigurationGuard] },
        ]),
        TranslateModule.forRoot(),
      ],
      providers: [provideStoreSnapshots()],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store$ = TestBed.inject(StoreWithSnapshots);
    store$.dispatch(
      applyConfiguration({
        baseURL: 'http://example.org',
        locales: [{ lang: 'en_US' }, { lang: 'de_DE' }] as Locale[],
      })
    );
  });

  it('should set imported channel to state', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home;channel=site"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/rest"`);
  }));

  it('should set imported channel and application to state', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site;application=app');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home;channel=site;application=app"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/app"`);
  }));

  it('should set imported channel to state and redirect if requested', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site;redirect=1');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/rest"`);
  }));

  it('should preserve query parameters when redirecting', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site;redirect=1?foo=bar&test=hello');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home?foo=bar&test=hello"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/rest"`);
  }));

  it('should set imported features to state', fakeAsync(() => {
    router.navigateByUrl('/home;features=a,b,c;redirect=1');
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
    router.navigateByUrl('/home;features=none;redirect=1');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getFeatures(store$.state)).toMatchInlineSnapshot(`Array []`);
  }));

  it('should not set features if "default" was provided', fakeAsync(() => {
    store$.dispatch(applyConfiguration({ features: ['a', 'b', 'c'] }));
    router.navigateByUrl('/home;features=default;redirect=1');
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
    router.navigateByUrl('/home;redirect=1;lang=de_DE');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getCurrentLocale(store$.state)).toMatchInlineSnapshot(`
      Object {
        "lang": "de_DE",
      }
    `);
  }));

  it('should have a default locale on startup in state', fakeAsync(() => {
    expect(getCurrentLocale(store$.state)).toMatchInlineSnapshot(`
      Object {
        "lang": "en_US",
      }
    `);
    expect(getAvailableLocales(store$.state)).toMatchInlineSnapshot(`
      Array [
        Object {
          "lang": "en_US",
        },
        Object {
          "lang": "de_DE",
        },
      ]
    `);
  }));
});
