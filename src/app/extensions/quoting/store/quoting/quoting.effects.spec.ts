import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { getCurrentBasketId } from 'ish-core/store/customer/basket';

import { QuoteStub } from '../../models/quoting/quoting.model';
import { QuotingService } from '../../services/quoting/quoting.service';

import {
  addQuoteToBasket,
  createQuoteRequestFromQuote,
  deleteQuotingEntity,
  loadQuoting,
  loadQuotingDetail,
  rejectQuote,
  submitQuoteRequest,
} from './quoting.actions';
import { QuotingEffects } from './quoting.effects';

describe('Quoting Effects', () => {
  let actions$: Observable<Action>;
  let store$: MockStore;
  let effects: QuotingEffects;
  let quotingService: QuotingService;
  let basketService: BasketService;

  beforeEach(() => {
    quotingService = mock(QuotingService);
    basketService = mock(BasketService);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        QuotingEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: QuotingService, useFactory: () => instance(quotingService) },
        { provide: BasketService, useFactory: () => instance(basketService) },
      ],
    });

    effects = TestBed.inject(QuotingEffects);
    store$ = TestBed.inject(MockStore);
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

  describe('rejectQuote$', () => {
    it('should reject quote via quoting service when triggered', done => {
      when(quotingService.rejectQuote(anything())).thenCall(({ id }) => of(id));
      actions$ = of(rejectQuote({ quoteId: 'ID' }));

      effects.rejectQuote$.subscribe(() => {
        verify(quotingService.rejectQuote(anything())).once();
        done();
      });
    });
  });

  describe('addQuoteToBasket$', () => {
    beforeEach(() => {
      when(quotingService.addQuoteToBasket(anything(), anything())).thenReturn(of(''));
    });

    describe('with basket', () => {
      beforeEach(() => {
        store$.overrideSelector(getCurrentBasketId, 'basketID');
      });

      it('should directly add quote to basket via quoting service', done => {
        actions$ = of(addQuoteToBasket({ quoteId: 'quoteID' }));

        effects.addQuoteToBasket$.subscribe(() => {
          verify(quotingService.addQuoteToBasket('quoteID', 'basketID')).once();
          verify(basketService.createBasket()).never();
          done();
        });
      });
    });

    describe('without basket', () => {
      beforeEach(() => {
        store$.overrideSelector(getCurrentBasketId, undefined);
        when(basketService.createBasket()).thenReturn(of({ id: 'basketID' } as Basket));
      });

      it('should create basket and add quote to basket via quoting service', done => {
        actions$ = of(addQuoteToBasket({ quoteId: 'quoteID' }));

        effects.addQuoteToBasket$.subscribe(() => {
          verify(quotingService.addQuoteToBasket('quoteID', 'basketID')).once();
          verify(basketService.createBasket()).once();
          done();
        });
      });
    });
  });

  describe('createQuoteRequestFromQuote$', () => {
    it('should create quote request from quote via quoting service when triggered', done => {
      when(quotingService.createQuoteRequestFromQuote(anything())).thenCall(({ id }) => of(id));
      actions$ = of(createQuoteRequestFromQuote({ quoteId: 'ID' }));

      effects.createQuoteRequestFromQuote$.subscribe(() => {
        verify(quotingService.createQuoteRequestFromQuote(anything())).once();
        done();
      });
    });
  });

  describe('submitQuoteRequest$', () => {
    beforeEach(() => {
      // tslint:disable-next-line: no-unnecessary-callback-wrapper
      when(quotingService.submitQuoteRequest(anything())).thenCall(id => of(id));
      when(quotingService.getQuoteDetails(anything(), anything())).thenCall(quote =>
        of({ ...quote, completenessLevel: 'Detail' } as QuoteStub)
      );
    });

    it('should submit quote request via quoting service when triggered', done => {
      actions$ = of(submitQuoteRequest({ quoteRequestId: 'ID' }));

      effects.submitQuoteRequest$.subscribe(() => {
        verify(quotingService.submitQuoteRequest(anything())).once();
        done();
      });
    });

    it('should reset quote request to stub when triggered successfully', done => {
      actions$ = of(submitQuoteRequest({ quoteRequestId: 'ID' }));

      effects.submitQuoteRequest$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Quoting] Submit Quote Request Success:
            quote: {"id":"ID","completenessLevel":"Detail","type":"QuoteRequest"}
        `);
        done();
      });
    });
  });
});
