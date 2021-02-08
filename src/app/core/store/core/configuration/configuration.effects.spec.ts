import { TestBed } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { applyConfiguration } from './configuration.actions';
import { ConfigurationEffects } from './configuration.effects';

describe('Configuration Effects', () => {
  let actions$: Observable<Action>;
  let effects: ConfigurationEffects;
  let translateServiceMock: TranslateService;

  beforeEach(() => {
    translateServiceMock = mock(TranslateService);

    TestBed.configureTestingModule({
      imports: [BrowserTransferStateModule, CoreStoreModule.forTesting(['configuration'], [ConfigurationEffects])],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        provideMockActions(() => actions$),
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
      }, 10);
    });
  });
});
