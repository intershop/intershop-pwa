import { HttpErrorResponse } from '@angular/common/http';
import { QuoteLineItemResultModel } from '../../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../../models/quote-request/quote-request.interface';
import * as fromActions from './quote-request.actions';
import { initialState, quoteRequestReducer } from './quote-request.reducer';

describe('Quote Request Reducer', () => {
  describe('SelectQuoteRequest', () => {
    it('should select a quote request when reduced', () => {
      const action = new fromActions.SelectQuoteRequest('test');
      const state = quoteRequestReducer(initialState, action);

      expect(state.selected).toEqual('test');
    });
  });

  describe('LoadQuoteRequests actions', () => {
    describe('LoadQuoteRequests action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadQuoteRequests();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('LoadQuoteRequestsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.LoadQuoteRequestsFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadQuoteRequestsSuccess action', () => {
      it('should set quote requests and set loading to false', () => {
        const quoteRequests = [
          {
            id: 'test',
          } as QuoteRequestData,
        ];

        const action = new fromActions.LoadQuoteRequestsSuccess(quoteRequests);
        const state = quoteRequestReducer(initialState, action);

        expect(state.quoteRequests).toEqual(quoteRequests);
        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('AddQuoteRequest actions', () => {
    describe('AddQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.AddQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('AddQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.AddQuoteRequestFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('AddQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.AddQuoteRequestSuccess('test');
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('UpdateQuoteRequest actions', () => {
    describe('UpdateQuoteRequest action', () => {
      it('should set loading to true', () => {
        const payload = { displayName: 'test' };
        const action = new fromActions.UpdateQuoteRequest(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('UpdateQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.UpdateQuoteRequestFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const payload = { id: 'test' } as QuoteRequestData;
        const action = new fromActions.UpdateQuoteRequestSuccess(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('DeleteQuoteRequest actions', () => {
    describe('DeleteQuoteRequest action', () => {
      it('should set loading to true', () => {
        const payload = 'test';
        const action = new fromActions.DeleteQuoteRequest(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('DeleteQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.DeleteQuoteRequestFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const payload = 'test';
        const action = new fromActions.DeleteQuoteRequestSuccess(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('SubmitQuoteRequest actions', () => {
    describe('SubmitQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.SubmitQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('SubmitQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.SubmitQuoteRequestFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('SubmitQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const payload = 'test';
        const action = new fromActions.SubmitQuoteRequestSuccess(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('CreateQuoteRequestFromQuote actions', () => {
    describe('CreateQuoteRequestFromQuote action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.CreateQuoteRequestFromQuote();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('CreateQuoteRequestFromQuoteFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.CreateQuoteRequestFromQuoteFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateQuoteRequestFromQuoteSuccess action', () => {
      it('should set loading to false', () => {
        const payload = {} as QuoteLineItemResultModel;
        const action = new fromActions.CreateQuoteRequestFromQuoteSuccess(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('LoadQuoteRequestItems actions', () => {
    describe('LoadQuoteRequestItems action', () => {
      it('should set loading to true', () => {
        const payload = 'test';
        const action = new fromActions.LoadQuoteRequestItems(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('LoadQuoteRequestItemsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.LoadQuoteRequestItemsFail(error);
        const state = quoteRequestReducer(initialState, action);

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
        const state = quoteRequestReducer(initialState, action);

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
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('AddProductToQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.AddProductToQuoteRequestFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('AddProductToQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const payload = 'test';
        const action = new fromActions.AddProductToQuoteRequestSuccess(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('AddBasketToQuoteRequest actions', () => {
    describe('AddBasketToQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.AddBasketToQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('AddBasketToQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.AddBasketToQuoteRequestFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('AddBasketToQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.AddBasketToQuoteRequestSuccess('QRID');
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('UpdateQuoteRequestItems actions', () => {
    describe('UpdateQuoteRequestItems action', () => {
      it('should set loading to true', () => {
        const payload = [{ itemId: 'test', quantity: 1 }];
        const action = new fromActions.UpdateQuoteRequestItems(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('UpdateQuoteRequestItemsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.UpdateQuoteRequestItemsFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateQuoteRequestItemsSuccess action', () => {
      it('should set loading to false', () => {
        const payload = ['test'];
        const action = new fromActions.UpdateQuoteRequestItemsSuccess(payload);
        const state = quoteRequestReducer(initialState, action);

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
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(true);
      });
    });

    describe('DeleteItemFromQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpErrorResponse;
        const action = new fromActions.DeleteItemFromQuoteRequestFail(error);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteItemFromQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const payload = 'test';
        const action = new fromActions.DeleteItemFromQuoteRequestSuccess(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });
  });
});
