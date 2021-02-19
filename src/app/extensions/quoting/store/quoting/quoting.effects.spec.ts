import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, noop, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

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
  createQuoteRequestFromQuoteSuccess,
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
  let location: Location;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    quotingService = mock(QuotingService);
    basketService = mock(BasketService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [RouterTestingModule.withRoutes([{ path: 'account/quotes/:id', component: DummyComponent }])],
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
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  describe('redirectToNewQuoteRequest$', () => {
    it('should navigate to created quote request', done => {
      actions$ = of(createQuoteRequestFromQuoteSuccess({ entity: { id: '123' } as QuoteRequest }));

      effects.redirectToNewQuoteRequest$.subscribe(() => {
        expect(location.path()).toMatchInlineSnapshot(`"/account/quotes/123"`);

        done();
      });
    });

    it('should navigate to created quote request 1', done => {
      actions$ = of(createQuoteRequestFromQuoteSuccess({ entity: { id: '123' } as QuoteRequest }));

      effects.redirectToNewQuoteRequest$.pipe(delay(0)).subscribe(() => {
        expect(location.path()).toMatchInlineSnapshot(`"/account/quotes/123"`);

        done();
      });
    });

    it('should navigate to created quote request 2', fakeAsync(() => {
      actions$ = of(createQuoteRequestFromQuoteSuccess({ entity: { id: '123' } as QuoteRequest }));

      effects.redirectToNewQuoteRequest$.subscribe(noop, fail, noop);

      tick(0);

      expect(location.path()).toMatchInlineSnapshot(`"/account/quotes/123"`);
    }));

    it('should navigate to created quote request 3', done => {
      actions$ = of(createQuoteRequestFromQuoteSuccess({ entity: { id: '123' } as QuoteRequest }));

      effects.redirectToNewQuoteRequest$.subscribe(noop, fail, noop);

      setTimeout(() => {
        expect(location.path()).toMatchInlineSnapshot(`"/account/quotes/123"`);

        done();
      }, 0);
    });

    it('should navigate to created quote request 4', done => {
      const routerSpy = spy(router);

      actions$ = of(createQuoteRequestFromQuoteSuccess({ entity: { id: '123' } as QuoteRequest }));

      effects.redirectToNewQuoteRequest$.subscribe(noop, fail, noop);

      verify(routerSpy.navigateByUrl(anything())).once();

      expect(capture(routerSpy.navigateByUrl).last()).toMatchInlineSnapshot(`
        Array [
          "/account/quotes/123",
        ]
      `);

      done();
    });
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
      when(quotingService.addQuoteToBasket(anything())).thenReturn(of(''));
    });

    describe('with basket', () => {
      beforeEach(() => {
        store$.overrideSelector(getCurrentBasketId, 'basketID');
      });

      it('should directly add quote to basket via quoting service', done => {
        actions$ = of(addQuoteToBasket({ id: 'quoteID' }));

        effects.addQuoteToBasket$.subscribe(() => {
          verify(quotingService.addQuoteToBasket('quoteID')).once();
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
          verify(quotingService.addQuoteToBasket('quoteID')).once();
          verify(basketService.createBasket()).once();
          done();
        });
      });
    });
  });

  describe('createQuoteRequestFromQuote$', () => {
    it('should create quote request from quote via quoting service when triggered', done => {
      when(quotingService.createQuoteRequestFromQuote(anything())).thenCall(id =>
        of({ type: 'QuoteRequest', id } as QuoteRequest)
      );
      actions$ = of(createQuoteRequestFromQuote({ id: 'ID' }));

      effects.createQuoteRequestFromQuote$.subscribe(action => {
        verify(quotingService.createQuoteRequestFromQuote(anything())).once();
        expect(action).toMatchInlineSnapshot(`
          [Quoting API] Create Quote Request From Quote Success:
            entity: {"type":"QuoteRequest","id":"ID"}
        `);
        done();
      });
    });
  });

  describe('createQuoteRequestFromQuoteRequest$', () => {
    it('should create quote request from quote request via quoting service when triggered', done => {
      when(quotingService.createQuoteRequestFromQuoteRequest(anything())).thenCall(id =>
        of({ type: 'QuoteRequest', id } as QuoteRequest)
      );
      when(quotingService.getQuoteDetails(anything(), anything(), anything())).thenCall((id, type) =>
        of({ id, type, completenessLevel: 'Detail' } as QuoteStub)
      );
      actions$ = of(createQuoteRequestFromQuoteRequest({ id: 'ID' }));

      effects.createQuoteRequestFromQuoteRequest$.subscribe(action => {
        verify(quotingService.createQuoteRequestFromQuoteRequest(anything())).once();
        expect(action).toMatchInlineSnapshot(`
          [Quoting API] Create Quote Request From Quote Request Success:
            entity: {"type":"QuoteRequest","id":"ID"}
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
