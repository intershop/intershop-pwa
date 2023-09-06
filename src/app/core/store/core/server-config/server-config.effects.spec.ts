import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration/configuration.selectors';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { serverConfigError } from 'ish-core/store/core/error';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { routerTestNavigationAction } from 'ish-core/utils/dev/routing';
import { MultiSiteService } from 'ish-core/utils/multi-site/multi-site.service';

import { loadServerConfig, loadServerConfigFail, loadServerConfigSuccess } from './server-config.actions';
import { ServerConfigEffects } from './server-config.effects';
import { isServerConfigurationLoaded } from './server-config.selectors';

describe('Server Config Effects', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    const configurationServiceMock = mock(ConfigurationService);
    const cookiesServiceMock = mock(CookiesService);
    const multiSiteServiceMock = mock(MultiSiteService);

    when(configurationServiceMock.getServerConfiguration()).thenReturn(of({}));
    when(cookiesServiceMock.get(anything())).thenReturn('de_DE');
    when(multiSiteServiceMock.getLangUpdatedUrl(anything(), anything())).thenReturn(of('/home;lang=de_DE'));
    when(multiSiteServiceMock.appendUrlParams(anything(), anything(), anything())).thenReturn('/home;lang=de_DE');

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['serverConfig', 'configuration'], [ServerConfigEffects])],
      providers: [
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
        { provide: CookiesService, useFactory: () => instance(cookiesServiceMock) },
        { provide: MultiSiteService, useFactory: () => instance(multiSiteServiceMock) },
        provideStoreSnapshots(),
      ],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  it('should be created', () => {
    expect(store$).toBeTruthy();
  });

  it('should trigger the loading of config data on the first page', () => {
    Object.defineProperty(window, 'location', {
      value: { assign: jest.fn() },
      writable: true,
    });
    store$.dispatch(routerTestNavigationAction({ routerState: { url: '/any' } }));

    expect(store$.actionsArray()).toMatchInlineSnapshot(`
      @ngrx/router-store/navigation: /any
      [Configuration Internal] Get the ICM configuration
      [Configuration API] Get the ICM configuration Success:
        config: {}
    `);
  });
});

describe('Server Config Effects', () => {
  let actions$: Observable<Action>;
  let effects: ServerConfigEffects;
  let store$: MockStore;
  let configurationServiceMock: ConfigurationService;
  let cookiesServiceMock: CookiesService;
  let multiSiteServiceMock: MultiSiteService;

  beforeEach(() => {
    configurationServiceMock = mock(ConfigurationService);
    cookiesServiceMock = mock(CookiesService);
    multiSiteServiceMock = mock(MultiSiteService);

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
        { provide: CookiesService, useFactory: () => instance(cookiesServiceMock) },
        { provide: MultiSiteService, useFactory: () => instance(multiSiteServiceMock) },
        provideMockActions(() => actions$),
        provideMockStore(),
        ServerConfigEffects,
      ],
    });

    effects = TestBed.inject(ServerConfigEffects);
    store$ = TestBed.inject(MockStore);
  });

  describe('loadServerConfigOnInit$', () => {
    it('should trigger the loading of config data on the first page', () => {
      store$.overrideSelector(isServerConfigurationLoaded, false);

      const action = routerTestNavigationAction({});
      const expected = loadServerConfig();

      actions$ = hot('a', { a: action });
      expect(effects.loadServerConfigOnInit$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not trigger the loading of config data on the second page', () => {
      store$.overrideSelector(isServerConfigurationLoaded, true);

      const action = routerTestNavigationAction({});
      actions$ = hot('        ----a---a--a', { a: action });
      const expected$ = cold('------------');

      expect(effects.loadServerConfigOnInit$).toBeObservable(expected$);
    });
  });

  describe('loadServerConfig$', () => {
    beforeEach(() => {
      when(configurationServiceMock.getServerConfiguration()).thenReturn(of({}));
      when(multiSiteServiceMock.getLangUpdatedUrl(anything(), anything())).thenReturn(of('/home;lang=de_DE'));
      when(multiSiteServiceMock.appendUrlParams(anything(), anything(), anything())).thenReturn('/home;lang=de_DE');
    });

    it('should map to action of type LoadServerConfigSuccess', () => {
      const action = loadServerConfig();
      const completion = loadServerConfigSuccess({ config: {} });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadServerConfig$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadServerConfigFail', () => {
      when(configurationServiceMock.getServerConfiguration()).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const action = loadServerConfig();
      const completion = loadServerConfigFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadServerConfig$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type serverConfigError', () => {
      const action = loadServerConfigFail({ error: makeHttpError({ message: 'invalid' }) });
      const completion = serverConfigError({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.mapToServerConfigError$).toBeObservable(expected$);
    });

    it("should reload the current page if the user's locale cookie differs from the current locale", fakeAsync(() => {
      when(cookiesServiceMock.get(anything())).thenReturn('de_DE');
      store$.overrideSelector(getCurrentLocale, 'en_US');

      // mock location.assign() with jest.fn()
      Object.defineProperty(window, 'location', {
        value: { assign: jest.fn() },
        writable: true,
      });

      const action = loadServerConfigSuccess({ config: {} as ServerConfig });
      actions$ = of(action);

      effects.switchToPreferredLanguage$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(window.location.assign).toHaveBeenCalled();
    }));

    it("should not reload the current page if the user's locale cookie is equal to the current locale", fakeAsync(() => {
      when(cookiesServiceMock.get(anything())).thenReturn('en_US');
      store$.overrideSelector(getCurrentLocale, 'en_US');

      // mock location.assign() with jest.fn()
      Object.defineProperty(window, 'location', {
        value: { assign: jest.fn() },
        writable: true,
      });

      const action = loadServerConfigSuccess({ config: {} as ServerConfig });
      actions$ = of(action);

      effects.switchToPreferredLanguage$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(window.location.assign).not.toHaveBeenCalled();
    }));
  });
});
