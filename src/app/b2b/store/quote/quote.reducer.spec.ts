import { HttpErrorResponse } from '@angular/common/http';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import * as fromActions from './quote.actions';
import { initialState, quoteReducer } from './quote.reducer';

describe('Quote Reducer', () => {
  describe('SelectQuote', () => {
    it('should select a quote when reduced', () => {
      const action = new fromActions.SelectQuote('test');
      const state = quoteReducer(initialState, action);

      expect(state.selected).toEqual('test');
    });
  });

  describe('LoadQuoteRequests actions', () => {
    describe('LoadQuoteRequests action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadQuoteRequests();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('LoadQuoteRequestsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.LoadQuoteRequestsFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadQuoteRequestsSuccess action', () => {
      it('should set quote requests and set loading to false', () => {
        const quoteRequests = [
          {
            id: 'test',
          } as QuoteRequest,
        ];

        const action = new fromActions.LoadQuoteRequestsSuccess(quoteRequests);
        const state = quoteReducer(initialState, action);

        expect(state.quoteRequests).toEqual(quoteRequests);
        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('LoadQuotes actions', () => {
    describe('LoadQuotes action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadQuotes();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('LoadQuotesFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.LoadQuotesFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadQuotesSuccess action', () => {
      it('should set quotes and set loading to false', () => {
        const quotes = [
          {
            id: 'test',
          } as Quote,
        ];

        const action = new fromActions.LoadQuotesSuccess(quotes);
        const state = quoteReducer(initialState, action);

        expect(state.quotes).toEqual(quotes);
        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('AddQuoteRequest actions', () => {
    describe('AddQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.AddQuoteRequest();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('AddQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.AddQuoteRequestFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('AddQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.AddQuoteRequestSuccess();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('UpdateQuoteRequest actions', () => {
    describe('UpdateQuoteRequest action', () => {
      it('should set loading to true', () => {
        const payload = { id: 'test' } as Quote;
        const action = new fromActions.UpdateQuoteRequest(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('UpdateQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.UpdateQuoteRequestFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.UpdateQuoteRequestSuccess();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('DeleteQuoteRequest actions', () => {
    describe('DeleteQuoteRequest action', () => {
      it('should set loading to true', () => {
        const payload = 'test';
        const action = new fromActions.DeleteQuoteRequest(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('DeleteQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.DeleteQuoteRequestFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.DeleteQuoteRequestSuccess();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('DeleteQuote actions', () => {
    describe('DeleteQuote action', () => {
      it('should set loading to true', () => {
        const payload = 'test';
        const action = new fromActions.DeleteQuote(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('DeleteQuoteFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.DeleteQuoteFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.DeleteQuoteSuccess();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('LoadQuoteRequestItems actions', () => {
    describe('LoadQuoteRequestItems action', () => {
      it('should set loading to true', () => {
        const payload = 'test';
        const action = new fromActions.LoadQuoteRequestItems(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('LoadQuoteRequestItemsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.LoadQuoteRequestItemsFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadQuoteRequestItemsSuccess action', () => {
      it('should set loading to false', () => {
        const quoteRequestItems = [
          {
            id: 'test',
          } as QuoteRequestItem,
        ];

        const action = new fromActions.LoadQuoteRequestItemsSuccess(quoteRequestItems);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.quoteRequestItems).toEqual(quoteRequestItems);
      });
    });
  });

  describe('AddProductToQuoteRequest actions', () => {
    describe('AddProductToQuoteRequest action', () => {
      it('should set loading to true', () => {
        const payload = {
          quoteRequestId: 'test',
          sku: 'test',
          quantity: 1,
        };
        const action = new fromActions.AddProductToQuoteRequest(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('AddProductToQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.AddProductToQuoteRequestFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('AddProductToQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.AddProductToQuoteRequestSuccess();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('UpdateQuoteRequestItems actions', () => {
    describe('UpdateQuoteRequestItems action', () => {
      it('should set loading to true', () => {
        const payload = {
          quoteRequestId: 'test',
          items: [{ itemId: 'test', quantity: 1 }],
        };
        const action = new fromActions.UpdateQuoteRequestItems(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('UpdateQuoteRequestItemsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.UpdateQuoteRequestItemsFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateQuoteRequestItemsSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.UpdateQuoteRequestItemsSuccess();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('DeleteItemFromQuoteRequest actions', () => {
    describe('DeleteItemFromQuoteRequest action', () => {
      it('should set loading to true', () => {
        const payload = {
          quoteRequestId: 'test',
          itemId: 'test',
        };
        const action = new fromActions.DeleteItemFromQuoteRequest(payload);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('DeleteItemFromQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.DeleteItemFromQuoteRequestFail(error);
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteItemFromQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.DeleteItemFromQuoteRequestSuccess();
        const state = quoteReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });
});
