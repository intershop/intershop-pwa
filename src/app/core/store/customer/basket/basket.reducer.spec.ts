import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import {
  BasketValidation,
  BasketValidationResultType,
} from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Order } from 'ish-core/models/order/order.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import {
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  addProductToBasket,
  addPromotionCodeToBasket,
  addPromotionCodeToBasketFail,
  addPromotionCodeToBasketSuccess,
  continueCheckout,
  continueCheckoutFail,
  continueCheckoutSuccess,
  continueCheckoutWithIssues,
  createBasketPayment,
  createBasketPaymentFail,
  createBasketPaymentSuccess,
  deleteBasketItem,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  loadBasket,
  loadBasketEligiblePaymentMethods,
  loadBasketEligiblePaymentMethodsFail,
  loadBasketEligiblePaymentMethodsSuccess,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
  mergeBasket,
  mergeBasketFail,
  mergeBasketSuccess,
  removePromotionCodeFromBasket,
  removePromotionCodeFromBasketFail,
  removePromotionCodeFromBasketSuccess,
  resetBasketErrors,
  setBasketPayment,
  setBasketPaymentFail,
  setBasketPaymentSuccess,
  updateBasket,
  updateBasketFail,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  updateBasketPayment,
  updateBasketPaymentFail,
  updateBasketPaymentSuccess,
  updateBasketShippingMethod,
} from './basket.actions';
import { basketReducer, initialState } from './basket.reducer';

describe('Basket Reducer', () => {
  describe('LoadBasket actions', () => {
    describe('LoadBasket action', () => {
      it('should set loading to true', () => {
        const action = loadBasket();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadBasketFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = loadBasketFail({ error });
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

        const action = loadBasketSuccess({ basket });
        const state = basketReducer(initialState, action);

        expect(state.basket).toEqual(basket);
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('MergeBasket actions', () => {
    describe('MergeBasket action', () => {
      it('should set loading to true', () => {
        const action = mergeBasket();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('MergeBasketSuccess action', () => {
      it('should set loading to false', () => {
        const basket = {
          id: 'test',
        } as Basket;

        const action = mergeBasketSuccess({ basket });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });

    describe('MergeBasketFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = mergeBasketFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });
  });

  describe('UpdateBasket actions', () => {
    describe('UpdateBasket action', () => {
      it('should set loading to true', () => {
        const action = updateBasket({ update: { invoiceToAddress: '1234' } });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateBasketShippingMethod action', () => {
      it('should set loading to true', () => {
        const action = updateBasketShippingMethod({ shippingId: '1234' });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateBasketFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = updateBasketFail({ error });
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
        const action = continueCheckout({ targetStep: 1 });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.validationResults.valid).toBeUndefined();
      });
    });

    describe('ContinueCheckoutSuccess action', () => {
      it('should save validationResults when called', () => {
        const action = continueCheckoutSuccess({ targetRoute: '/checkout/address', basketValidation });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.validationResults.valid).toBeTrue();
      });
    });

    describe('ContinueCheckoutWithIssues action', () => {
      it('should save validationResults when called', () => {
        const action = continueCheckoutWithIssues({
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
        const error = makeHttpError({ message: 'invalid' });
        const action = continueCheckoutFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });
  });

  describe('AddItemsToBasket actions', () => {
    describe('AddProductToBasket action', () => {
      it('should set loading to true', () => {
        const action = addProductToBasket({ sku: 'test', quantity: 1 });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.lastTimeProductAdded).toBeUndefined();
      });
    });

    describe('AddItemsToBasketFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = addItemsToBasketFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('AddItemsToBasketSuccess action', () => {
      it('should set loading to false', () => {
        const action = addItemsToBasketSuccess({ info: [{ message: 'info' } as BasketInfo] });
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
        const action = updateBasketItems({
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
        const error = makeHttpError({ message: 'invalid' });
        const action = updateBasketItemsFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateBasketItemsSuccess action', () => {
      it('should set loading to false', () => {
        const action = updateBasketItemsSuccess({ info: [{ message: 'info' } as BasketInfo] });
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
        const action = deleteBasketItem({ itemId: 'test' });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteBasketItemFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = deleteBasketItemFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteBasketItemSuccess action', () => {
      it('should set loading to false', () => {
        const action = deleteBasketItemSuccess({ info: [{ message: 'info' } as BasketInfo] });
        const state = basketReducer(initialState, action);

        expect(state.info[0].message).toEqual('info');
        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });

    describe('AddPromotionCodeToBasket actions', () => {
      describe('AddPromotionCodeToBasket action', () => {
        it('should set loading to true', () => {
          const action = addPromotionCodeToBasket({ code: 'test' });
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeTrue();
        });
      });

      describe('AddPromotionCodeToBasketFail action', () => {
        it('should set loading to false', () => {
          const error = makeHttpError({ message: 'invalid' });
          const action = addPromotionCodeToBasketFail({ error });
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeFalse();
          expect(state.promotionError).toEqual(error);
        });
      });

      describe('AddPromotionCodeToBasketSuccess action', () => {
        it('should set loading to false', () => {
          const action = addPromotionCodeToBasketSuccess();
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeFalse();
          expect(state.error).toBeUndefined();
        });
      });
    });

    describe('RemovePromotionCodeFromBasket actions', () => {
      describe('RemovePromotionCodeFromBasket action', () => {
        it('should set loading to true', () => {
          const action = removePromotionCodeFromBasket({ code: 'test' });
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeTrue();
        });
      });

      describe('RemovePromotionCodeFromBasketFail action', () => {
        it('should set loading to false', () => {
          const action = removePromotionCodeFromBasketFail({ error: undefined });
          const state = basketReducer(initialState, action);

          expect(state.loading).toBeFalse();
          expect(state.promotionError).toBeUndefined();
        });
      });

      describe('RemovePromotionCodeFromBasketSuccess action', () => {
        it('should set loading to false', () => {
          const action = removePromotionCodeFromBasketSuccess();
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
        const action = loadBasketEligibleShippingMethods();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadBasketEligibleShippingMethodsFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = loadBasketEligibleShippingMethodsFail({ error });
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

        const basketAction = loadBasketSuccess({ basket });
        const basketShippingAction = loadBasketEligibleShippingMethodsSuccess({ shippingMethods });
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
        const action = loadBasketEligiblePaymentMethods();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadBasketEligiblePaymentMethodsFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = loadBasketEligiblePaymentMethodsFail({ error });
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

        const basketAction = loadBasketSuccess({ basket });
        const basketPaymentAction = loadBasketEligiblePaymentMethodsSuccess({ paymentMethods });
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
        const action = setBasketPayment({ id: 'testPayment' });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('SetBasketPaymentFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = setBasketPaymentFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('SetBasketPaymentSuccess action', () => {
      it('should set loading to false', () => {
        const action = setBasketPaymentSuccess();
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
        const action = createBasketPayment({ paymentInstrument, saveForLater: false });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateBasketPaymentFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = createBasketPaymentFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateBasketPaymentSuccess action', () => {
      it('should set loading to false', () => {
        const action = createBasketPaymentSuccess();
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
        const action = updateBasketPayment({ params });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateBasketPaymentFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = updateBasketPaymentFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateBasketPaymentSuccess action', () => {
      it('should set loading to false', () => {
        const action = updateBasketPaymentSuccess();
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toBeUndefined();
      });
    });
  });

  describe('DeleteBasketPayment actions', () => {
    describe('DeleteBasketPayment action', () => {
      it('should set loading to true', () => {
        const action = deleteBasketPayment({
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
        const error = makeHttpError({ message: 'invalid' });
        const action = deleteBasketPaymentFail({ error });
        const state = basketReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteBasketPaymentSuccess action', () => {
      it('should set loading to false', () => {
        const action = deleteBasketPaymentSuccess();
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
      const action = createOrderSuccess({ order: { id: '123' } as Order });
      const state = basketReducer(oldState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('ResetBasketErrors action', () => {
    it('should reset error in state if called', () => {
      const oldState = {
        ...initialState,
        error: makeHttpError({ message: 'invalid' }),
      };
      const action = resetBasketErrors();
      const state = basketReducer(oldState, action);

      expect(state.error).toBeUndefined();
    });

    it('should reset promotionError in state if called', () => {
      const oldState = {
        ...initialState,
        promotionError: makeHttpError({ message: 'invalid' }),
      };
      const action = resetBasketErrors();
      const state = basketReducer(oldState, action);

      expect(state.promotionError).toBeUndefined();
    });

    it('should reset validationErrors in state if called', () => {
      const oldState = {
        ...initialState,
        validationResults: { errors: [{ message: 'errorMessage' }] } as BasketValidationResultType,
      };
      const action = resetBasketErrors();
      const state = basketReducer(oldState, action);

      expect(state.validationResults.errors).toHaveLength(0);
    });
  });
});
