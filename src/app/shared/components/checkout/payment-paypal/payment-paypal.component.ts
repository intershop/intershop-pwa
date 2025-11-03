import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  firstValueFrom,
  map,
  race,
  shareReplay,
  switchMap,
  take,
  timer,
  withLatestFrom,
} from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalButtonsPageType, PaypalConfigService } from 'ish-core/utils/paypal-config/paypal-config.service';

import { PAYPAL_BUTTON_STYLING } from './payment-paypal.component.styling';

/**
 * PayPal Payment Component for handling PayPal button integration and checkout flow.
 *
 * This component manages the PayPal SDK integration for both standard checkout and express checkout flows.
 *
 * The component integrates with the checkout process by:
 * 1. Loading appropriate PayPal scripts based on payment method configuration
 * 2. Rendering PayPal buttons in designated containers
 * 3. Handling payment flow through PayPal's hosted checkout
 * 4. Managing basket updates and navigation upon completion
 *
 * @see {@link PaypalConfigService} - PayPal configuration and script loading
 */
@Component({
  selector: 'ish-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * The type of page where the component is displayed.
   * Determines which PayPal message styling and configuration to use.
   */
  @Input() pageType: PaypalButtonsPageType = 'cart';

  /**
   * Event emitted when a PayPal payment method is selected.
   * Emits the payment instrument ID for the selected PayPal payment method.
   */
  @Output() selectPaypalPaymentMethod = new EventEmitter<string>();

  private readonly paypalButtonsContainerId = '#paypal-buttons-container';

  isPaypalPaymentMethodSelected$: Observable<boolean>;
  scriptLoaded$ = new BehaviorSubject<boolean>(undefined);

  private basket$ = this.checkoutFacade.basket$.pipe(whenTruthy(), shareReplay(1));
  private paypalPaymentMethod$: Observable<PaymentMethod>;

  /** References to PayPal component instances for proper cleanup */
  private paypalButtonsComponent: { close?(): void } | undefined;

  private destroyRef = inject(DestroyRef);

  constructor(
    private checkoutFacade: CheckoutFacade,
    private ngZone: NgZone,
    private router: Router,
    private paypalConfigService: PaypalConfigService
  ) {}

  ngOnInit(): void {
    this.paypalPaymentMethod$ = this.checkoutFacade
      .paypalPaymentMethod$(this.pageType === 'cart' ? 'FastCheckout' : 'RedirectBeforeCheckout')
      .pipe(whenTruthy(), shareReplay(1));
    this.isPaypalPaymentMethodSelected$ = combineLatest({
      method: this.paypalPaymentMethod$,
      basket: this.basket$,
    }).pipe(map(({ method, basket }) => method?.paymentInstruments[0]?.id === basket?.payment?.paymentInstrument?.id));
  }

  ngAfterViewInit() {
    this.loadScript();
  }

  /**
   * Loads PayPal SDK script and initializes payment buttons.
   */
  private loadScript() {
    this.paypalPaymentMethod$
      .pipe(
        filter(paymentMethod => !!paymentMethod.hostedPaymentPageParameters?.length),
        take(1),
        switchMap(paypalPaymentMethod =>
          this.paypalConfigService
            .loadPayPalScript(this.getNameSpace(paypalPaymentMethod), {
              paymentMethod: paypalPaymentMethod,
              page: this.pageType,
              type: 'button',
            })
            .pipe(
              withLatestFrom(this.basket$),
              map(([, basket]) => ({
                basket,
                paypalPaymentMethod,
              }))
            )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ basket, paypalPaymentMethod }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const paypalObject = (window as any)[this.getNameSpace(paypalPaymentMethod)];
          if (paypalObject?.Buttons) {
            const paypalButtonsConfig = paypalObject.Buttons(
              this.pageType === 'checkout'
                ? this.initializePaypalCheckoutButton(basket, paypalPaymentMethod)
                : this.initializePaypalExpressButton(paypalPaymentMethod)
            );
            this.paypalButtonsComponent = paypalButtonsConfig.render(this.paypalButtonsContainerId);
          }
          this.scriptLoaded$.next(true);
        },
        error: () => {
          this.scriptLoaded$.next(false);
        },
      });
  }

  private getNameSpace(paymentMethod: PaymentMethod): string {
    return 'PayPal_iframe_'.concat(paymentMethod.id, '_button');
  }

  /**
   * Initializes PayPal checkout button for standard checkout flow.
   *
   * Creates and renders PayPal payment buttons with proper event handlers for:
   * - Order creation with basket totals
   * - Payment approval and processing
   * - Shipping address change handling
   * - Error and cancellation scenarios
   *
   * @param basket - Current shopping basket
   * @param paypalPaymentMethod - PayPal payment method configuration
   */
  private initializePaypalCheckoutButton(basket: Basket, paypalPaymentMethod: PaymentMethod) {
    let isShippingAddressChanged = false;

    return {
      style: PAYPAL_BUTTON_STYLING.checkout,
      // Call your server to set up the transaction after the user has clicked the button
      createOrder: (data: { paymentSource: string }) => {
        isShippingAddressChanged = false;
        // eslint-disable-next-line no-console
        console.info('createOrder', data);
        return this.createOrder(paypalPaymentMethod);
      },
      // after the user has submitted the payment in the paypal overlay
      onApprove: (data: { payerID: string; orderID: string }) => {
        this.onApprove(data, isShippingAddressChanged);
      },
      // in case the shipping address was changed in the paypal overlay
      onShippingAddressChange: (data: {
        shippingAddress: { city: string; countryCode: string; postalCode: string; state: string };
      }) => {
        const normalize = (val: string) => val?.trim()?.toLowerCase();
        const basketAddress = basket?.commonShipToAddress;
        const shippingAddress = data?.shippingAddress;

        isShippingAddressChanged =
          normalize(basketAddress?.country) !== normalize(shippingAddress?.countryCode) &&
          normalize(basketAddress?.postalCode) !== normalize(shippingAddress?.postalCode) &&
          normalize(basketAddress?.city) !== normalize(shippingAddress?.city);
        // no state comparison, because it is not available in the basket and also not always provided by paypal
      },
      // after the user has cancelled the payment in the paypal overlay
      onCancel: () => {
        this.onCancel('/checkout/payment', paypalPaymentMethod.paymentInstruments[0]);
      },
      // show a generic error message in case of an error
      onError: () => {
        this.onError('/checkout/payment');
      },
    };
  }

  /**
   * Initializes PayPal express checkout button for quick payment from product/basket pages.
   *
   * Creates and renders PayPal express payment buttons that allow customers to:
   * - Make payments without going through full checkout process
   * - Handle order creation and payment approval
   * - Navigate directly to basket upon completion
   * - Display appropriate error messages for failures
   *
   * @param paypalPaymentMethod - PayPal payment method configuration
   */
  private initializePaypalExpressButton(paypalPaymentMethod: PaymentMethod) {
    return {
      style: PAYPAL_BUTTON_STYLING.cart,
      // Call your server to set up the transaction after the user has clicked the button
      createOrder: (data: { paymentSource: string }) => {
        // eslint-disable-next-line no-console
        console.log('createOrder', data);
        return this.createOrder(paypalPaymentMethod);
      },
      // after the user has submitted the payment in the paypal overlay
      onApprove: (data: { payerID: string; orderID: string }) => {
        // shippingAddressChanged is always true, because shipping address is not known before
        this.onApprove(data, true);
      },
      // after the user has cancelled the payment in the paypal overlay
      onCancel: () => {
        this.onCancel('/basket', paypalPaymentMethod.paymentInstruments[0]);
      },
      // show a generic error message in case of an error
      onError: () => {
        this.onError('/basket');
      },
    };
  }

  private createOrder(paypalPaymentMethod: PaymentMethod) {
    this.selectPaypalPaymentMethod.emit(paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId);
    return firstValueFrom(this.getPaypalOrderId$().pipe(take(1)));
  }

  private onApprove(data: { payerID: string; orderID: string }, shippingAddressChanged: boolean) {
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

  private onCancel(navigationTarget: string, paymentInstrument: PaymentInstrument) {
    if (paymentInstrument) {
      this.checkoutFacade.deleteBasketPayment(paymentInstrument);
    }
    this.ngZone.run(() => {
      this.router.navigate([navigationTarget], { queryParams: { redirect: 'cancel' } });
    });
  }

  private onError(navigationTarget: string) {
    this.ngZone.run(() => {
      this.router.navigate([navigationTarget], { queryParams: { redirect: 'failure' } });
    });
  }

  private getPaypalOrderId$(): Observable<string> {
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
      timer(4000).pipe(map(() => ''))
    );
  }

  /**
   * Component cleanup lifecycle hook.
   *
   * Properly cleans up PayPal components and removes the loaded script from the DOM
   * when the component is destroyed. This prevents memory leaks, zoid errors, and
   * ensures clean component lifecycle management.
   *
   * The cleanup process:
   * 1. Closes active PayPal button components to prevent zoid destruction errors
   * 2. Closes active PayPal message components to clean up rendering state
   * 3. Removes the PayPal script from the DOM to free memory
   *
   * This is especially important for PayPal scripts which can be large and contain
   * global state that should be cleaned up properly to avoid conflicts.
   */
  ngOnDestroy(): void {
    // Clean up PayPal components before removing the script to prevent zoid errors
    try {
      if (this.paypalButtonsComponent?.close) {
        this.paypalButtonsComponent.close();
      }
    } catch (error) {
      // Ignore cleanup errors - components may already be destroyed
      console.warn('PayPal component cleanup warning:', error);
    }
  }
}
