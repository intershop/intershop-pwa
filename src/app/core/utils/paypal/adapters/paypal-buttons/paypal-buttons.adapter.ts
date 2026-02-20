import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, race, take, timer } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_BUTTON_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import { PaypalComponent } from 'ish-core/utils/paypal/paypal-model/paypal.model';

interface PaypalShippingAddress {
  city: string;
  countryCode: string;
  postalCode: string;
  state: string;
}

/**
 * Representation of the PayPal SDK Buttons object, responsible for rendering PayPal buttons and handling the associated callbacks for order creation, approval, cancellation, and error handling.
 * Life cycle of this component ends with destroying of parent component PaymentPaypalComponent.
 */
@Injectable()
export class PaypalButtonsAdapter {
  paypalShippingAddress: PaypalShippingAddress;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Renders PayPal buttons in the specified container and sets up the necessary callbacks for order creation, approval, cancellation, and error handling.
   * @param config
   * @returns
   */
  renderButtons(config: PaypalComponentsConfig): Promise<void> {
    const containerId = config.containerId;
    const paypalObject = (window as unknown as Record<string, PaypalComponent>)[config.scriptNamespace];
    // Verify element exists right before rendering
    if (!this.document.getElementById(containerId)) {
      throw new Error(`Container element '${containerId}' does not exist in DOM`);
    }

    if (!paypalObject?.Buttons) {
      throw new Error(
        `PayPal Buttons not available in loaded paypal sdk script with namespace '${config.scriptNamespace}'`
      );
    }

    return paypalObject.Buttons(this.getButtonConfig(config)).render(`#${containerId}`);
  }

  private getButtonConfig(config: PaypalComponentsConfig) {
    return {
      style: config.pageType === 'checkout' ? PAYPAL_BUTTON_STYLING.checkout : PAYPAL_BUTTON_STYLING.cart,
      createOrder: () => this.createOrderCallback(config.paypalPaymentMethod),
      onApprove: (data: { payerID: string; orderID: string }) => {
        this.onApproveCallback(data);
      },
      // in case the shipping address was changed in the paypal overlay
      onShippingAddressChange: (data: { shippingAddress: PaypalShippingAddress }) => {
        this.paypalShippingAddress = data?.shippingAddress;
      },
      // after the user has cancelled the payment in the paypal overlay
      onCancel: () => {
        this.onCancelCallback(config);
      },
      // show a generic error message in case of an error
      onError: () => {
        this.onErrorCallback(config);
      },
    };
  }

  protected createOrderCallback(paypalPaymentMethod: PaymentMethod): Promise<string> {
    this.checkoutFacade.setBasketPayment(
      paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId
    );
    return new Promise((resolve, reject) => {
      race(
        this.checkoutFacade.basket$.pipe(
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
      ).subscribe({
        next: orderID => resolve(orderID),
        error: error => reject(error),
      });
    });
  }

  protected onApproveCallback(data: { payerID: string; orderID: string }) {
    this.checkoutFacade.basket$.pipe(take(1)).subscribe(basket => {
      const basketAddress = basket?.commonShipToAddress;
      let shippingAddressChanged = false;

      if (this.paypalShippingAddress && basketAddress) {
        const normalize = (val: string) => val?.trim()?.toLowerCase();
        shippingAddressChanged =
          normalize(basketAddress.country) !== normalize(this.paypalShippingAddress.countryCode) ||
          normalize(basketAddress.postalCode) !== normalize(this.paypalShippingAddress.postalCode) ||
          normalize(basketAddress.city) !== normalize(this.paypalShippingAddress.city);
      } else if (this.paypalShippingAddress && !basketAddress) {
        // If PayPal has an address but basket doesn't, address has changed
        shippingAddressChanged = true;
      }

      this.router.navigate(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: data.orderID,
          PayerID: data.payerID,
          shippingAddressChanged,
        },
      });
    });
  }

  protected onCancelCallback(config: PaypalComponentsConfig) {
    if (config.paypalPaymentMethod.paymentInstruments[0]) {
      this.checkoutFacade.deleteBasketPayment(config.paypalPaymentMethod.paymentInstruments[0]);
    }

    this.router.navigate(
      [config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? '/basket' : '/checkout/payment'],
      { queryParams: { redirect: 'cancel' } }
    );
  }

  protected onErrorCallback(config: PaypalComponentsConfig) {
    this.router.navigate(
      [config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? '/basket' : '/checkout/payment'],
      { queryParams: { redirect: 'failure' } }
    );
  }
}
