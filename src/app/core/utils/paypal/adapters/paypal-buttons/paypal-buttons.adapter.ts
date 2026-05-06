import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, race, switchMap, take, tap, timer } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_BUTTON_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import { PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';

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
  serviceAvailable = true;

  constructor(
    private ngZone: NgZone,
    private checkoutFacade: CheckoutFacade,
    private paypalConfigService: PaypalConfigService,
    private paypalDataTransferService: PaypalDataTransferService,
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
    const paypalObject = this.paypalConfigService.getPaypalComponent(config.paypalPaymentMethod);
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
      createOrder: () => this.ngZone.run(() => this.createOrderCallback(config.paypalPaymentMethod)),
      onApprove: (data: { payerID: string; orderID: string }) => {
        this.ngZone.run(() => this.onApproveCallback(data));
      },
      // in case the shipping address was changed in the paypal overlay
      onShippingAddressChange: (data: { shippingAddress: PaypalShippingAddress }) => {
        this.paypalShippingAddress = data?.shippingAddress;
      },
      // after the user has cancelled the payment in the paypal overlay
      onCancel: () => {
        this.ngZone.run(() => this.onAbortCallback(config, 'cancel'));
      },
      onError: () => {
        this.ngZone.run(() => this.onAbortCallback(config, this.serviceAvailable ? 'failure' : 'unavailable'));
      },
    };
  }

  protected createOrderCallback(paypalPaymentMethod: PaymentMethod): Promise<string> {
    const orderIdPromise = new Promise<string>((resolve, reject) => {
      race(
        this.paypalDataTransferService.paypalOrder$.pipe(
          map(data => data.paypalOrderId),
          take(1)
        ),
        timer(30000).pipe(
          map(() => {
            throw new Error('PayPal order ID not available');
          })
        )
      ).subscribe({
        next: paypalOrderId => {
          if (paypalOrderId && paypalOrderId.trim() !== '') {
            resolve(paypalOrderId);
          } else {
            this.serviceAvailable = false;
            reject(new Error('PayPal order ID is empty'));
          }
        },
        error: error => reject(error),
      });
    });

    this.checkoutFacade.loadPaypalToken(paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId);

    return orderIdPromise;
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

  protected onAbortCallback(config: PaypalComponentsConfig, reason: 'cancel' | 'failure' | 'unavailable') {
    if (!config.paypalPaymentMethod?.paymentInstruments?.length) {
      return;
    }

    this.checkoutFacade.basket$
      .pipe(
        take(1),
        tap(basket => {
          if (basket.payment?.paymentInstrument?.id === config.paypalPaymentMethod.paymentInstruments[0]?.id) {
            this.checkoutFacade.deleteBasketPayment(config.paypalPaymentMethod.paymentInstruments[0]);
          }
        }),
        switchMap(() => this.checkoutFacade.basket$),
        filter(basket => !basket.payment),
        take(1)
      )
      .subscribe(() => {
        this.router.navigate(
          [config.paypalPaymentMethod.capabilities.includes('FastCheckout') ? '/basket' : '/checkout/payment'],
          { queryParams: { redirect: reason } }
        );
      });
  }
}
