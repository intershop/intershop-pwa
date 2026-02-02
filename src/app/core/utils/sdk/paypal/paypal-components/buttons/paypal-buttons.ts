import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, race, take, timer } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalComponentsConfig } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import { PAYPAL_BUTTON_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';
import { PaypalPageTypes } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';
import { PaypalComponent } from 'ish-core/utils/sdk/paypal/paypal-model/paypal.interface';

interface PayPalShippingAddress {
  city: string;
  countryCode: string;
  postalCode: string;
  state: string;
}

@Injectable({ providedIn: 'root' })
export class PayPalButtons {
  payPalShippingAddress: PayPalShippingAddress;

  constructor(private checkoutFacade: CheckoutFacade, private router: Router) {}

  createOrder(paypalPaymentMethod: PaymentMethod): Promise<string> {
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

  onApprove(data: { payerID: string; orderID: string }) {
    this.checkoutFacade.basket$.pipe(take(1)).subscribe(basket => {
      const basketAddress = basket?.commonShipToAddress;
      let shippingAddressChanged = false;

      if (this.payPalShippingAddress && basketAddress) {
        const normalize = (val: string) => val?.trim()?.toLowerCase();
        shippingAddressChanged =
          normalize(basketAddress.country) !== normalize(this.payPalShippingAddress.countryCode) ||
          normalize(basketAddress.postalCode) !== normalize(this.payPalShippingAddress.postalCode) ||
          normalize(basketAddress.city) !== normalize(this.payPalShippingAddress.city);
      } else if (this.payPalShippingAddress && !basketAddress) {
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

  onCancel(config: PaypalComponentsConfig) {
    if (config.paypalPaymentMethod.paymentInstruments[0]) {
      this.checkoutFacade.deleteBasketPayment(config.paypalPaymentMethod.paymentInstruments[0]);
    }

    this.router.navigate(
      [config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? '/basket' : '/checkout/payment'],
      { queryParams: { redirect: 'cancel' } }
    );
  }

  onError(config: PaypalComponentsConfig) {
    this.router.navigate(
      [config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? '/basket' : '/checkout/payment'],
      { queryParams: { redirect: 'failure' } }
    );
  }

  renderButtons(config: PaypalComponentsConfig): Promise<void> {
    const containerId = config.containerId;
    const paypalObject = (window as unknown as Record<string, PaypalComponent>)[config.scriptNamespace];
    // Verify element exists right before rendering
    if (!document.getElementById(containerId)) {
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
      style:
        config.pageType === PaypalPageTypes.CheckoutPayment
          ? PAYPAL_BUTTON_STYLING.checkout
          : PAYPAL_BUTTON_STYLING.cart,
      createOrder: () => this.createOrder(config.paypalPaymentMethod),
      onApprove: (data: { payerID: string; orderID: string }) => {
        this.onApprove(data);
      },
      // in case the shipping address was changed in the paypal overlay
      onShippingAddressChange: (data: { shippingAddress: PayPalShippingAddress }) => {
        this.payPalShippingAddress = data?.shippingAddress;
      },
      // after the user has cancelled the payment in the paypal overlay
      onCancel: () => {
        this.onCancel(config);
      },
      // show a generic error message in case of an error
      onError: () => {
        this.onError(config);
      },
    };
  }
}
