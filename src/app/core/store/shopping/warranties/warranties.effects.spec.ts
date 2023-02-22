import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Warranty } from 'ish-core/models/warranty/warranty.model';
import { WarrantyService } from 'ish-core/services/warranty/warranty.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadWarranty, loadWarrantyFail, loadWarrantySuccess } from './warranties.actions';
import { WarrantiesEffects } from './warranties.effects';

describe('Warranties Effects', () => {
  let actions$: Observable<Action>;
  let effects: WarrantiesEffects;
  let warrantyServiceMock: WarrantyService;

  beforeEach(() => {
    warrantyServiceMock = mock(WarrantyService);
    when(warrantyServiceMock.getWarranty(anything())).thenReturn(of({ id: 'w123' } as Warranty));

    TestBed.configureTestingModule({
      providers: [
        { provide: WarrantyService, useFactory: () => instance(warrantyServiceMock) },
        provideMockActions(() => actions$),
        WarrantiesEffects,
      ],
    });

    effects = TestBed.inject(WarrantiesEffects);
  });

  describe('loadWarranty$', () => {
    it('should call the warrantyService for loadWarranty', done => {
      const action = loadWarranty({ warrantyId: 'w123' });
      actions$ = of(action);

      effects.loadWarranty$.subscribe(() => {
        verify(warrantyServiceMock.getWarranty('w123')).once();
        done();
      });
    });

    it('should map to action of type LoadWarrantySuccess', () => {
      const action = loadWarranty({ warrantyId: 'w123' });
      actions$ = hot('-a-a-a', { a: action });

      const completion = loadWarrantySuccess({ warranty: { id: 'w123' } as Warranty });

      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadWarranty$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadWarrantyFail', () => {
      when(warrantyServiceMock.getWarranty(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = loadWarranty({ warrantyId: 'w123' });
      const completion = loadWarrantyFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadWarranty$).toBeObservable(expected$);
    });
  });
});
