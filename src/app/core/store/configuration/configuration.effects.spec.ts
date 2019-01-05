import { TestBed } from '@angular/core/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { coreReducers } from '../core-store.module';

import { ConfigurationActionTypes } from './configuration.actions';
import { ConfigurationEffects } from './configuration.effects';

describe('Configuration Effects', () => {
  let actions$: Observable<Action>;
  let effects: ConfigurationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...coreReducers,
        }),
      ],
      providers: [ConfigurationEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(ConfigurationEffects);
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
});
