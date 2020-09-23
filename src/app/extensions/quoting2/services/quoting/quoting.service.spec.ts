import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

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
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
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
      quotingService.getQuoteDetails({ type: 'Quote', id: '123', completenessLevel: 'Stub' }, 'Stub').subscribe(
        () => {
          verify(apiService.get(anything())).never();
        },
        fail,
        done
      );
    });

    it('should call quote API when List level is requested for quote', done => {
      when(apiService.get(anything())).thenReturn(of({ type: 'Quote', items: [] } as QuoteData));

      quotingService.getQuoteDetails({ type: 'Quote', id: '123', completenessLevel: 'Stub' }, 'List').subscribe(
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

      quotingService.getQuoteDetails({ type: 'QuoteRequest', id: '123', completenessLevel: 'Stub' }, 'List').subscribe(
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

      quotingService
        .getQuoteDetails({ type: 'QuoteRequest', id: '123', completenessLevel: 'Stub' }, 'Detail')
        .subscribe(
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
          const args = capture(apiService.put).last();
          expect(args?.[0]).toMatchInlineSnapshot(`"quotes/ID"`);
          expect(args?.[1]).toMatchInlineSnapshot(`
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
      when(apiService.post(anything(), anything())).thenReturn(of({}));
    });

    it('should use basket API for adding quotes to basket', done => {
      quotingService.addQuoteToBasket('quoteID', 'basketID').subscribe(
        () => {
          verify(apiService.post(anything(), anything())).once();
          const args = capture(apiService.post).last();
          expect(args?.[0]).toMatchInlineSnapshot(`"baskets/basketID/items"`);
          expect(args?.[1]).toMatchInlineSnapshot(`
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
      when(apiService.post(anything(), anything())).thenReturn(of({ type: 'QuoteRequest' }));
    });

    it('should use quote request API for creating quote from quote request', done => {
      quotingService.createQuoteRequestFromQuote('quoteID').subscribe(
        () => {
          verify(apiService.post(anything(), anything())).once();
          const args = capture(apiService.post).last();
          expect(args?.[0]).toMatchInlineSnapshot(`"quoterequests"`);
          expect(args?.[1]).toMatchInlineSnapshot(`
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
});
