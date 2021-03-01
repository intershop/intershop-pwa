import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { routerTestNavigationAction } from 'ish-core/utils/dev/routing';

import { loadServerConfig, loadServerConfigFail, loadServerConfigSuccess } from './server-config.actions';
import { ServerConfigEffects } from './server-config.effects';
import { isServerConfigurationLoaded } from './server-config.selectors';

describe('Server Config Effects', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    const configurationServiceMock = mock(ConfigurationService);
    when(configurationServiceMock.getServerConfiguration()).thenReturn(of({}));

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting([], [ServerConfigEffects]), GeneralStoreModule.forTesting('serverConfig')],
      providers: [
        provideStoreSnapshots(),
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
      ],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  it('should be created', () => {
    expect(store$).toBeTruthy();
  });

  it('should trigger the loading of config data on the first page', () => {
    store$.dispatch(routerTestNavigationAction({ routerState: { url: '/any' } }));

    expect(store$.actionsArray()).toMatchInlineSnapshot(`
      @ngrx/router-store/navigation:
        routerState: {"url":"/any"}
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

  beforeEach(() => {
    configurationServiceMock = mock(ConfigurationService);

    TestBed.configureTestingModule({
      providers: [
        ServerConfigEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
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
    });

    it('should map to action of type ApplyConfiguration', () => {
      const action = loadServerConfig();
      const completion = loadServerConfigSuccess({ config: {} });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadServerConfig$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadServerConfigFail', () => {
      when(configurationServiceMock.getServerConfiguration()).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const action = loadServerConfig();
      const completion = loadServerConfigFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadServerConfig$).toBeObservable(expected$);
    });
  });
});
