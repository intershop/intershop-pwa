import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';

import * as fromActions from './quote-request.actions';
import { initialState, quoteRequestReducer } from './quote-request.reducer';

describe('Quote Request Reducer', () => {
  describe('SelectQuoteRequest', () => {
    it('should select a quote request when reduced', () => {
      const action = new fromActions.SelectQuoteRequest({ id: 'test' });
      const state = quoteRequestReducer(initialState, action);

      expect(state.selected).toEqual('test');
    });
  });

  describe('LoadQuoteRequests actions', () => {
    describe('LoadQuoteRequests action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadQuoteRequests();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadQuoteRequestsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.LoadQuoteRequestsFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
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

        const action = new fromActions.LoadQuoteRequestsSuccess({ quoteRequests });
        const state = quoteRequestReducer(initialState, action);

        expect(state.ids).toEqual(['test']);
        expect(state.entities).toEqual({ test: quoteRequests[0] });
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('AddQuoteRequest actions', () => {
    describe('AddQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.AddQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('AddQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.AddQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.AddQuoteRequestSuccess({ id: 'test' });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('UpdateQuoteRequest actions', () => {
    describe('UpdateQuoteRequest action', () => {
      it('should set loading to true', () => {
        const displayName = 'test';
        const action = new fromActions.UpdateQuoteRequest({ displayName });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.UpdateQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const quoteRequest = { id: 'test' } as QuoteRequestData;
        const action = new fromActions.UpdateQuoteRequestSuccess({ quoteRequest });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('DeleteQuoteRequest actions', () => {
    describe('DeleteQuoteRequest action', () => {
      it('should set loading to true', () => {
        const id = 'test';
        const action = new fromActions.DeleteQuoteRequest({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.DeleteQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = new fromActions.DeleteQuoteRequestSuccess({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('SubmitQuoteRequest actions', () => {
    describe('SubmitQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.SubmitQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('SubmitQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.SubmitQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('SubmitQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = new fromActions.SubmitQuoteRequestSuccess({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('CreateQuoteRequestFromQuoteRequest actions', () => {
    describe('CreateQuoteRequestFromQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.CreateQuoteRequestFromQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateQuoteRequestFromQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.CreateQuoteRequestFromQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateQuoteRequestFromQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const quoteLineItemResult = {} as QuoteLineItemResult;
        const action = new fromActions.CreateQuoteRequestFromQuoteRequestSuccess({ quoteLineItemResult });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('LoadQuoteRequestItems actions', () => {
    describe('LoadQuoteRequestItems action', () => {
      it('should set loading to true', () => {
        const id = 'test';
        const action = new fromActions.LoadQuoteRequestItems({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadQuoteRequestItemsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.LoadQuoteRequestItemsFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadQuoteRequestItemsSuccess action', () => {
      it('should set loading to false', () => {
        const quoteRequestItems = {
          quoteRequestItems: [
            {
              id: 'test',
            } as QuoteRequestItem,
          ],
        };

        const action = new fromActions.LoadQuoteRequestItemsSuccess(quoteRequestItems);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.quoteRequestItems).toEqual(quoteRequestItems.quoteRequestItems);
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

        expect(state.loading).toBeTrue();
      });
    });

    describe('AddProductToQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.AddProductToQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddProductToQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = new fromActions.AddProductToQuoteRequestSuccess({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('AddBasketToQuoteRequest actions', () => {
    describe('AddBasketToQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.AddBasketToQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('AddBasketToQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.AddBasketToQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddBasketToQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.AddBasketToQuoteRequestSuccess({ id: 'QRID' });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('UpdateQuoteRequestItems actions', () => {
    describe('UpdateQuoteRequestItems action', () => {
      it('should set loading to true', () => {
        const lineItemUpdates = [{ itemId: 'test', quantity: 1 }];
        const action = new fromActions.UpdateQuoteRequestItems({ lineItemUpdates });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateQuoteRequestItemsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.UpdateQuoteRequestItemsFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateQuoteRequestItemsSuccess action', () => {
      it('should set loading to false', () => {
        const itemIds = ['test'];
        const action = new fromActions.UpdateQuoteRequestItemsSuccess({ itemIds });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
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

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteItemFromQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.DeleteItemFromQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteItemFromQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = new fromActions.DeleteItemFromQuoteRequestSuccess({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });
});
