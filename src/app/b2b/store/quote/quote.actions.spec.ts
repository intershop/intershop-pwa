import { HttpErrorResponse } from '@angular/common/http';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';
import * as fromActions from './quote.actions';

describe('Quote Actions', () => {
  describe('SelectQuote Actions', () => {
    it('should create new action for SelectQuote', () => {
      const payload = 'test';
      const action = new fromActions.SelectQuote(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.SelectQuote,
        payload,
      });
    });
  });

  describe('Load QuoteRequest Actions', () => {
    it('should create new action for LoadQuoteRequests', () => {
      const action = new fromActions.LoadQuoteRequests();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuoteRequests,
      });
    });

    it('should create new action for LoadQuoteRequestsFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadQuoteRequestsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuoteRequestsFail,
        payload,
      });
    });

    it('should create new action for LoadQuoteRequestsSuccess', () => {
      const payload = [{ id: '123' } as QuoteRequest];
      const action = new fromActions.LoadQuoteRequestsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuoteRequestsSuccess,
        payload,
      });
    });
  });

  describe('Load Quote Actions', () => {
    it('should create new action for LoadQuotes', () => {
      const action = new fromActions.LoadQuotes();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuotes,
      });
    });

    it('should create new action for LoadQuotesFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadQuotesFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuotesFail,
        payload,
      });
    });

    it('should create new action for LoadQuotesSuccess', () => {
      const payload = [{ id: '123' } as Quote];
      const action = new fromActions.LoadQuotesSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuotesSuccess,
        payload,
      });
    });
  });

  describe('Add Quote Request Actions', () => {
    it('should create new action for AddQuoteRequest', () => {
      const action = new fromActions.AddQuoteRequest();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.AddQuoteRequest,
      });
    });

    it('should create new action for AddQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.AddQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.AddQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for AddQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new fromActions.AddQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.AddQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Update Quote Request Actions', () => {
    it('should create new action for UpdateQuoteRequest', () => {
      const payload = { id: '123' } as QuoteRequest;
      const action = new fromActions.UpdateQuoteRequest(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.UpdateQuoteRequest,
        payload,
      });
    });

    it('should create new action for UpdateQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.UpdateQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.UpdateQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for UpdateQuoteRequestSuccess', () => {
      const payload = { id: '123' } as QuoteRequest;
      const action = new fromActions.UpdateQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.UpdateQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Delete Quote Request Actions', () => {
    it('should create new action for DeleteQuoteRequest', () => {
      const payload = 'test';
      const action = new fromActions.DeleteQuoteRequest(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteQuoteRequest,
        payload,
      });
    });

    it('should create new action for DeleteQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.DeleteQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for DeleteQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new fromActions.DeleteQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Delete Quote Actions', () => {
    it('should create new action for DeleteQuote', () => {
      const payload = 'test';
      const action = new fromActions.DeleteQuote(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteQuote,
        payload,
      });
    });

    it('should create new action for DeleteQuoteFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.DeleteQuoteFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteQuoteFail,
        payload,
      });
    });

    it('should create new action for DeleteQuoteSuccess', () => {
      const payload = 'test';
      const action = new fromActions.DeleteQuoteSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteQuoteSuccess,
        payload,
      });
    });
  });

  describe('Load QuoteRequestItems Actions', () => {
    it('should create new action for LoadQuoteRequestItems', () => {
      const payload = 'test';
      const action = new fromActions.LoadQuoteRequestItems(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuoteRequestItems,
        payload,
      });
    });

    it('should create new action for LoadQuoteRequestItemsFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadQuoteRequestItemsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuoteRequestItemsFail,
        payload,
      });
    });

    it('should create new action for LoadQuoteRequestItemsSuccess', () => {
      const payload = [{ id: '123' } as QuoteRequestItem];
      const action = new fromActions.LoadQuoteRequestItemsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.LoadQuoteRequestItemsSuccess,
        payload,
      });
    });
  });

  describe('Add Item to Quote Request Actions', () => {
    it('should create new action for AddProductToQuoteRequest', () => {
      const payload = {
        sku: 'test',
        quantity: 1,
      };
      const action = new fromActions.AddProductToQuoteRequest(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.AddProductToQuoteRequest,
        payload: payload,
      });
    });

    it('should create new action for AddProductToQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.AddProductToQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.AddProductToQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for AddProductToQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new fromActions.AddProductToQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.AddProductToQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Update Quote Request Items Actions', () => {
    it('should create new action for UpdateQuoteRequestItems', () => {
      const payload = {
        quoteRequestId: 'test',
        items: [
          {
            itemId: 'test',
            quantity: 1,
          },
        ],
      };
      const action = new fromActions.UpdateQuoteRequestItems(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.UpdateQuoteRequestItems,
        payload: payload,
      });
    });

    it('should create new action for UpdateQuoteRequestItemsFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.UpdateQuoteRequestItemsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.UpdateQuoteRequestItemsFail,
        payload,
      });
    });

    it('should create new action for UpdateQuoteRequestItemsSuccess', () => {
      const payload = ['test'];
      const action = new fromActions.UpdateQuoteRequestItemsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.UpdateQuoteRequestItemsSuccess,
        payload,
      });
    });
  });

  describe('Delete Item From Quote Request Actions', () => {
    it('should create new action for DeleteItemFromQuoteRequest', () => {
      const payload = {
        quoteRequestId: 'test',
        itemId: 'test',
      };
      const action = new fromActions.DeleteItemFromQuoteRequest(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteItemFromQuoteRequest,
        payload: payload,
      });
    });

    it('should create new action for DeleteItemFromQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.DeleteItemFromQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteItemFromQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for DeleteItemFromQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new fromActions.DeleteItemFromQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteActionTypes.DeleteItemFromQuoteRequestSuccess,
        payload,
      });
    });
  });
});
