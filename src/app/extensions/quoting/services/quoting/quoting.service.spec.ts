import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { getBasketIdOrCurrent } from 'ish-core/store/customer/basket';

import { QuoteData } from '../../models/quoting/quoting.interface';
import { QuoteStub } from '../../models/quoting/quoting.model';

import { QuotingService } from './quoting.service';

describe('Quoting Service', () => {
  let apiService: ApiService;
  let quotingService: QuotingService;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.b2bUserEndpoint()).thenReturn(instance(apiService));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        provideMockStore({
          selectors: [{ selector: getBasketIdOrCurrent, value: 'current' }],
        }),
      ],
    });
    quotingService = TestBed.inject(QuotingService);
  });

  it('should be created', () => {
    expect(quotingService).toBeTruthy();
  });

  describe('getQuotes', () => {
    it('should retrieve quote and quote request stubs when called', done => {
      when(apiService.get(anything(), anything())).thenReturn(of({}));

      quotingService.getQuotes().subscribe(
        () => {
          verify(apiService.get(anything(), anything())).twice();

          expect(capture(apiService.get).beforeLast()?.[0]).toMatchInlineSnapshot(`"quoterequests"`);
          expect(capture(apiService.get).last()?.[0]).toMatchInlineSnapshot(`"quotes"`);
        },
        fail,
        done
      );
    });
  });

  describe('getQuoteDetails', () => {
    it('should not call anything when Stub level is requested', done => {
      quotingService.getQuoteDetails('123', 'Quote', 'Stub').subscribe(
        () => {
          verify(apiService.get(anything())).never();
        },
        fail,
        done
      );
    });

    it('should call quote API when List level is requested for quote', done => {
      when(apiService.get(anything())).thenReturn(of({ type: 'Quote', items: [] } as QuoteData));

      quotingService.getQuoteDetails('123', 'Quote', 'List').subscribe(
        () => {
          verify(apiService.get(anything())).once();
          expect(capture(apiService.get).last()?.[0]).toMatchInlineSnapshot(`"quotes/123"`);
        },
        fail,
        done
      );
    });

    it('should call quote request API when List level is requested for quote request', done => {
      when(apiService.get(anything())).thenReturn(of({ type: 'QuoteRequest', items: [] } as QuoteData));

      quotingService.getQuoteDetails('123', 'QuoteRequest', 'List').subscribe(
        () => {
          verify(apiService.get(anything())).once();
          expect(capture(apiService.get).last()?.[0]).toMatchInlineSnapshot(`"quoterequests/123"`);
        },
        fail,
        done
      );
    });

    it('should call quote request and items API when Detail level is requested for quote request', done => {
      when(apiService.get(anything())).thenReturn(of({ type: 'QuoteRequest', items: [] } as QuoteData));
      when(apiService.resolveLinks()).thenReturn(() => of([]));

      quotingService.getQuoteDetails('123', 'QuoteRequest', 'Detail').subscribe(
        () => {
          verify(apiService.get(anything())).once();
          expect(capture(apiService.get).last()?.[0]).toMatchInlineSnapshot(`"quoterequests/123"`);
        },
        fail,
        done
      );
    });
  });

  describe('deleteQuote', () => {
    beforeEach(() => {
      when(apiService.delete(anything())).thenReturn(of({ id: 'ID' } as QuoteData));
    });

    it('should use quote API for deleting quotes', done => {
      quotingService.deleteQuote({ type: 'Quote', id: 'ID' } as QuoteStub).subscribe(
        () => {
          verify(apiService.delete(anything())).once();
          expect(capture(apiService.delete).last()?.[0]).toMatchInlineSnapshot(`"quotes/ID"`);
        },
        fail,
        done
      );
    });

    it('should use quote request API for deleting quote requests', done => {
      quotingService.deleteQuote({ type: 'QuoteRequest', id: 'ID' } as QuoteStub).subscribe(
        () => {
          verify(apiService.delete(anything())).once();
          expect(capture(apiService.delete).last()?.[0]).toMatchInlineSnapshot(`"quoterequests/ID"`);
        },
        fail,
        done
      );
    });
  });

  describe('rejectQuote', () => {
    beforeEach(() => {
      when(apiService.put(anything(), anything())).thenReturn(of({ id: 'ID', type: 'Quote' } as QuoteData));
    });

    it('should use quote API for rejecting quotes', done => {
      quotingService.rejectQuote('ID').subscribe(
        () => {
          verify(apiService.put(anything(), anything())).once();
          const [path, body] = capture(apiService.put).last();
          expect(path).toMatchInlineSnapshot(`"quotes/ID"`);
          expect(body).toMatchInlineSnapshot(`
            Object {
              "rejected": true,
            }
          `);
        },
        fail,
        done
      );
    });
  });

  describe('addQuoteToBasket', () => {
    beforeEach(() => {
      when(apiService.post(anything(), anything(), anything())).thenReturn(of({}));
    });

    it('should use basket API for adding quotes to basket', done => {
      quotingService.addQuoteToBasket('quoteID').subscribe(
        () => {
          verify(apiService.post(anything(), anything(), anything())).once();
          const [path, body] = capture(apiService.post).last();
          expect(path).toMatchInlineSnapshot(`"baskets/current/items"`);
          expect(body).toMatchInlineSnapshot(`
            Object {
              "quoteID": "quoteID",
            }
          `);
        },
        fail,
        done
      );
    });
  });

  describe('createQuoteRequestFromQuote', () => {
    beforeEach(() => {
      when(apiService.post(anything(), anything(), anything())).thenReturn(of({ type: 'QuoteRequest' }));
    });

    it('should use quote request API for creating quoterequest from quote', done => {
      quotingService.createQuoteRequestFromQuote('quoteID').subscribe(
        () => {
          verify(apiService.post(anything(), anything(), anything())).once();
          const [path, body, options] = capture<string, object, AvailableOptions>(apiService.post).last();
          expect(path).toMatchInlineSnapshot(`"quoterequests"`);
          expect(body).toMatchInlineSnapshot(`undefined`);
          expect(options?.params?.toString()).toMatchInlineSnapshot(`"quoteID=quoteID"`);
        },
        fail,
        done
      );
    });
  });

  describe('createQuoteRequestFromQuoteRequest', () => {
    beforeEach(() => {
      when(apiService.post(anything(), anything(), anything())).thenReturn(of({ type: 'QuoteRequest' }));
    });

    it('should use quote request API for creating quote request from quote request', done => {
      quotingService.createQuoteRequestFromQuoteRequest('quoteRequestID').subscribe(
        () => {
          verify(apiService.post(anything(), anything(), anything())).once();
          const [path, body, options] = capture<string, object, AvailableOptions>(apiService.post).last();
          expect(path).toMatchInlineSnapshot(`"quoterequests"`);
          expect(body).toMatchInlineSnapshot(`undefined`);
          expect(options?.params?.toString()).toMatchInlineSnapshot(`"quoteRequestID=quoteRequestID"`);
        },
        fail,
        done
      );
    });
  });

  describe('submitQuoteRequest', () => {
    beforeEach(() => {
      when(apiService.post(anything(), anything())).thenReturn(of({}));
    });

    it('should use quote API for submitting quote requests', done => {
      quotingService.submitQuoteRequest('quoteRequestID').subscribe(
        () => {
          verify(apiService.post(anything(), anything())).once();
          const [path, body] = capture(apiService.post).last();
          expect(path).toMatchInlineSnapshot(`"quotes"`);
          expect(body).toMatchInlineSnapshot(`
            Object {
              "quoteRequestID": "quoteRequestID",
            }
          `);
        },
        fail,
        done
      );
    });
  });

  describe('updateQuoteRequest', () => {
    beforeEach(() => {
      when(apiService.put(anything(), anything())).thenReturn(of({}));
      when(apiService.delete(anything())).thenReturn(of({}));
    });

    it('should use the quoterequest API for updating quote requests', done => {
      quotingService
        .updateQuoteRequest('quoteRequestID', [
          { type: 'meta-data', description: 'DESC', displayName: 'DISPLAY' },
          { type: 'remove-item', itemId: 'item2' },
          { type: 'change-item', itemId: 'item1', quantity: 2 },
          { type: 'change-item', itemId: 'item3', quantity: 1 },
        ])
        .subscribe(
          id => {
            expect(id).toMatchInlineSnapshot(`"quoteRequestID"`);

            verify(apiService.put(anything(), anything())).thrice();
            expect(capture(apiService.put).byCallIndex(0)).toMatchInlineSnapshot(`
              Array [
                "quoterequests/quoteRequestID",
                Object {
                  "description": "DESC",
                  "displayName": "DISPLAY",
                },
              ]
            `);
            expect(capture(apiService.put).byCallIndex(1)).toMatchInlineSnapshot(`
              Array [
                "quoterequests/quoteRequestID/items/item1",
                Object {
                  "quantity": Object {
                    "value": 2,
                  },
                },
              ]
            `);
            expect(capture(apiService.put).byCallIndex(2)).toMatchInlineSnapshot(`
              Array [
                "quoterequests/quoteRequestID/items/item3",
                Object {
                  "quantity": Object {
                    "value": 1,
                  },
                },
              ]
            `);

            verify(apiService.delete(anything())).once();
            expect(capture(apiService.delete).byCallIndex(0)).toMatchInlineSnapshot(`
              Array [
                "quoterequests/quoteRequestID/items/item2",
              ]
            `);
          },
          fail,
          done
        );
    });
  });
});
