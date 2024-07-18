import {
  CheckoutPaymentCondition,
  PAYMENT_METHOD_TYPE_CHECKOUT_ASSIGNMENT,
  PaymentMethod,
} from './payment-method.model';

/**
 * Auxiliary method for determining which payment method is displayed at which point in the checkout process.
 */
export class PaymentMethodHelper {
  static shouldShowOnCheckoutStep(paymentMethod: PaymentMethod, condition?: CheckoutPaymentCondition): boolean {
    let shouldShow = false;
    const capabilities = paymentMethod.capabilities;

    // on basket detail page
    const allowedBasketCapabilities = <string[]>PAYMENT_METHOD_TYPE_CHECKOUT_ASSIGNMENT.get('basket');
    if (condition.checkoutStep.endsWith('basket')) {
      shouldShow = capabilities?.find(c => allowedBasketCapabilities.includes(c))?.length > 0;
      return condition.anonymous && !condition.isGuestCheckoutEnabled ? false : shouldShow;
    }

    //on checkout payment page
    const allowedPaymentCapabilities = <string[]>PAYMENT_METHOD_TYPE_CHECKOUT_ASSIGNMENT.get('payment');

    if (condition.checkoutStep.endsWith('payment')) {
      if (!capabilities && allowedPaymentCapabilities.includes('')) {
        return true;
      }
      capabilities.forEach(c => (shouldShow = allowedPaymentCapabilities.includes(c)));

      // check payment method contains capabilities which are only used for basket detail page
      if (shouldShow) {
        shouldShow = !(capabilities.find(c => allowedBasketCapabilities.includes(c))?.length > 0);
      }
      return condition.appliedPaymentInstrumentId?.endsWith(paymentMethod.id) ? true : shouldShow;
    }

    return shouldShow;
  }
}
