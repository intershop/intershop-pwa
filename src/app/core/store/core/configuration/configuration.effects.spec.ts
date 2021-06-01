import { PLATFORM_ID } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { applyConfiguration } from './configuration.actions';
import { ConfigurationEffects } from './configuration.effects';

describe('Configuration Effects', () => {
  let actions$: Observable<Action>;
  let effects: ConfigurationEffects;
  let translateService: TranslateService;

  beforeEach(() => {
    translateService = mock(TranslateService);

    TestBed.configureTestingModule({
      imports: [
        BrowserTransferStateModule,
        CoreStoreModule.forTesting(['configuration', 'serverConfig'], [ConfigurationEffects]),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(ConfigurationEffects);
    translateService = TestBed.inject(TranslateService);
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
    beforeEach(() => {
      translateService.setDefaultLang('en_US');
      translateService.use('en_US');
    });
    it('should update TranslateService when locale was initialized', done => {
      setTimeout(() => {
        expect(translateService.currentLang).toMatchInlineSnapshot(`"en_US"`);
        expect(translateService.defaultLang).toMatchInlineSnapshot(`"en_US"`);
        done();
      }, 1000);
    });
    it('should update TranslateService when different locale is requested', fakeAsync(() => {
      actions$ = of(
        applyConfiguration({
          lang: 'de_DE',
          locales: [
            { lang: 'de_DE', currency: 'EUR', value: 'de', displayName: 'German', displayLong: 'German (Germany)' },
            {
              lang: 'en_US',
              currency: 'USD',
              value: 'en',
              displayName: 'English',
              displayLong: 'English (United States)',
            },
          ],
        })
      );
      tick(1000);
      expect(translateService.currentLang).toMatchInlineSnapshot(`"de_DE"`);
      expect(translateService.defaultLang).toMatchInlineSnapshot(`"de_DE"`);
    }));
  });
});
