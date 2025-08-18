import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  concatMap,
  filter,
  firstValueFrom,
  map,
  race,
  shareReplay,
  take,
  timer,
} from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { whenTruthy } from 'ish-core/utils/operators';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let paypal: any;

/**
 * The Payment PayPal Component embeds a paypal script so paypal buttons are rendered within an iframe at a given container. See also {@link CheckoutPaymentPageComponent}
 *
 */
@Component({
  selector: 'ish-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalComponent implements OnInit {
  @Output() selectPaypalPaymentMethod = new EventEmitter<string>(); // paymentInstrumentId

  //  readonly paypalClientId = 'AakT4mm7rS4EiUD5sVxzOZRYTxkMqc0D8TeYPYCFu2KmJvt0NkpCz7CX73KBzcAfhiNR0u2k62Hdh_yX';
  readonly paypalButtonsContainerId = '#paypal-buttons-container';
  readonly paypalMessagesContainerId = '#paypal-messages-container';
  readonly paypalButtonStyle = {
    layout: 'horizontal',
    shape: 'sharp',
    label: 'paypal',
    height: 45,
    tagline: false,
  };

  scriptLoaded$ = new BehaviorSubject<boolean>(false);
  paypalClientId$ = new BehaviorSubject<string>(undefined);

  basket$ = this.checkoutFacade.basket$.pipe(shareReplay(1));

  private destroyRef = inject(DestroyRef);

  constructor(
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private scriptLoader: ScriptLoaderService
  ) {}

  ngOnInit() {
    this.loadScript();
  }

  /**
   * load concardis script if component is visible
   */
  private loadScript() {
    combineLatest([
      this.appFacade.currentLocale$.pipe(whenTruthy()),
      this.appFacade.currentCurrency$.pipe(whenTruthy()),
      this.basket$.pipe(whenTruthy()),
      this.checkoutFacade.eligiblePaypalPaymentMethod$.pipe(whenTruthy()),
    ])
      .pipe(
        take(1),
        concatMap(([locale, currency, basket, paypalPaymentMethod]) => {
          const paypalClientId = AttributeHelper.getAttributeValueByAttributeName<string>(
            paypalPaymentMethod.hostedPaymentPageParameters,
            'client-id'
          );

          if (paypalClientId) {
            this.paypalClientId$.next(paypalClientId);
            return this.scriptLoader
              .load(
                `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&components=buttons,messages&locale=${locale}&currency=${currency}`
              )
              .pipe(map(() => ({ locale, currency, basket, paypalPaymentMethod })));
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ basket, paypalPaymentMethod }) => {
          console.log('script loaded');
          if (paypal?.Buttons) {
            this.scriptLoaded$.next(true);

            const component = this;

            paypal
              .Buttons({
                style: this.paypalButtonStyle,
                // Call your server to set up the transaction
                createOrder(data: { paymentSource: string }) {
                  component.selectPaypalPaymentMethod.emit(
                    paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId
                  );
                  console.log(data);
                  /*    return fetch('/demo/checkout/api/paypal/order/create/', {
                    method: 'post',
                  })
                    .then(res => res.json())
                    .then(orderData => orderData.id); */
                  return firstValueFrom(component.getPaypalOrderId$().pipe(take(1)));
                },
              })
              .render(this.paypalButtonsContainerId);
          }
          if (paypal?.Messages) {
            this.scriptLoaded$.next(true);
            paypal
              .Messages({
                amount: basket.totals?.total?.gross,
                placement: 'cart',
                style: {
                  layout: 'text',
                  color: 'black',
                },
              })
              .render(this.paypalMessagesContainerId)
              .catch((error: string) => {
                console.error('PayPal Messages render failed:', error);
              });
          }
        },
        error: error => {
          console.log(error);
        },
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
      timer(4000).pipe(map(() => ''))
    );
  }

  /**
   * call back function to initialize iframes for cardNumber and cvc
   */
  // visible-for-testing
  initCallback() {}

  /**
   * call back function to submit data, get a response token from provider and send data in case of success
   */
  // visible-for-testing
  submitCallback() {
    // this.paymentConcardisComponent.submitCallback();
  }
}
