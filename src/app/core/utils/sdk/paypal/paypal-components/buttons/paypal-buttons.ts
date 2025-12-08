import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, filter, firstValueFrom, map, race, take, timer } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalComponentsConfig } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import { PAYPAL_BUTTON_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';

/**
 * Creates configuration for PayPal Buttons component with complete checkout lifecycle handling.
 *
 * PayPal Buttons enable customers to complete their purchase using PayPal payment methods.
 * This function orchestrates the entire payment flow including order creation, approval handling,
 * address validation, cancellation, and error management.
 *
 * ## Key Features:
 *
 * ### Order Creation (createOrder)
 * - Selects PayPal as the payment method via callback
 * - Initiates order creation in the backend
 * - Retrieves PayPal order ID from basket payment redirect URL
 * - Includes 4-second timeout fallback for order ID retrieval
 *
 * ### Approval Handling (onApprove)
 * - Executes after customer approves payment in PayPal overlay
 * - Navigates to checkout review page with payment tokens
 * - Tracks shipping address changes for validation
 * - Supports both standard and FastCheckout flows
 *
 * ### Shipping Address Validation (onShippingAddressChange)
 * - Monitors address changes in PayPal overlay
 * - Compares country, postal code, and city with basket address
 * - Flags changes for backend validation during review
 *
 * ### Cancellation Handling (onCancel)
 * - Handles user cancellation in PayPal overlay
 * - Removes payment instrument from basket
 * - Returns to appropriate page (basket or payment) based on flow
 *
 * ### Error Handling (onError)
 * - Manages generic payment errors
 * - Navigates to appropriate page with failure indication
 *
 * ## Navigation Flow:
 * - **FastCheckout**: Cart → PayPal → Review (or back to Cart on cancel/error)
 * - **Standard Checkout**: Payment → PayPal → Review (or back to Payment on cancel/error)
 *
 * @param config - Component configuration including page type, payment method, and callbacks
 * @param basket - Current shopping basket with totals and addresses
 * @param checkoutFacade - Facade for basket and payment operations
 * @param ngZone - Angular zone for safe navigation in PayPal callbacks
 * @param router - Angular router for navigation after PayPal interactions
 * @returns PayPal Buttons configuration object with lifecycle event handlers
 *
 * @example
 * // Create buttons for checkout page
 * const buttonsConfig = BUTTONS(
 *   {
 *     pageType: 'checkout',
 *     paypalPaymentMethod: paymentMethod,
 *     selectPaypalPaymentMethod: (id) => facade.selectPayment(id),
 *     scriptNamespace: 'paypal',
 *     componentType: 'buttons'
 *   },
 *   currentBasket,
 *   checkoutFacade,
 *   ngZone,
 *   router
 * );
 * // Returns: { style: {...}, createOrder: fn, onApprove: fn, onShippingAddressChange: fn, onCancel: fn, onError: fn }
 */
export const BUTTONS = (
  config: PaypalComponentsConfig,
  basket: Basket,
  checkoutFacade: CheckoutFacade,
  ngZone: NgZone,
  router: Router
) => {
  let isShippingAddressChanged = false;

  /**
   * Initiates PayPal order creation and retrieves the PayPal order ID.
   *
   * This function is called when the customer clicks the PayPal button. It selects
   * PayPal as the payment method, triggers backend order creation, and waits for
   * the PayPal order ID to become available in the basket's payment redirect URL.
   *
   * @param paypalPaymentMethod - The PayPal payment method configuration
   * @returns Promise resolving to the PayPal order ID
   */
  const createOrder = (paypalPaymentMethod: PaymentMethod) => {
    config.selectPaypalPaymentMethod(paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId);
    return firstValueFrom(getPaypalOrderId$().pipe(take(1)));
  };

  /**
   * Handles successful payment approval in the PayPal overlay.
   *
   * After the customer approves the payment, this function navigates to the checkout
   * review page with the necessary payment tokens and shipping address change flag.
   * Uses NgZone to ensure navigation occurs within Angular's zone for proper change detection.
   *
   * @param data - Payment data from PayPal including payer and order IDs
   * @param shippingAddressChanged - Flag indicating if shipping address was modified in PayPal overlay
   */
  const onApprove = (data: { payerID: string; orderID: string }, shippingAddressChanged: boolean) => {
    // ngZone is needed to navigate outside of the Angular zone in a callback function
    ngZone.run(() => {
      router.navigate(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: data.orderID,
          PayerID: data.payerID,
          shippingAddressChanged,
        },
      });
    });
  };

  /**
   * Handles user cancellation of the PayPal payment flow.
   *
   * When the customer cancels in the PayPal overlay, this function cleans up the
   * payment instrument from the basket and navigates back to the appropriate page
   * (basket for FastCheckout, payment page for standard checkout).
   *
   * @param navigationTarget - The URL path to navigate to after cancellation
   * @param paymentInstrument - The payment instrument to remove from basket (if exists)
   */
  const onCancel = (navigationTarget: string, paymentInstrument: PaymentInstrument) => {
    if (paymentInstrument) {
      checkoutFacade.deleteBasketPayment(paymentInstrument);
    }
    ngZone.run(() => {
      router.navigate([navigationTarget], { queryParams: { redirect: 'cancel' } });
    });
  };

  /**
   * Handles generic errors during the PayPal payment process.
   *
   * When an error occurs in the PayPal flow, this function navigates to the
   * appropriate page with a failure indication. The navigation target depends
   * on whether FastCheckout or standard checkout is being used.
   *
   * @param navigationTarget - The URL path to navigate to after error
   */
  const onError = (navigationTarget: string) => {
    ngZone.run(() => {
      router.navigate([navigationTarget], { queryParams: { redirect: 'failure' } });
    });
  };

  /**
   * Retrieves the PayPal order ID from the basket's payment redirect URL.
   *
   * This function waits for the basket to be updated with PayPal payment information
   * after order creation. It extracts the order token from the redirect URL and includes
   * a 4-second timeout as a fallback to prevent indefinite waiting.
   *
   * The function uses a race condition between:
   * - Basket updates with valid PayPal payment and redirect URL
   * - A 4-second timer returning empty string as fallback
   *
   * @returns Observable that emits the PayPal order ID or empty string on timeout
   */
  const getPaypalOrderId$ = (): Observable<string> =>
    race(
      checkoutFacade.basket$.pipe(
        whenTruthy(),
        filter(
          basket =>
            basket.payment?.capabilities?.includes('PaypalCheckout') && basket.payment.redirectUrl?.includes('token=')
        ),
        map(basket => basket.payment.redirectUrl.split('token=')[1]),
        take(1)
      ),
      timer(4000).pipe(
        map(() => {
          throw new Error('PayPal order ID not available');
        })
      )
    );

  return {
    style: config.pageType === 'checkout' ? PAYPAL_BUTTON_STYLING.checkout : PAYPAL_BUTTON_STYLING.cart,
    // Call your server to set up the transaction after the user has clicked the button
    createOrder: () => createOrder(config.paypalPaymentMethod),
    // after the user has submitted the payment in the paypal overlay
    onApprove: (data: { payerID: string; orderID: string }) => {
      // shippingAddressChanged is always true, because shipping address is not known before
      onApprove(
        data,
        config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? true : isShippingAddressChanged
      );
    },
    // in case the shipping address was changed in the paypal overlay
    onShippingAddressChange: (data: {
      shippingAddress: { city: string; countryCode: string; postalCode: string; state: string };
    }) => {
      const normalize = (val: string) => val?.trim()?.toLowerCase();
      const basketAddress = basket?.commonShipToAddress;
      const shippingAddress = data?.shippingAddress;

      isShippingAddressChanged =
        normalize(basketAddress?.country) !== normalize(shippingAddress?.countryCode) ||
        normalize(basketAddress?.postalCode) !== normalize(shippingAddress?.postalCode) ||
        normalize(basketAddress?.city) !== normalize(shippingAddress?.city);
      // no state comparison, because it is not available in the basket and also not always provided by paypal
    },
    // after the user has cancelled the payment in the paypal overlay
    onCancel: () => {
      onCancel(
        config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? '/basket' : '/checkout/payment',
        config.paypalPaymentMethod.paymentInstruments[0]
      );
    },
    // show a generic error message in case of an error
    onError: () => {
      onError(config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? '/basket' : '/checkout/payment');
    },
  };
};
