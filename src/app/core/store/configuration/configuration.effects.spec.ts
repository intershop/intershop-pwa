import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerNavigationAction } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { cold, hot } from 'jest-marbles';
import { Observable, Subject, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { CoreStoreModule } from 'ish-core/store/core-store.module';

import {
  ApplyConfiguration,
  ConfigurationActionTypes,
  LoadServerConfig,
  LoadServerConfigFail,
} from './configuration.actions';
import { ConfigurationEffects } from './configuration.effects';

describe('Configuration Effects', () => {
  let actions$: Observable<Action>;
  let effects: ConfigurationEffects;
  let store$: Store;
  let configurationServiceMock: ConfigurationService;
  let translateServiceMock: TranslateService;

  beforeEach(() => {
    configurationServiceMock = mock(ConfigurationService);
    translateServiceMock = mock(TranslateService);

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['configuration'], [ConfigurationEffects])],
      providers: [
        ConfigurationEffects,
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        provideMockActions(() => actions$),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    });

    effects = TestBed.inject(ConfigurationEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadServerConfigOnInit$', () => {
    it('should trigger the loading of config data on the first page', () => {
      // tslint:disable-next-line: no-any
      const action = routerNavigationAction({ payload: {} as any });
      const expected = new LoadServerConfig();

      actions$ = hot('a', { a: action });
      expect(effects.loadServerConfigOnInit$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not trigger the loading of config data on the second page', () => {
      store$.dispatch(
        new ApplyConfiguration({
          _serverConfig: { application: 'intershop.B2CResponsive' },
        })
      );

      // tslint:disable-next-line: no-any
      const action = routerNavigationAction({ payload: {} as any });
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
      const action = new LoadServerConfig();
      const completion = new ApplyConfiguration({ _serverConfig: {} });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadServerConfig$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadServerConfigFail', () => {
      when(configurationServiceMock.getServerConfiguration()).thenReturn(throwError({ message: 'invalid' }));

      const action = new LoadServerConfig();
      const completion = new LoadServerConfigFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadServerConfig$).toBeObservable(expected$);
    });
  });

  describe('setInitialRestEndpoint$', () => {
    it('should import settings on effects init and complete', done => {
      // tslint:disable:use-async-synchronisation-in-tests
      const testComplete$ = new Subject<void>();

      actions$ = of({ type: ROOT_EFFECTS_INIT });

      testComplete$.pipe(take(2)).subscribe({ complete: done });

      effects.setInitialRestEndpoint$.subscribe(
        data => {
          expect(data.type).toEqual(ConfigurationActionTypes.ApplyConfiguration);
          testComplete$.next();
        },
        fail,
        () => testComplete$.next()
      );
      // tslint:enable:use-async-synchronisation-in-tests
    });
  });

  describe('setLocale$', () => {
    it('should call TranslateService when locale was initialized', done => {
      setTimeout(() => {
        verify(translateServiceMock.use(anything())).once();
        const params = capture(translateServiceMock.use).last();
        expect(params[0]).toEqual('en_US');
        done();
      }, 1000);
    });
  });

  describe('setGTMToken$', () => {
    beforeEach(() => {
      // on server
      process.env.GTM_TOKEN = 'dummy';
    });

    afterEach(() => {
      process.env.GTM_TOKEN = undefined;
    });

    it('should set the token once on effects init and complete', done => {
      // tslint:disable:use-async-synchronisation-in-tests
      const testComplete$ = new Subject<void>();

      actions$ = of({ type: ROOT_EFFECTS_INIT });

      testComplete$.pipe(take(2)).subscribe({ complete: done });

      effects.setGTMToken$.subscribe(
        data => {
          expect(data.type).toEqual(ConfigurationActionTypes.SetGTMToken);
          expect(data.payload).toHaveProperty('gtmToken', 'dummy');
          testComplete$.next();
        },
        fail,
        () => testComplete$.next()
      );
      // tslint:enable:use-async-synchronisation-in-tests
    });
  });
});
