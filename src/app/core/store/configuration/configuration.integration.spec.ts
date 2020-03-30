import { Location } from '@angular/common';
import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { configurationMeta } from 'ish-core/configurations/configuration.meta';
import { ConfigurationGuard } from 'ish-core/guards/configuration.guard';
import { Locale } from 'ish-core/models/locale/locale.model';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { ApplyConfiguration, getFeatures, getRestEndpoint } from 'ish-core/store/configuration';
import { ConfigurationEffects } from 'ish-core/store/configuration/configuration.effects';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { SetAvailableLocales, getCurrentLocale } from 'ish-core/store/locale';
import { localeReducer } from 'ish-core/store/locale/locale.reducer';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

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
        ngrxTesting({
          reducers: { configuration: configurationReducer, locale: localeReducer },
          effects: [ConfigurationEffects],
          config: { metaReducers: [configurationMeta] },
          routerStore: true,
        }),
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: ConfigurationService, useFactory: () => instance(configurationService) },
      ],
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    store$ = TestBed.get(TestStore);
    store$.dispatch(new SetAvailableLocales({ locales: [{ lang: 'en_US' }, { lang: 'de_DE' }] as Locale[] }));
    store$.dispatch(new ApplyConfiguration({ baseURL: 'http://example.org' }));
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
    expect(getFeatures(store$.state)).toIncludeAllMembers(['a', 'b', 'c']);
  }));

  it('should unset features if "none" was provided', fakeAsync(() => {
    store$.dispatch(new ApplyConfiguration({ features: ['a', 'b', 'c'] }));
    router.navigateByUrl('/home;features=none;redirect=1');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getFeatures(store$.state)).toBeEmpty();
  }));

  it('should not set features if "default" was provided', fakeAsync(() => {
    store$.dispatch(new ApplyConfiguration({ features: ['a', 'b', 'c'] }));
    router.navigateByUrl('/home;features=default;redirect=1');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getFeatures(store$.state)).toIncludeAllMembers(['a', 'b', 'c']);
  }));

  it('should set imported locale to state', fakeAsync(() => {
    router.navigateByUrl('/home;redirect=1;lang=de_DE');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getCurrentLocale(store$.state).lang).toEqual('de_DE');
  }));
});
