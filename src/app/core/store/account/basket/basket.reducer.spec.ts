import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import {
  BasketValidation,
  BasketValidationResultType,
} from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Order } from 'ish-core/models/order/order.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { CreateOrderSuccess } from 'ish-core/store/account/orders';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import {
  AddItemsToBasketFail,
  AddItemsToBasketSuccess,
  AddProductToBasket,
  AddPromotionCodeToBasket,
  AddPromotionCodeToBasketFail,
  AddPromotionCodeToBasketSuccess,
  ContinueCheckout,
  ContinueCheckoutFail,
  ContinueCheckoutSuccess,
  ContinueCheckoutWithIssues,
  CreateBasketPayment,
  CreateBasketPaymentFail,
  CreateBasketPaymentSuccess,
  DeleteBasketItem,
  DeleteBasketItemFail,
  DeleteBasketItemSuccess,
  DeleteBasketPayment,
  DeleteBasketPaymentFail,
  DeleteBasketPaymentSuccess,
  LoadBasket,
  LoadBasketEligiblePaymentMethods,
  LoadBasketEligiblePaymentMethodsFail,
  LoadBasketEligiblePaymentMethodsSuccess,
  LoadBasketEligibleShippingMethods,
  LoadBasketEligibleShippingMethodsFail,
  LoadBasketEligibleShippingMethodsSuccess,
  LoadBasketFail,
  LoadBasketSuccess,
  MergeBasket,
  MergeBasketFail,
  MergeBasketSuccess,
  RemovePromotionCodeFromBasket,
  RemovePromotionCodeFromBasketFail,
  RemovePromotionCodeFromBasketSuccess,
  ResetBasketErrors,
  SetBasketPayment,
  SetBasketPaymentFail,
  SetBasketPaymentSuccess,
  UpdateBasket,
  UpdateBasketFail,
  UpdateBasketItems,
  UpdateBasketItemsFail,
  UpdateBasketItemsSuccess,
  UpdateBasketPayment,
  UpdateBasketPaymentFail,
  UpdateBasketPaymentSuccess,
  UpdateBasketShippingMethod,
} from './basket.actions';
import { basketReducer, initialState } from './basket.reducer';

describe('Basket Reducer', () => {
  describe('LoadBasket actions', () => {
    describe('LoadBasket action', () => {
      it('should set loading to true', () => {
        const action = new LoadBasket({ id: 'test' });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadBasketFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new LoadBasketFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadBasketSuccess action', () => {
      it('should set basket and set loading to false', () => {
        const basket = {
          id: 'test',
        } as Basket;

        const action = new LoadBasketSuccess({ basket });
        const state = basketReducer(initialState, action);

        expect(state.basket).toEqual(basket);
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('MergeBasket actions', () => {
    describe('MergeBasket action', () => {
      it('should set loading to true', () => {
        const action = new MergeBasket();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('MergeBasketSuccess action', () => {
      it('should set loading to false', () => {
        const basket = {
          id: 'test',
        } as Basket;

        const action = new MergeBasketSuccess({ basket });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });

    describe('MergeBasketFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new MergeBasketFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });
  });

  describe('UpdateBasket actions', () => {
    describe('UpdateBasket action', () => {
      it('should set loading to true', () => {
        const action = new UpdateBasket({ update: { invoiceToAddress: '1234' } });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateBasketShippingMethod action', () => {
      it('should set loading to true', () => {
        const action = new UpdateBasketShippingMethod({ shippingId: '1234' });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateBasketFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new UpdateBasketFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });
  });

  describe('ContinueCheckout actions', () => {
    const basketValidation: BasketValidation = {
      basket: BasketMockData.getBasket(),
      results: {
        valid: true,
        adjusted: false,
      },
    };
    describe('ContinueCheckout action', () => {
      it('should set loading to true', () => {
        const action = new ContinueCheckout({ targetStep: 1 });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.validationResults.valid).toBeUndefined();
      });
    });

    describe('ContinueCheckoutSuccess action', () => {
      it('should save validationResults when called', () => {
        const action = new ContinueCheckoutSuccess({ targetRoute: '/checkout/address', basketValidation });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.validationResults.valid).toBeTrue();
      });
    });

    describe('ContinueCheckoutWithIssues action', () => {
      it('should save validationResults when called', () => {
        const action = new ContinueCheckoutWithIssues({
          targetRoute: '/checkout/address',
          basketValidation,
        });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.validationResults.valid).toBeTrue();
      });
    });

    describe('ContinueCheckoutFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new ContinueCheckoutFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });
  });

  describe('AddItemsToBasket actions', () => {
    describe('AddProductToBasket action', () => {
      it('should set loading to true', () => {
        const action = new AddProductToBasket({ sku: 'test', quantity: 1 });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.lastTimeProductAdded).toBeUndefined();
      });
    });

    describe('AddItemsToBasketFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new AddItemsToBasketFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddItemsToBasketSuccess action', () => {
      it('should set loading to false', () => {
        const action = new AddItemsToBasketSuccess({ info: [{ message: 'info' } as BasketInfo] });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
        expect(state.info[0].message).toEqual('info');
        expect(state.lastTimeProductAdded).toBeNumber();
      });
    });
  });

  describe('UpdateBasketItems actions', () => {
    describe('UpdateBasketItems action', () => {
      it('should set loading to true', () => {
        const action = new UpdateBasketItems({
          lineItemUpdates: [
            {
              quantity: 2,
              itemId: 'test',
            },
          ],
        });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateBasketItemsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new UpdateBasketItemsFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateBasketItemsSuccess action', () => {
      it('should set loading to false', () => {
        const action = new UpdateBasketItemsSuccess({ info: [{ message: 'info' } as BasketInfo] });
        const state = basketReducer(initialState, action);

        expect(state.info[0].message).toEqual('info');
        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });

  describe('DeleteBasketItem actions', () => {
    describe('DeleteBasketItem action', () => {
      it('should set loading to true', () => {
        const action = new DeleteBasketItem({ itemId: 'test' });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteBasketItemFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new DeleteBasketItemFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteBasketItemSuccess action', () => {
      it('should set loading to false', () => {
        const action = new DeleteBasketItemSuccess({ info: [{ message: 'info' } as BasketInfo] });
        const state = basketReducer(initialState, action);

        expect(state.info[0].message).toEqual('info');
        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });

    describe('AddPromotionCodeToBasket actions', () => {
      describe('AddPromotionCodeToBasket action', () => {
        it('should set loading to true', () => {
          const action = new AddPromotionCodeToBasket({ code: 'test' });
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeTrue();
        });
      });

      describe('AddPromotionCodeToBasketFail action', () => {
        it('should set loading to false', () => {
          const error = { message: 'invalid' } as HttpError;
          const action = new AddPromotionCodeToBasketFail({ error });
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeFalse();
          expect(state.promotionError).toEqual(error);
        });
      });

      describe('AddPromotionCodeToBasketSuccess action', () => {
        it('should set loading to false', () => {
          const action = new AddPromotionCodeToBasketSuccess();
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeFalse();
          expect(state.error).toBeUndefined();
        });
      });
    });

    describe('RemovePromotionCodeFromBasket actions', () => {
      describe('RemovePromotionCodeFromBasket action', () => {
        it('should set loading to true', () => {
          const action = new RemovePromotionCodeFromBasket({ code: 'test' });
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeTrue();
        });
      });

      describe('RemovePromotionCodeFromBasketFail action', () => {
        it('should set loading to false', () => {
          const error = undefined as HttpError;
          const action = new RemovePromotionCodeFromBasketFail({ error });
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeFalse();
          expect(state.promotionError).toEqual(error);
        });
      });

      describe('RemovePromotionCodeFromBasketSuccess action', () => {
        it('should set loading to false', () => {
          const action = new RemovePromotionCodeFromBasketSuccess();
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeFalse();
          expect(state.error).toBeUndefined();
        });
      });
    });
  });

  describe('LoadBasketEligibleShippingMethods actions', () => {
    describe('LoadBasketEligibleShippingMethods action', () => {
      it('should set loading to true', () => {
        const action = new LoadBasketEligibleShippingMethods();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadBasketEligibleShippingMethodsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new LoadBasketEligibleShippingMethodsFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadBasketEligibleShippingMethodsSuccess action', () => {
      it('should set loading to false', () => {
        const basket = {
          id: 'test',
        } as Basket;
        const shippingMethods = [BasketMockData.getShippingMethod()];

        const basketAction = new LoadBasketSuccess({ basket });
        const basketShippingAction = new LoadBasketEligibleShippingMethodsSuccess({ shippingMethods });
        let state = basketReducer(initialState, basketAction);
        state = basketReducer(state, basketShippingAction);

        expect(state.eligibleShippingMethods).toEqual(shippingMethods);
        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });

  describe('LoadBasketEligiblePaymentMethods actions', () => {
    describe('LoadBasketEligiblePaymentMethods action', () => {
      it('should set loading to true', () => {
        const action = new LoadBasketEligiblePaymentMethods();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadBasketEligiblePaymentMethodsFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new LoadBasketEligiblePaymentMethodsFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadBasketEligiblePaymentMethodsSuccess action', () => {
      it('should set loading to false', () => {
        const basket = {
          id: 'test',
        } as Basket;
        const paymentMethods = [BasketMockData.getPaymentMethod()];

        const basketAction = new LoadBasketSuccess({ basket });
        const basketPaymentAction = new LoadBasketEligiblePaymentMethodsSuccess({ paymentMethods });
        let state = basketReducer(initialState, basketAction);
        state = basketReducer(state, basketPaymentAction);

        expect(state.eligiblePaymentMethods).toEqual(paymentMethods);
        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });

  describe('SetBasketPayment actions', () => {
    describe('SetBasketPayment action', () => {
      it('should set loading to true', () => {
        const action = new SetBasketPayment({ id: 'testPayment' });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('SetBasketPaymentFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new SetBasketPaymentFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('SetBasketPaymentSuccess action', () => {
      it('should set loading to false', () => {
        const action = new SetBasketPaymentSuccess();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });

  describe('CreateBasketPayment actions', () => {
    const paymentInstrument = {
      id: undefined,
      paymentMethod: 'ISH_DirectDebit',
      parameters_: [
        {
          name: 'accountHolder',
          value: 'Patricia Miller',
        },
        {
          name: 'IBAN',
          value: 'DE430859340859340',
        },
      ],
    };
    describe('CreateBasketPayment action', () => {
      it('should set loading to true', () => {
        const action = new CreateBasketPayment({ paymentInstrument, saveForLater: false });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateBasketPaymentFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new CreateBasketPaymentFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateBasketPaymentSuccess action', () => {
      it('should set loading to false', () => {
        const action = new CreateBasketPaymentSuccess();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });

  describe('UpdateBasketPayment actions', () => {
    const params = {
      redirect: 'success',
      param1: '123',
      param2: '456',
    };

    describe('UpdateBasketPayment action', () => {
      it('should set loading to true', () => {
        const action = new UpdateBasketPayment({ params });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateBasketPaymentFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new UpdateBasketPaymentFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateBasketPaymentSuccess action', () => {
      it('should set loading to false', () => {
        const action = new UpdateBasketPaymentSuccess();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });

  describe('DeleteBasketPayment actions', () => {
    describe('DeleteBasketPayment action', () => {
      it('should set loading to true', () => {
        const action = new DeleteBasketPayment({
          paymentInstrument: {
            id: '12345',
            paymentMethod: 'ISH_DirectDebit',
            parameters_: [
              {
                name: 'accountHolder',
                value: 'Patricia Miller',
              },
              {
                name: 'IBAN',
                value: 'DE430859340859340',
              },
            ],
          } as PaymentInstrument,
        });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteBasketPaymentFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new DeleteBasketPaymentFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteBasketPaymentSuccess action', () => {
      it('should set loading to false', () => {
        const action = new DeleteBasketPaymentSuccess();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });

  describe('CreateOrderSuccess action', () => {
    it('should reset the checkout state if called', () => {
      const oldState = {
        ...initialState,
        loading: true,
        lineItems: [{ id: 'test' } as LineItem],
      };
      const action = new CreateOrderSuccess({ order: { id: '123' } as Order });
      const state = basketReducer(oldState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('ResetBasketErrors action', () => {
    it('should reset error in state if called', () => {
      const oldState = {
        ...initialState,
        error: { message: 'invalid' } as HttpError,
      };
      const action = new ResetBasketErrors();
      const state = basketReducer(oldState, action);

      expect(state.error).toBeUndefined();
    });

    it('should reset promotionError in state if called', () => {
      const oldState = {
        ...initialState,
        promotionError: { message: 'invalid' } as HttpError,
      };
      const action = new ResetBasketErrors();
      const state = basketReducer(oldState, action);

      expect(state.promotionError).toBeUndefined();
    });

    it('should reset validationErrors in state if called', () => {
      const oldState = {
        ...initialState,
        validationResults: { errors: [{ message: 'errorMessage' }] } as BasketValidationResultType,
      };
      const action = new ResetBasketErrors();
      const state = basketReducer(oldState, action);

      expect(state.validationResults.errors).toHaveLength(0);
    });
  });
});
