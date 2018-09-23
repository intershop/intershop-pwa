import { HttpError } from '../../../models/http-error/http-error.model';
import { QuoteLineItemResultModel } from '../../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../../models/quote-request/quote-request.interface';

import * as fromActions from './quote-request.actions';

describe('Quote Request Actions', () => {
  describe('SelectQuoteRequest Actions', () => {
    it('should create new action for SelectQuoteRequest', () => {
      const payload = 'test';
      const action = new fromActions.SelectQuoteRequest(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.SelectQuoteRequest,
        payload,
      });
    });
  });

  describe('Load QuoteRequest Actions', () => {
    it('should create new action for LoadQuoteRequests', () => {
      const action = new fromActions.LoadQuoteRequests();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.LoadQuoteRequests,
      });
    });

    it('should create new action for LoadQuoteRequestsFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.LoadQuoteRequestsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.LoadQuoteRequestsFail,
        payload,
      });
    });

    it('should create new action for LoadQuoteRequestsSuccess', () => {
      const payload = [{ id: '123' } as QuoteRequestData];
      const action = new fromActions.LoadQuoteRequestsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.LoadQuoteRequestsSuccess,
        payload,
      });
    });
  });

  describe('Add Quote Request Actions', () => {
    it('should create new action for AddQuoteRequest', () => {
      const action = new fromActions.AddQuoteRequest();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.AddQuoteRequest,
      });
    });

    it('should create new action for AddQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.AddQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.AddQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for AddQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new fromActions.AddQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.AddQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Update Quote Request Actions', () => {
    it('should create new action for UpdateQuoteRequest', () => {
      const payload = { displayName: '123' };
      const action = new fromActions.UpdateQuoteRequest(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.UpdateQuoteRequest,
        payload,
      });
    });

    it('should create new action for UpdateQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.UpdateQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.UpdateQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for UpdateQuoteRequestSuccess', () => {
      const payload = { id: '123' } as QuoteRequestData;
      const action = new fromActions.UpdateQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.UpdateQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Delete Quote Request Actions', () => {
    it('should create new action for DeleteQuoteRequest', () => {
      const payload = 'test';
      const action = new fromActions.DeleteQuoteRequest(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.DeleteQuoteRequest,
        payload,
      });
    });

    it('should create new action for DeleteQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.DeleteQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.DeleteQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for DeleteQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new fromActions.DeleteQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.DeleteQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Submit Quote Request Actions', () => {
    it('should create new action for SubmitQuoteRequest', () => {
      const action = new fromActions.SubmitQuoteRequest();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.SubmitQuoteRequest,
      });
    });

    it('should create new action for SubmitQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.SubmitQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.SubmitQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for SubmitQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new fromActions.SubmitQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.SubmitQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Create Quote Request from Quote Actions', () => {
    it('should create new action for CreateQuoteRequestFromQuoteRequest', () => {
      const action = new fromActions.CreateQuoteRequestFromQuoteRequest();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequest,
      });
    });

    it('should create new action for CreateQuoteRequestFromQuoteFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.CreateQuoteRequestFromQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for CreateQuoteRequestFromQuoteSuccess', () => {
      const payload = {} as QuoteLineItemResultModel;
      const action = new fromActions.CreateQuoteRequestFromQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.CreateQuoteRequestFromQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Load QuoteRequestItems Actions', () => {
    it('should create new action for LoadQuoteRequestItems', () => {
      const payload = 'test';
      const action = new fromActions.LoadQuoteRequestItems(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.LoadQuoteRequestItems,
        payload,
      });
    });

    it('should create new action for LoadQuoteRequestItemsFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.LoadQuoteRequestItemsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.LoadQuoteRequestItemsFail,
        payload,
      });
    });

    it('should create new action for LoadQuoteRequestItemsSuccess', () => {
      const payload = [{ id: '123' } as QuoteRequestItem];
      const action = new fromActions.LoadQuoteRequestItemsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.LoadQuoteRequestItemsSuccess,
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
        type: fromActions.QuoteRequestActionTypes.AddProductToQuoteRequest,
        payload,
      });
    });

    it('should create new action for AddProductToQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.AddProductToQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.AddProductToQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for AddProductToQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new fromActions.AddProductToQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.AddProductToQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Add Basket to Quote Request Actions', () => {
    it('should create new action for AddBasketToQuoteRequest', () => {
      const action = new fromActions.AddBasketToQuoteRequest();

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.AddBasketToQuoteRequest,
      });
    });

    it('should create new action for AddBasketToQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.AddBasketToQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.AddBasketToQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for AddBasketToQuoteRequestSuccess', () => {
      const payload = 'QRID';
      const action = new fromActions.AddBasketToQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.AddBasketToQuoteRequestSuccess,
        payload,
      });
    });
  });

  describe('Update Quote Request Items Actions', () => {
    it('should create new action for UpdateQuoteRequestItems', () => {
      const payload = [
        {
          itemId: 'test',
          quantity: 1,
        },
      ];
      const action = new fromActions.UpdateQuoteRequestItems(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.UpdateQuoteRequestItems,
        payload,
      });
    });

    it('should create new action for UpdateQuoteRequestItemsFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.UpdateQuoteRequestItemsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.UpdateQuoteRequestItemsFail,
        payload,
      });
    });

    it('should create new action for UpdateQuoteRequestItemsSuccess', () => {
      const payload = ['test'];
      const action = new fromActions.UpdateQuoteRequestItemsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.UpdateQuoteRequestItemsSuccess,
        payload,
      });
    });
  });

  describe('Delete Item From Quote Request Actions', () => {
    it('should create new action for DeleteItemFromQuoteRequest', () => {
      const payload = {
        itemId: 'test',
      };
      const action = new fromActions.DeleteItemFromQuoteRequest(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.DeleteItemFromQuoteRequest,
        payload,
      });
    });

    it('should create new action for DeleteItemFromQuoteRequestFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.DeleteItemFromQuoteRequestFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.DeleteItemFromQuoteRequestFail,
        payload,
      });
    });

    it('should create new action for DeleteItemFromQuoteRequestSuccess', () => {
      const payload = 'test';
      const action = new fromActions.DeleteItemFromQuoteRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.QuoteRequestActionTypes.DeleteItemFromQuoteRequestSuccess,
        payload,
      });
    });
  });
});
