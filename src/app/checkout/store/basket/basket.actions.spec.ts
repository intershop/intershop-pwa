import { HttpErrorResponse } from '@angular/common/http';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { Link } from '../../../models/link/link.model';
import { Order } from '../../../models/order/order.model';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';
import * as fromActions from './basket.actions';

describe('Basket Actions', () => {
  const basket = BasketMockData.getBasket();
  describe('Load Basket Actions', () => {
    it('should create new action for LoadBasket', () => {
      const payload = '123';
      const action = new fromActions.LoadBasket(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasket,
        payload,
      });
    });

    it('should create new action for LoadBasketFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadBasketFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketFail,
        payload,
      });
    });

    it('should create new action for LoadBasketSuccess', () => {
      const payload = { id: '123' } as Basket;
      const action = new fromActions.LoadBasketSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketSuccess,
        payload,
      });
    });
  });

  describe('Update Basket Actions', () => {
    it('should create new action for UpdateBasketInvoiceAddress', () => {
      const payload = '123';
      const action = new fromActions.UpdateBasketInvoiceAddress(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.UpdateBasketInvoiceAddress,
        payload,
      });
    });

    it('should create new action for UpdateBasketShippingAddress', () => {
      const payload = '123';
      const action = new fromActions.UpdateBasketShippingAddress(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.UpdateBasketShippingAddress,
        payload,
      });
    });

    it('should create new action for UpdateBasket', () => {
      const payload = { invoiceToAddress: { id: '123' } };
      const action = new fromActions.UpdateBasket(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.UpdateBasket,
        payload,
      });
    });

    it('should create new action for UpdateBasketFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.UpdateBasketFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.UpdateBasketFail,
        payload,
      });
    });

    it('should create new action for UpdateBasketSuccess', () => {
      const action = new fromActions.UpdateBasketSuccess();

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.UpdateBasketSuccess,
      });
    });
  });

  describe('Load Basket Items Actions', () => {
    it('should create new action for LoadBasketItems', () => {
      const payload = '123';
      const action = new fromActions.LoadBasketItems(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketItems,
        payload,
      });
    });

    it('should create new action for LoadBasketItemsFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadBasketItemsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketItemsFail,
        payload,
      });
    });

    it('should create new action for LoadBasketItemsSuccess', () => {
      const payload = [] as BasketItem[];
      const action = new fromActions.LoadBasketItemsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketItemsSuccess,
        payload,
      });
    });
  });

  describe('Add Items To Basket Actions', () => {
    it('should create new action for AddProductToBasket', () => {
      const payload = { sku: 'test', quantity: 1 };
      const action = new fromActions.AddProductToBasket(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.AddProductToBasket,
        payload,
      });
    });

    it('should create new action for AddItemsToBasketFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.AddItemsToBasketFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.AddItemsToBasketFail,
        payload,
      });
    });

    it('should create new action for AddItemsToBasketSuccess', () => {
      const action = new fromActions.AddItemsToBasketSuccess();

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.AddItemsToBasketSuccess,
      });
    });
  });

  describe('Add Quote To Basket Actions', () => {
    it('should create new action for AddQuoteToBasket', () => {
      const payload = 'QID';
      const action = new fromActions.AddQuoteToBasket(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.AddQuoteToBasket,
        payload,
      });
    });

    it('should create new action for AddQuoteToBasketFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.AddQuoteToBasketFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.AddQuoteToBasketFail,
        payload,
      });
    });

    it('should create new action for AddQuoteToBasketSuccess', () => {
      const payload = {} as Link;
      const action = new fromActions.AddQuoteToBasketSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.AddQuoteToBasketSuccess,
        payload,
      });
    });
  });

  describe('Update Basket Items Actions', () => {
    it('should create new action for UpdateBasketItems', () => {
      const payload = [
        {
          quantity: 1,
          itemId: 'test',
        },
        {
          quantity: 2,
          itemId: 'test',
        },
      ];
      const action = new fromActions.UpdateBasketItems(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.UpdateBasketItems,
        payload,
      });
    });

    it('should create new action for UpdateBasketItemsFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.UpdateBasketItemsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.UpdateBasketItemsFail,
        payload,
      });
    });

    it('should create new action for UpdateBasketItemsSuccess', () => {
      const action = new fromActions.UpdateBasketItemsSuccess();

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.UpdateBasketItemsSuccess,
      });
    });
  });

  describe('Delete Basket Item Actions', () => {
    it('should create new action for DeleteBasketItem', () => {
      const payload = 'test';
      const action = new fromActions.DeleteBasketItem(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.DeleteBasketItem,
        payload,
      });
    });

    it('should create new action for DeleteBasketItemFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.DeleteBasketItemFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.DeleteBasketItemFail,
        payload,
      });
    });

    it('should create new action for DeleteBasketItemSuccess', () => {
      const action = new fromActions.DeleteBasketItemSuccess();

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.DeleteBasketItemSuccess,
      });
    });
  });

  describe('Load Basket Eligible Shipping Methods Actions', () => {
    it('should create new action for LoadBasketEligibleShippingMethods', () => {
      const action = new fromActions.LoadBasketEligibleShippingMethods();

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketEligibleShippingMethods,
      });
    });

    it('should create new action for LoadBasketEligibleShippingFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadBasketEligibleShippingMethodsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketEligibleShippingMethodsFail,
        payload,
      });
    });

    it('should create new action for LoadBasketEligibleShippingSuccess', () => {
      const payload = [BasketMockData.getShippingMethod()];
      const action = new fromActions.LoadBasketEligibleShippingMethodsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketEligibleShippingMethodsSuccess,
        payload,
      });
    });
  });

  describe('Load Basket Payments Actions', () => {
    it('should create new action for LoadBasketPayments', () => {
      const payload = '123';
      const action = new fromActions.LoadBasketPayments(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketPayments,
        payload,
      });
    });

    it('should create new action for LoadBasketPaymentsFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadBasketPaymentsFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketPaymentsFail,
        payload,
      });
    });

    it('should create new action for LoadBasketPaymentsSuccess', () => {
      const payload = [] as PaymentMethod[];
      const action = new fromActions.LoadBasketPaymentsSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.LoadBasketPaymentsSuccess,
        payload,
      });
    });
  });

  describe('Set Basket Payment Actions', () => {
    it('should create new action for SetBasketPayment', () => {
      const payload = 'paymentName';
      const action = new fromActions.SetBasketPayment(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.SetBasketPayment,
        payload,
      });
    });

    it('should create new action for SetBasketPaymentFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.SetBasketPaymentFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.SetBasketPaymentFail,
        payload,
      });
    });

    it('should create new action for SetBasketPaymentSuccess', () => {
      const action = new fromActions.SetBasketPaymentSuccess();

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.SetBasketPaymentSuccess,
      });
    });
  });

  describe('Reset Basket Action', () => {
    it('should create new action for ResetBasket', () => {
      const action = new fromActions.ResetBasket();

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.ResetBasket,
      });
    });
  });

  describe('Create Order Actions', () => {
    it('should create new action for Create Order', () => {
      const payload = basket;
      const action = new fromActions.CreateOrder(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.CreateOrder,
        payload,
      });
    });
    it('should create new action for CreateOrderFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.CreateOrderFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.CreateOrderFail,
        payload,
      });
    });

    it('should create new action for CreateOrderSuccess', () => {
      const payload = { id: '123' } as Order;
      const action = new fromActions.CreateOrderSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.BasketActionTypes.CreateOrderSuccess,
        payload,
      });
    });
  });
});
