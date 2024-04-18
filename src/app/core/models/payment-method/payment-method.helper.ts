import { PAYMENT_METHOD_TYPE_CHECKOUT_ASSIGNMENT } from './payment-method.model';

export class PaymentMethodHelper {
  static shouldShowOnCheckoutStep(capabilities: string[], focus: string): boolean {
    let shouldShow = false;

    // on basket detail page
    const allowedBasketCapabilities = <string[]>PAYMENT_METHOD_TYPE_CHECKOUT_ASSIGNMENT.get('basket');
    if (focus === 'basket') {
      shouldShow = capabilities?.find(c => allowedBasketCapabilities.includes(c))?.length > 0;
      return shouldShow;
    }

    //on checkout payment page
    const allowedPaymentCapabilities = <string[]>PAYMENT_METHOD_TYPE_CHECKOUT_ASSIGNMENT.get('payment');

    if (focus === 'payment') {
      if (!capabilities && allowedPaymentCapabilities.includes('')) {
        return true;
      }
      capabilities.forEach(c => (shouldShow = allowedPaymentCapabilities.includes(c)));

      // check payment method contains capabilities which are only used for basket detail page
      if (shouldShow) {
        shouldShow = !(capabilities.find(c => allowedBasketCapabilities.includes(c))?.length > 0);
      }
      return shouldShow;
    }
  }
}
