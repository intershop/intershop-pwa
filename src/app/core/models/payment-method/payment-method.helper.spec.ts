import { PaymentMethodHelper } from './payment-method.helper';
import { CheckoutPaymentCondition, PaymentMethod } from './payment-method.model';

describe('Payment Method Helper', () => {
  describe('shouldShowOnCheckoutStep', () => {
    it(`should only displayed on basket page if PaymentMethod has FastCheckout capability`, () => {
      const paymentMethodCapabilities = ['FastCheckout', 'blubber', 'RedirectBeforeCheckout'];
      const paymentMethod = {
        id: 'FastCheckoutPaymentMethodID',
        displayName: 'Fast Checkout PaymentMethod',
        serviceId: 'FastCheckoutPaymentMethodID',
        capabilities: paymentMethodCapabilities,
      } as PaymentMethod;
      const condition = { checkoutStep: 'shipping' } as CheckoutPaymentCondition;

      let result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();

      condition.checkoutStep = 'basket';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeTrue();

      condition.checkoutStep = 'payment';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();
    });

    it(`should only displayed on basket page if guest checkout is enabled`, () => {
      const paymentMethodCapabilities = ['FastCheckout', 'blubber', 'RedirectBeforeCheckout'];
      const paymentMethod = {
        id: 'FastCheckoutPaymentMethodID',
        displayName: 'Fast Checkout PaymentMethod',
        serviceId: 'FastCheckoutPaymentMethodID',
        capabilities: paymentMethodCapabilities,
      } as PaymentMethod;
      const condition = {
        checkoutStep: 'shipping',
        isGuestCheckoutEnabled: true,
        anonymous: true,
      } as CheckoutPaymentCondition;

      let result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();

      condition.checkoutStep = 'basket';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeTrue();

      condition.anonymous = false;
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeTrue();

      condition.checkoutStep = 'payment';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();
    });

    it(`should not displayed on basket page if guest checkout is disabled`, () => {
      const paymentMethodCapabilities = ['FastCheckout', 'blubber', 'RedirectBeforeCheckout'];
      const paymentMethod = {
        id: 'FastCheckoutPaymentMethodID',
        displayName: 'Fast Checkout PaymentMethod',
        serviceId: 'FastCheckoutPaymentMethodID',
        capabilities: paymentMethodCapabilities,
      } as PaymentMethod;
      const condition = {
        checkoutStep: 'shipping',
        isGuestCheckoutEnabled: false,
        anonymous: true,
      } as CheckoutPaymentCondition;

      let result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();

      condition.checkoutStep = 'basket';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();

      condition.anonymous = false;
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeTrue();

      condition.checkoutStep = 'payment';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();
    });

    it(`should only displayed on payment page PaymentMethod has RedirectBeforeCheckout capability`, () => {
      const paymentMethodCapabilities = ['blubber', 'RedirectBeforeCheckout'];
      const paymentMethod = {
        id: 'FastCheckoutPaymentMethodID',
        displayName: 'Fast Checkout PaymentMethod',
        serviceId: 'FastCheckoutPaymentMethodID',
        capabilities: paymentMethodCapabilities,
      } as PaymentMethod;
      const condition = { checkoutStep: 'shipping' } as CheckoutPaymentCondition;

      let result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();

      condition.checkoutStep = 'basket';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();

      condition.checkoutStep = 'payment';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeTrue();
    });

    it(`should displayed on both page if payment is selected on basket page`, () => {
      const paymentMethodCapabilities = ['FastCheckout', 'blubber', 'RedirectBeforeCheckout'];
      const paymentMethod = {
        id: 'FastCheckoutPaymentMethodID',
        displayName: 'Fast Checkout PaymentMethod',
        serviceId: 'FastCheckoutPaymentMethodID',
        capabilities: paymentMethodCapabilities,
      } as PaymentMethod;
      const condition = {
        checkoutStep: 'shipping',
        appliedPaymentInstrumentId: paymentMethod.id,
      } as CheckoutPaymentCondition;

      let result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeFalse();

      condition.checkoutStep = 'basket';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeTrue();

      condition.checkoutStep = 'payment';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(paymentMethod, condition);
      expect(result).toBeTrue();
    });
  });
});
