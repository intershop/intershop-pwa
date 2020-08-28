import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { QuoteStub } from '../../models/quoting/quoting.model';
import { QuotingService } from '../../services/quoting/quoting.service';

import { deleteQuotingEntity, loadQuoting, loadQuotingDetail } from './quoting.actions';
import { QuotingEffects } from './quoting.effects';

describe('Quoting Effects', () => {
  let actions$: Observable<Action>;
  let effects: QuotingEffects;
  let quotingService: QuotingService;

  beforeEach(() => {
    quotingService = mock(QuotingService);

    TestBed.configureTestingModule({
      providers: [
        QuotingEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: QuotingService, useFactory: () => instance(quotingService) },
      ],
    });

    effects = TestBed.inject(QuotingEffects);
  });

  describe('loadQuoting$', () => {
    it('should load quotes via quoting service when triggered', done => {
      when(quotingService.getQuotes()).thenReturn(of([]));
      actions$ = of(loadQuoting());

      effects.loadQuoting$.subscribe(() => {
        verify(quotingService.getQuotes()).once();
        done();
      });
    });
  });

  describe('loadQuotingDetail$', () => {
    it('should load quote details via quoting service when triggered', done => {
      const entity = { type: 'Quote', completenessLevel: 'Detail', id: 'q1' } as QuoteStub;
      when(quotingService.getQuoteDetails(anything(), 'Detail')).thenReturn(of(entity));
      actions$ = of(loadQuotingDetail({ entity, level: 'Detail' }));

      effects.loadQuotingDetail$.subscribe(() => {
        verify(quotingService.getQuoteDetails(anything(), 'Detail')).once();
        done();
      });
    });
  });

  describe('deleteQuoting$', () => {
    it('should delete quote via quoting service when triggered', done => {
      when(quotingService.deleteQuote(anything())).thenCall(({ id }) => of(id));
      actions$ = of(deleteQuotingEntity({ entity: { id: 'ID' } as QuoteStub }));

      effects.deleteQuoting$.subscribe(() => {
        verify(quotingService.deleteQuote(anything())).once();
        done();
      });
    });
  });
});
