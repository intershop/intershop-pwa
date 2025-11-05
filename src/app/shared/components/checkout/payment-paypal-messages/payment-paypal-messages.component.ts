import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, distinctUntilChanged, filter, map, of, switchMap, take } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalConfigService, PaypalPageType } from 'ish-core/utils/paypal-config/paypal-config.service';

import { PAYPAL_MESSAGE_STYLING } from './payment-paypal-messages.component.styling';

/**
 * Component for displaying PayPal Pay Later messages on different pages.
 *
 * This component dynamically loads PayPal SDK and renders promotional messages that inform customers about PayPal financing options.
 * The messages are contextual and can display different content based on the page type and current amount.
 * They can be styled using the PAYPAL_MESSAGE_STYLING configuration of payment-paypal-messages.styling.component.ts.
 */

@Component({
  selector: 'ish-payment-paypal-messages',
  templateUrl: './payment-paypal-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalMessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * The type of page where the component is displayed.
   * Determines which PayPal message styling and configuration to use.
   */
  @Input() pageType: PaypalPageType = 'cart';

  /** DOM selector for the PayPal messages container element */
  readonly paypalMessagesContainerId = 'paypal-messages-container';

  /** Observable indicating whether the PayPal script has been loaded and messages rendered */
  scriptLoaded$ = new BehaviorSubject<boolean>(undefined);

  /** Reference to PayPal messages component instance for proper cleanup */
  private paypalMessagesComponent: { close?(): void } | undefined;

  /** Observable stream for the current amount to display in messages */
  private amount$: Observable<number>;

  private destroyRef = inject(DestroyRef);
  private productContext = inject(ProductContextFacade, { optional: true });

  constructor(private checkoutFacade: CheckoutFacade, private paypalConfigService: PaypalConfigService) {}

  ngOnInit(): void {
    // The amount is used to display contextually relevant PayPal financing messages that show potential payment options based on the current transaction value.
    this.amount$ =
      this.pageType === 'product-details' && !!this.productContext
        ? this.productContext.select('prices').pipe(map(prices => prices?.salePrice?.value ?? 0))
        : this.pageType === 'cart' || this.pageType === 'checkout'
        ? this.checkoutFacade.basket$.pipe(map(basket => basket?.totals?.total?.gross ?? 0))
        : of(0);
  }

  ngAfterViewInit() {
    this.loadScript();
  }

  private loadScript() {
    const nameSpace = 'PayPal_iframe_message';

    // make sure payment method is configured
    this.checkoutFacade
      .paypalPaymentMethod$()
      .pipe(
        whenTruthy(),
        filter(paymentMethod => !!paymentMethod.hostedPaymentPageParameters?.length),
        take(1),
        switchMap(paymentMethod =>
          this.paypalConfigService
            .loadPayPalScript(nameSpace, {
              paymentMethod,
              page: this.pageType,
              type: 'message',
            })
            .pipe(switchMap(() => this.amount$.pipe(distinctUntilChanged())))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (amount: number) => {
          this.scriptLoaded$.next(true);
          this.renderPaypalMessages(amount, nameSpace);
        },
        error: () => {
          this.scriptLoaded$.next(false);
        },
      });
  }

  private renderPaypalMessages(amount: number, nameSpace: string) {
    let messageConfig;

    switch (this.pageType) {
      case 'home':
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.home };
        break;
      case 'product-listing':
        messageConfig = { style: PAYPAL_MESSAGE_STYLING.category };
        break;
      case 'product-details':
        messageConfig = { amount, style: PAYPAL_MESSAGE_STYLING.product };
        break;
      case 'checkout':
        messageConfig = { amount, style: PAYPAL_MESSAGE_STYLING.checkout };
        break;
      default:
        messageConfig = { amount, style: PAYPAL_MESSAGE_STYLING.cart };
        break;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paypalObject = (window as any)[nameSpace];
    if (paypalObject?.Messages) {
      this.paypalMessagesComponent = paypalObject
        .Messages({ ...messageConfig, pageType: this.pageType })
        .render(`#${this.paypalMessagesContainerId}`)
        .catch((error: string) => {
          console.error('PayPal Messages render failed:', error);
        });
    }
  }

  /**
   * Cleanup method called when the component is destroyed.
   *
   * Performs proper cleanup of PayPal messages component to prevent memory leaks
   * and avoid zoid errors that can occur when PayPal components are not properly
   * disposed of before script removal.
   *
   * This method:
   * 1. Safely closes the PayPal messages component if it exists
   * 2. Handles any cleanup errors gracefully to prevent application crashes
   * 3. Logs warnings for diagnostic purposes without throwing errors
   *
   * Note: Cleanup errors are intentionally caught and logged rather than thrown,
   * as the PayPal component may already be destroyed by external factors.
   */
  ngOnDestroy(): void {
    // Clean up PayPal messages component before removing the script to prevent zoid errors
    try {
      if (this.paypalMessagesComponent?.close) {
        this.paypalMessagesComponent.close();
      }
    } catch (error) {
      // Ignore cleanup errors - component may already be destroyed
      console.warn('PayPal messages component cleanup warning:', error);
    }
  }
}
