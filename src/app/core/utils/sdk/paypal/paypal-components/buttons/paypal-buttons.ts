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
import { PaypalComponent } from 'ish-core/utils/sdk/paypal/paypal-model/paypal.interface';

export class PayPalButtons {
  isShippingAddressChanged = false;

  constructor(
    private config: PaypalComponentsConfig,
    private basket: Basket,
    private checkoutFacade: CheckoutFacade,
    private ngZone: NgZone,
    private router: Router
  ) {}

  async createOrder(paypalPaymentMethod: PaymentMethod): Promise<string> {
    this.config.selectPaypalPaymentMethod(
      paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId
    );
    return firstValueFrom(this.getPaypalOrderId$().pipe(take(1)));
  }

  async onApprove(data: { payerID: string; orderID: string }, shippingAddressChanged: boolean): Promise<void> {
    // ngZone is needed to navigate outside of the Angular zone in a callback function
    this.ngZone.run(() => {
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

  async onCancel(navigationTarget: string, paymentInstrument: PaymentInstrument): Promise<void> {
    if (paymentInstrument) {
      this.checkoutFacade.deleteBasketPayment(paymentInstrument);
    }
    this.ngZone.run(() => {
      this.router.navigate([navigationTarget], { queryParams: { redirect: 'cancel' } });
    });
  }

  async onError(navigationTarget: string): Promise<void> {
    this.ngZone.run(() => {
      this.router.navigate([navigationTarget], { queryParams: { redirect: 'failure' } });
    });
  }

  getPaypalOrderId$(): Observable<string> {
    return race(
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
    );
  }

  async renderButtons(): Promise<void> {
    // Access PayPal SDK from window object
    const paypalObject = (window as unknown as Record<string, PaypalComponent>)[this.config.scriptNamespace];

    if (!paypalObject?.Buttons) {
      return Promise.reject(new Error(`PayPal Buttons not available on namespace '${this.config.scriptNamespace}'`));
    }

    try {
      // Verify element still exists right before rendering
      const container = document.getElementById(this.config.containerId);
      if (!container) {
        throw new Error(`Container element '${this.config.containerId}' no longer exists in DOM`);
      }

      const button = paypalObject.Buttons({
        style: this.config.pageType === 'checkout' ? PAYPAL_BUTTON_STYLING.checkout : PAYPAL_BUTTON_STYLING.cart,
        createOrder: () => this.ngZone.run(() => this.createOrder(this.config.paypalPaymentMethod)),
        onApprove: (data: { payerID: string; orderID: string }) =>
          this.ngZone.run(() =>
            this.onApprove(
              data,
              this.config.paypalPaymentMethod.capabilities.includes('FastCheckout')
                ? true
                : this.isShippingAddressChanged
            )
          ),
        // in case the shipping address was changed in the paypal overlay
        onShippingAddressChange: (data: {
          shippingAddress: { city: string; countryCode: string; postalCode: string; state: string };
        }) => {
          const normalize = (val: string) => val?.trim()?.toLowerCase();
          const basketAddress = this.basket?.commonShipToAddress;
          const shippingAddress = data?.shippingAddress;

          this.isShippingAddressChanged =
            normalize(basketAddress?.country) !== normalize(shippingAddress?.countryCode) ||
            normalize(basketAddress?.postalCode) !== normalize(shippingAddress?.postalCode) ||
            normalize(basketAddress?.city) !== normalize(shippingAddress?.city);
          // no state comparison, because it is not available in the basket and also not always provided by paypal
        },
        // after the user has cancelled the payment in the paypal overlay
        onCancel: () => {
          this.onCancel(
            this.config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? '/basket' : '/checkout/payment',
            this.config.paypalPaymentMethod.paymentInstruments[0]
          );
        },
        // show a generic error message in case of an error
        onError: () => {
          this.onError(
            this.config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? '/basket' : '/checkout/payment'
          );
        },
      });

      // Render outside Angular zone - PayPal SDK needs direct DOM access
      await button.render(`#${this.config.containerId}`);

      return Promise.resolve();
    } catch (error) {
      console.error('PayPal buttons rendering failed:', error);
      return Promise.reject(error);
    }
  }
}
