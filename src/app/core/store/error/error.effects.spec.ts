import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { anything, capture, instance, mock, verify } from 'ts-mockito/lib/ts-mockito';
import { CoreState } from '../core.state';
import { reducers } from '../core.system';
import { CommunicationTimeoutError } from './error.actions';
import { ErrorEffects } from './error.effects';

describe('ErrorEffects', () => {
  let effects: ErrorEffects;
  let routerMock: Router;
  let store$: Store<CoreState>;

  beforeEach(() => {
    routerMock = mock(Router);
    store$ = mock(Store);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
      ],
      providers: [
        ErrorEffects,
        Store,
        { provide: Router, useFactory: () => instance(routerMock) }
      ],
    });

    store$ = TestBed.get(Store);
    effects = TestBed.get(ErrorEffects);
  });

  describe('gotoErrorPageInCaseOfError$', () => {
    it('should call Router Navigation when Error is handled', () => {
      store$.dispatch(new CommunicationTimeoutError({} as HttpErrorResponse));

      effects.gotoErrorPageInCaseOfError$.subscribe(() => {
        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/error']);
      });
    });
  });
});
