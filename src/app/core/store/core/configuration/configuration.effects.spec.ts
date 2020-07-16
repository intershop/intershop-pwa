import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { applyConfiguration, setGTMToken } from './configuration.actions';
import { ConfigurationEffects } from './configuration.effects';

describe('Configuration Effects', () => {
  let actions$: Observable<Action>;
  let effects: ConfigurationEffects;
  let translateServiceMock: TranslateService;

  beforeEach(() => {
    translateServiceMock = mock(TranslateService);

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['configuration'], [ConfigurationEffects])],
      providers: [
        ConfigurationEffects,
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        provideMockActions(() => actions$),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    });

    effects = TestBed.inject(ConfigurationEffects);
  });

  describe('setInitialRestEndpoint$', () => {
    it('should import settings on effects init and complete', done => {
      // tslint:disable:use-async-synchronization-in-tests
      const testComplete$ = new Subject<void>();

      actions$ = of({ type: ROOT_EFFECTS_INIT });

      testComplete$.pipe(take(2)).subscribe({ complete: done });

      effects.setInitialRestEndpoint$.subscribe(
        data => {
          expect(data.type).toEqual(applyConfiguration.type);
          testComplete$.next();
        },
        fail,
        () => testComplete$.next()
      );
      // tslint:enable:use-async-synchronization-in-tests
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
      // tslint:disable:use-async-synchronization-in-tests
      const testComplete$ = new Subject<void>();

      actions$ = of({ type: ROOT_EFFECTS_INIT });

      testComplete$.pipe(take(2)).subscribe({ complete: done });

      effects.setGTMToken$.subscribe(
        data => {
          expect(data.type).toEqual(setGTMToken.type);
          expect(data.payload).toHaveProperty('gtmToken', 'dummy');
          testComplete$.next();
        },
        fail,
        () => testComplete$.next()
      );
      // tslint:enable:use-async-synchronization-in-tests
    });
  });
});
