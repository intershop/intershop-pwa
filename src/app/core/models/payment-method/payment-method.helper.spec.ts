import { PaymentMethodHelper } from './payment-method.helper';

describe('Payment Method Helper', () => {
  describe('shouldShowOnCheckoutStep', () => {
    it(`should only displayed on basket page if PaymentMethod has FastCheckout capability`, () => {
      const capabilities = ['FastCheckout', 'blubber', 'RedirectBeforeCheckout'];
      let focus = 'shipping';

      let result = PaymentMethodHelper.shouldShowOnCheckoutStep(capabilities, focus);
      expect(result).toBeFalse();

      focus = 'basket';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(capabilities, focus);
      expect(result).toBeTrue();

      focus = 'payment';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(capabilities, focus);
      expect(result).toBeFalse();
    });

    it(`should only displayed on payment page PaymentMethod has RedirectBeforeCheckout capability`, () => {
      const capabilities = ['blubber', 'RedirectBeforeCheckout'];
      let focus = 'shipping';

      let result = PaymentMethodHelper.shouldShowOnCheckoutStep(capabilities, focus);
      expect(result).toBeFalse();

      focus = 'basket';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(capabilities, focus);
      expect(result).toBeFalse();

      focus = 'payment';
      result = PaymentMethodHelper.shouldShowOnCheckoutStep(capabilities, focus);
      expect(result).toBeTrue();
    });
  });
});
