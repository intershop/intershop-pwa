import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { instance, mock } from 'ts-mockito';

import { LocalizationsService } from 'ish-core/services/localizations/localizations.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { applyConfiguration } from './configuration.actions';
import { ConfigurationEffects } from './configuration.effects';

describe('Configuration Effects', () => {
  let actions$: Observable<Action>;
  let effects: ConfigurationEffects;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['configuration', 'serverConfig']), TranslateModule.forRoot()],
      providers: [
        { provide: LocalizationsService, useFactory: () => instance(mock(LocalizationsService)) },
        ConfigurationEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ConfigurationEffects);
    translateService = TestBed.inject(TranslateService);
  });

  describe('setInitialRestEndpoint$', () => {
    it('should import settings on effects init and complete', done => {
      /* eslint-disable ish-custom-rules/use-async-synchronization-in-tests */
      const testComplete$ = new Subject<void>();

      actions$ = of({ type: ROOT_EFFECTS_INIT });

      testComplete$.pipe(take(2)).subscribe({ complete: done });

      effects.transferEnvironmentProperties$.subscribe({
        next: data => {
          expect(data.type).toEqual(applyConfiguration.type);
          testComplete$.next();
        },
        error: fail,
        complete: () => testComplete$.next(),
      });
      /* eslint-enable ish-custom-rules/use-async-synchronization-in-tests */
    });
  });

  describe('setLocale$', () => {
    beforeEach(() => {
      translateService.use('en_US');
    });
    it('should update TranslateService when locale was initialized', fakeAsync(() => {
      tick(1000);
      expect(translateService.currentLang).toMatchInlineSnapshot(`"en_US"`);
    }));
  });
});
