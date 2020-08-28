import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';

import { QuoteData } from '../../models/quoting/quoting.interface';
import { QuoteStub } from '../../models/quoting/quoting.model';

import { QuotingService } from './quoting.service';

describe('Quoting Service', () => {
  let apiService: ApiService;
  let quotingService: QuotingService;

  beforeEach(() => {
    apiService = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInUser, value: { login: 'user@company' } as User },
            { selector: getLoggedInCustomer, value: { customerNo: 'company' } as Customer },
          ],
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
      when(apiService.get(anything())).thenReturn(of({}));

      quotingService.getQuotes().subscribe(
        () => {
          verify(apiService.get(anything())).twice();

          expect(capture(apiService.get).beforeLast()).toMatchInlineSnapshot(`
            Array [
              "customers/company/users/user@company/quoterequests",
            ]
          `);
          expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
            Array [
              "customers/company/users/user@company/quotes",
            ]
          `);
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
          expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
            Array [
              "customers/company/users/user@company/quotes/123",
            ]
          `);
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
          expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
            Array [
              "customers/company/users/user@company/quoterequests/123",
            ]
          `);
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
            expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
              Array [
                "customers/company/users/user@company/quoterequests/123",
              ]
            `);
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
          expect(capture(apiService.delete).last()).toMatchInlineSnapshot(`
            Array [
              "customers/company/users/user@company/quotes/ID",
            ]
          `);
        },
        fail,
        done
      );
    });

    it('should use quote request API for deleting quote requests', done => {
      quotingService.deleteQuote({ type: 'QuoteRequest', id: 'ID' } as QuoteStub).subscribe(
        () => {
          verify(apiService.delete(anything())).once();
          expect(capture(apiService.delete).last()).toMatchInlineSnapshot(`
            Array [
              "customers/company/users/user@company/quoterequests/ID",
            ]
          `);
        },
        fail,
        done
      );
    });
  });
});
