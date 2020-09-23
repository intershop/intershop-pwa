import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { getCurrentBasketId } from 'ish-core/store/customer/basket';

import { QuoteRequest, QuoteStub } from '../../models/quoting/quoting.model';
import { QuotingService } from '../../services/quoting/quoting.service';

import {
  addProductToQuoteRequest,
  addQuoteToBasket,
  createQuoteRequestFromBasket,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteRequest,
  deleteQuotingEntity,
  loadQuoting,
  loadQuotingDetail,
  rejectQuote,
  submitQuoteRequest,
  updateQuoteRequest,
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
      when(quotingService.getQuoteDetails(anything(), 'Quote', 'Detail')).thenReturn(of(entity));
      actions$ = of(loadQuotingDetail({ entity, level: 'Detail' }));

      effects.loadQuotingDetail$.subscribe(() => {
        verify(quotingService.getQuoteDetails('q1', 'Quote', 'Detail')).once();
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
      actions$ = of(rejectQuote({ id: 'ID' }));

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
        actions$ = of(addQuoteToBasket({ id: 'quoteID' }));

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
        actions$ = of(addQuoteToBasket({ id: 'quoteID' }));

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
      actions$ = of(createQuoteRequestFromQuote({ id: 'ID' }));

      effects.createQuoteRequestFromQuote$.subscribe(action => {
        verify(quotingService.createQuoteRequestFromQuote(anything())).once();
        expect(action).toMatchInlineSnapshot(`
          [Quoting API] Create Quote Request From Quote Success:
            entity: undefined
        `);
        done();
      });
    });
  });

  describe('createQuoteRequestFromQuoteRequest$', () => {
    it('should create quote request from quote request via quoting service when triggered', done => {
      when(quotingService.createQuoteRequestFromQuoteRequest(anything())).thenReturn(of('NEW'));
      when(quotingService.getQuoteDetails(anything(), anything(), anything())).thenCall((id, type) =>
        of({ id, type, completenessLevel: 'Detail' } as QuoteStub)
      );
      actions$ = of(createQuoteRequestFromQuoteRequest({ entity: { id: 'ID' } as QuoteRequest }));

      effects.createQuoteRequestFromQuoteRequest$.subscribe(action => {
        verify(quotingService.createQuoteRequestFromQuoteRequest(anything())).once();
        expect(action).toMatchInlineSnapshot(`
          [Quoting API] Create Quote Request From Quote Request Success:
            entity: {"id":"NEW","type":"QuoteRequest","completenessLevel":"Detai...
        `);
        done();
      });
    });
  });

  describe('createQuoteRequestFromBasket$', () => {
    it('should create quote request from basket via quoting service when triggered', done => {
      when(quotingService.createQuoteRequestFromBasket(anything())).thenReturn(of({ id: 'NEW' } as QuoteRequest));
      store$.overrideSelector(getCurrentBasketId, 'BasketID');

      actions$ = of(createQuoteRequestFromBasket());

      effects.createQuoteRequestFromBasket$.subscribe(action => {
        verify(quotingService.createQuoteRequestFromBasket(anything())).once();
        expect(capture(quotingService.createQuoteRequestFromBasket).last()?.[0]).toMatchInlineSnapshot(`"BasketID"`);
        expect(action).toMatchInlineSnapshot(`
          [Quoting API] Create Quote Request From Basket Success:
            entity: {"id":"NEW"}
        `);
        done();
      });
    });
  });

  describe('submitQuoteRequest$', () => {
    beforeEach(() => {
      // tslint:disable-next-line: no-unnecessary-callback-wrapper
      when(quotingService.submitQuoteRequest(anything())).thenCall(id => of(id));
      when(quotingService.getQuoteDetails(anything(), anything(), anything())).thenCall((id, type) =>
        of({ id, type, completenessLevel: 'Detail' } as QuoteStub)
      );
    });

    it('should submit quote request via quoting service when triggered', done => {
      actions$ = of(submitQuoteRequest({ id: 'ID' }));

      effects.submitQuoteRequest$.subscribe(() => {
        verify(quotingService.submitQuoteRequest(anything())).once();
        done();
      });
    });

    it('should load quote request details when triggered successfully', done => {
      actions$ = of(submitQuoteRequest({ id: 'ID' }));

      effects.submitQuoteRequest$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Quoting API] Submit Quote Request Success:
            entity: {"id":"ID","type":"QuoteRequest","completenessLevel":"Detail"}
        `);
        done();
      });
    });
  });

  describe('addProductToQuoteRequest$', () => {
    beforeEach(() => {
      when(quotingService.addProductToQuoteRequest(anything(), anything())).thenReturn(of('quoteRequestID'));
      when(quotingService.getQuoteDetails(anything(), anything(), anything())).thenCall((id, type) =>
        of({ id, type, completenessLevel: 'Detail' } as QuoteStub)
      );
    });

    it('should add product to quote request via quoting service when triggered', done => {
      actions$ = of(addProductToQuoteRequest({ sku: 'SKU', quantity: 10 }));

      effects.addProductToQuoteRequest$.subscribe(() => {
        verify(quotingService.addProductToQuoteRequest(anything(), anything())).once();
        expect(capture(quotingService.addProductToQuoteRequest).last()).toMatchInlineSnapshot(`
          Array [
            "SKU",
            10,
          ]
        `);
        done();
      });
    });

    it('should load quote request details when triggered successfully', done => {
      actions$ = of(addProductToQuoteRequest({ sku: 'SKU', quantity: 10 }));

      effects.addProductToQuoteRequest$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Quoting API] Add Product To Quote Request Success:
            entity: {"id":"quoteRequestID","type":"QuoteRequest","completenessLe...
        `);
        done();
      });
    });
  });

  describe('updateQuoteRequest$', () => {
    beforeEach(() => {
      // tslint:disable-next-line: no-unnecessary-callback-wrapper
      when(quotingService.updateQuoteRequest(anything(), anything())).thenCall(id => of(id));
      when(quotingService.getQuoteDetails(anything(), anything(), anything())).thenCall((id, type) =>
        of({ id, type, completenessLevel: 'Detail' } as QuoteStub)
      );
    });

    it('should add product to quote request via quoting service when triggered', done => {
      actions$ = of(updateQuoteRequest({ id: 'quoteRequestID', changes: [{ type: 'remove-item', itemId: 'ITEM' }] }));

      effects.updateQuoteRequest$.subscribe(() => {
        verify(quotingService.updateQuoteRequest(anything(), anything())).once();
        expect(capture(quotingService.updateQuoteRequest).last()).toMatchInlineSnapshot(`
          Array [
            "quoteRequestID",
            Array [
              Object {
                "itemId": "ITEM",
                "type": "remove-item",
              },
            ],
          ]
        `);
        done();
      });
    });

    it('should load quote request details when triggered successfully', done => {
      actions$ = of(updateQuoteRequest({ id: 'quoteRequestID', changes: [{ type: 'remove-item', itemId: 'ITEM' }] }));

      effects.updateQuoteRequest$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Quoting API] Update Quote Request Success:
            entity: {"id":"quoteRequestID","type":"QuoteRequest","completenessLe...
        `);
        done();
      });
    });
  });
});
