import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, concatMap, map, take } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
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
  readonly paypalClientId = 'AakT4mm7rS4EiUD5sVxzOZRYTxkMqc0D8TeYPYCFu2KmJvt0NkpCz7CX73KBzcAfhiNR0u2k62Hdh_yX';
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
      this.checkoutFacade.basket$.pipe(whenTruthy()),
    ])
      .pipe(
        take(1),
        concatMap(([locale, currency, basket]) =>
          this.scriptLoader
            .load(
              `https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}&components=buttons,messages&locale=${locale}&currency=${currency}`
            )
            .pipe(map(() => ({ locale, currency, basket })))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ basket }) => {
          console.log('script loaded');
          if (paypal?.Buttons) {
            this.scriptLoaded$.next(true);
            paypal
              .Buttons({
                style: this.paypalButtonStyle,
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
