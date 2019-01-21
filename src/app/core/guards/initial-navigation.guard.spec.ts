import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Locale } from 'ish-core/models/locale/locale.model';
import { getFeatures, getRestEndpoint } from 'ish-core/store/configuration';
import { ConfigurationEffects } from 'ish-core/store/configuration/configuration.effects';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { SetAvailableLocales, getCurrentLocale } from 'ish-core/store/locale';
import { localeReducer } from 'ish-core/store/locale/locale.reducer';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { InitialNavigationGuard } from './initial-navigation.guard';

describe('Initial Navigation Guard', () => {
  let router: Router;
  let location: Location;
  let store$: TestStore;

  beforeEach(() => {
    // tslint:disable-next-line:use-component-change-detection
    @Component({ template: 'dummy' })
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        ...ngrxTesting({ configuration: configurationReducer, locale: localeReducer }, [ConfigurationEffects]),
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent, canActivate: [InitialNavigationGuard] },
        ]),
      ],
      providers: [InitialNavigationGuard],
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    store$ = TestBed.get(TestStore);
    store$.dispatch(new SetAvailableLocales({ locales: [{ lang: 'en_US' }, { lang: 'de_DE' }] as Locale[] }));
  });

  it('should be created', () => {
    const guard = TestBed.get(InitialNavigationGuard);
    expect(guard).toBeTruthy();
  });

  it('should set imported channel to state', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home;channel=site"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://localhost:4200/INTERSHOP/rest/WFS/site/-"`);
  }));

  it('should set imported channel and application to state', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site;application=app');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home;channel=site;application=app"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://localhost:4200/INTERSHOP/rest/WFS/site/app"`);
  }));

  it('should set imported channel to state and redirect if requested', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site;redirect=1');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://localhost:4200/INTERSHOP/rest/WFS/site/-"`);
  }));

  it('should preserve query parameters when redirecting', fakeAsync(() => {
    router.navigateByUrl('/home;channel=site;redirect=1?foo=bar&test=hello');
    tick(500);
    expect(location.path()).toMatchInlineSnapshot(`"/home?foo=bar&test=hello"`);
    expect(getRestEndpoint(store$.state)).toMatchInlineSnapshot(`"http://localhost:4200/INTERSHOP/rest/WFS/site/-"`);
  }));

  it('should set imported features to state', fakeAsync(() => {
    router.navigateByUrl('/home;features=a,b,c;redirect=1');
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
