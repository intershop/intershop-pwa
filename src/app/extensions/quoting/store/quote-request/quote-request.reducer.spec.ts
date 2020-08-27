import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';

import {
  addBasketToQuoteRequest,
  addBasketToQuoteRequestFail,
  addBasketToQuoteRequestSuccess,
  addProductToQuoteRequest,
  addProductToQuoteRequestFail,
  addProductToQuoteRequestSuccess,
  addQuoteRequest,
  addQuoteRequestFail,
  addQuoteRequestSuccess,
  createQuoteRequestFromQuoteRequest,
  createQuoteRequestFromQuoteRequestFail,
  createQuoteRequestFromQuoteRequestSuccess,
  deleteItemFromQuoteRequest,
  deleteItemFromQuoteRequestFail,
  deleteItemFromQuoteRequestSuccess,
  deleteQuoteRequest,
  deleteQuoteRequestFail,
  deleteQuoteRequestSuccess,
  loadQuoteRequestItems,
  loadQuoteRequestItemsFail,
  loadQuoteRequestItemsSuccess,
  loadQuoteRequests,
  loadQuoteRequestsFail,
  loadQuoteRequestsSuccess,
  selectQuoteRequest,
  submitQuoteRequest,
  submitQuoteRequestFail,
  submitQuoteRequestSuccess,
  updateQuoteRequest,
  updateQuoteRequestFail,
  updateQuoteRequestItems,
  updateQuoteRequestItemsFail,
  updateQuoteRequestItemsSuccess,
  updateQuoteRequestSuccess,
} from './quote-request.actions';
import { initialState, quoteRequestReducer } from './quote-request.reducer';

describe('Quote Request Reducer', () => {
  describe('SelectQuoteRequest', () => {
    it('should select a quote request when reduced', () => {
      const action = selectQuoteRequest({ id: 'test' });
      const state = quoteRequestReducer(initialState, action);

      expect(state.selected).toEqual('test');
    });
  });

  describe('LoadQuoteRequests actions', () => {
    describe('LoadQuoteRequests action', () => {
      it('should set loading to true', () => {
        const action = loadQuoteRequests();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadQuoteRequestsFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = loadQuoteRequestsFail({ error });
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

        const action = loadQuoteRequestsSuccess({ quoteRequests });
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
        const action = addQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('AddQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = addQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = addQuoteRequestSuccess({ id: 'test' });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('UpdateQuoteRequest actions', () => {
    describe('UpdateQuoteRequest action', () => {
      it('should set loading to true', () => {
        const displayName = 'test';
        const action = updateQuoteRequest({ displayName });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = updateQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const quoteRequest = { id: 'test' } as QuoteRequestData;
        const action = updateQuoteRequestSuccess({ quoteRequest });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('DeleteQuoteRequest actions', () => {
    describe('DeleteQuoteRequest action', () => {
      it('should set loading to true', () => {
        const id = 'test';
        const action = deleteQuoteRequest({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = deleteQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = deleteQuoteRequestSuccess({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('SubmitQuoteRequest actions', () => {
    describe('SubmitQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = submitQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('SubmitQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = submitQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('SubmitQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = submitQuoteRequestSuccess({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('CreateQuoteRequestFromQuoteRequest actions', () => {
    describe('CreateQuoteRequestFromQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = createQuoteRequestFromQuoteRequest({});
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateQuoteRequestFromQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = createQuoteRequestFromQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateQuoteRequestFromQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const quoteLineItemResult = {} as QuoteLineItemResult;
        const action = createQuoteRequestFromQuoteRequestSuccess({ quoteLineItemResult });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('LoadQuoteRequestItems actions', () => {
    describe('LoadQuoteRequestItems action', () => {
      it('should set loading to true', () => {
        const id = 'test';
        const action = loadQuoteRequestItems({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadQuoteRequestItemsFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = loadQuoteRequestItemsFail({ error });
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

        const action = loadQuoteRequestItemsSuccess(quoteRequestItems);
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
        const action = addProductToQuoteRequest(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('AddProductToQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = addProductToQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddProductToQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = addProductToQuoteRequestSuccess({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('AddBasketToQuoteRequest actions', () => {
    describe('AddBasketToQuoteRequest action', () => {
      it('should set loading to true', () => {
        const action = addBasketToQuoteRequest();
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('AddBasketToQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = addBasketToQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddBasketToQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const action = addBasketToQuoteRequestSuccess({ id: 'QRID' });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('UpdateQuoteRequestItems actions', () => {
    describe('UpdateQuoteRequestItems action', () => {
      it('should set loading to true', () => {
        const lineItemUpdates = [{ itemId: 'test', quantity: 1 }];
        const action = updateQuoteRequestItems({ lineItemUpdates });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateQuoteRequestItemsFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = updateQuoteRequestItemsFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateQuoteRequestItemsSuccess action', () => {
      it('should set loading to false', () => {
        const itemIds = ['test'];
        const action = updateQuoteRequestItemsSuccess({ itemIds });
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
        const action = deleteItemFromQuoteRequest(payload);
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteItemFromQuoteRequestFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = deleteItemFromQuoteRequestFail({ error });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteItemFromQuoteRequestSuccess action', () => {
      it('should set loading to false', () => {
        const id = 'test';
        const action = deleteItemFromQuoteRequestSuccess({ id });
        const state = quoteRequestReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });
});
