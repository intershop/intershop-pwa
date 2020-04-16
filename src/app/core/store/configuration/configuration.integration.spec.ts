import { Location } from '@angular/common';
import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ConfigurationGuard } from 'ish-core/guards/configuration.guard';
import { Locale } from 'ish-core/models/locale/locale.model';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { ApplyConfiguration, getFeatures, getRestEndpoint } from 'ish-core/store/configuration';
import { ConfigurationEffects } from 'ish-core/store/configuration/configuration.effects';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { getAvailableLocales, getCurrentLocale } from './configuration.selectors';

describe('Configuration Integration', () => {
  let router: Router;
  let location: Location;
  let store$: TestStore;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    const configurationService = mock(ConfigurationService);
    when(configurationService.getServerConfiguration()).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent, canActivate: [ConfigurationGuard] },
        ]),
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: { configuration: configurationReducer },
          effects: [ConfigurationEffects],
          config: { metaReducers: [configurationMeta] },
          routerStore: true,
        }),
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: ConfigurationService, useFactory: () => instance(configurationService) },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    store$ = TestBed.get(TestStore);
    store$.dispatch(
      new ApplyConfiguration({
        baseURL: 'http://example.org',
        locales: [{ lang: 'en_US' }, { lang: 'de_DE' }] as Locale[],
      })
    );
  });

  it('should set imported channel to state', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home;channel=site"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/-"`);
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
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/-"`);
  }));

  it('should preserve query parameters when redirecting', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site;redirect=1?foo=bar&test=hello');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home?foo=bar&test=hello"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://example.org/INTERSHOP/rest/WFS/site/-"`);
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
    store$.dispatch(new ApplyConfiguration({ features: ['a', 'b', 'c'] }));
    router.navigateByUrl('/home;features=none;redirect=1');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getFeatures(store$.state)).toMatchInlineSnapshot(`Array []`);
  }));

  it('should not set features if "default" was provided', fakeAsync(() => {
    store$.dispatch(new ApplyConfiguration({ features: ['a', 'b', 'c'] }));
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
