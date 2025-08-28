import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  NgZone,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
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
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Basket } from 'ish-core/models/basket/basket.model';
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
  styleUrls: ['./payment-paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalComponent implements AfterViewInit {
  @Output() selectPaypalPaymentMethod = new EventEmitter<string>(); // paymentInstrumentId

  //  readonly paypalClientId = 'AakT4mm7rS4EiUD5sVxzOZRYTxkMqc0D8TeYPYCFu2KmJvt0NkpCz7CX73KBzcAfhiNR0u2k62Hdh_yX';
  readonly paypalButtonsContainerId = '#paypal-buttons-container';
  readonly paypalMessagesContainerId = '#paypal-messages-container';
  readonly paypalButtonStyle = {
    layout: 'horizontal',
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  };

  scriptLoaded$ = new BehaviorSubject<boolean>(undefined);

  basket$ = this.checkoutFacade.basket$.pipe(shareReplay(1));
  paypalPaymentMethod$ = this.checkoutFacade.paypalPaymentMethod$.pipe(shareReplay(1));
  isPaypalPaymentMethodSelected$ = combineLatest({ method: this.paypalPaymentMethod$, basket: this.basket$ }).pipe(
    map(({ method, basket }) => method?.paymentInstruments[0]?.id === basket?.payment?.paymentInstrument?.id)
  );

  private destroyRef = inject(DestroyRef);

  constructor(
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private ngZone: NgZone,
    private router: Router,
    private scriptLoader: ScriptLoaderService
  ) {}

  ngAfterViewInit() {
    this.loadScript();
  }

  /**
   * load script if component is visible
   */
  private loadScript() {
    combineLatest({
      locale: this.appFacade.currentLocale$.pipe(whenTruthy()),
      basket: this.basket$.pipe(whenTruthy()),
      paypalPaymentMethod: this.paypalPaymentMethod$.pipe(whenTruthy()),
    })
      .pipe(
        take(1),
        concatMap(({ locale, basket, paypalPaymentMethod }) => {
          if (paypalPaymentMethod.hostedPaymentPageParameters?.length) {
            return this.scriptLoader
              .load(
                `https://www.paypal.com/sdk/js?${this.getScriptQueryParameters(
                  paypalPaymentMethod.hostedPaymentPageParameters,
                  basket,
                  locale
                )}`
              )
              .pipe(map(() => ({ locale, basket, paypalPaymentMethod })));
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ basket, paypalPaymentMethod }) => {
          console.log('script loaded');
          if (paypal?.Buttons) {
            this.scriptLoaded$.next(true);

            paypal
              .Buttons({
                style: this.paypalButtonStyle,
                // Call your server to set up the transaction after the user has clicked the button
                createOrder: (data: { paymentSource: string }) => {
                  this.selectPaypalPaymentMethod.emit(
                    paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId
                  );
                  console.log('createOrder', data);
                  return firstValueFrom(this.getPaypalOrderId$().pipe(take(1)));
                },
                // after the user has submitted the payment in the paypal overlay
                onApprove: (data: { payerID: string; orderID: string }) => {
                  console.log('onApprove', data);
                  // ngZone is needed to navigate outside of the Angular zone in a callback function
                  this.ngZone.run(() => {
                    this.router.navigate(['/checkout/review'], {
                      queryParams: { redirect: 'success', token: data.orderID, PayerID: data.payerID },
                    });
                  });
                },
                // after the user has cancelled the payment in the paypal overlay
                onCancel: () => {
                  this.checkoutFacade.deleteBasketPayment(paypalPaymentMethod.paymentInstruments[0]);
                  this.ngZone.run(() => {
                    this.router.navigate(['/checkout/payment'], { queryParams: { redirect: 'cancel' } });
                  });
                },
                // show a generic error message in case of an error
                onError: () => {
                  this.ngZone.run(() => {
                    this.router.navigate(['/checkout/payment'], { queryParams: { redirect: 'failure' } });
                  });
                },
              })
              .render(this.paypalButtonsContainerId);
          }
          if (paypal?.Messages) {
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
        error: () => {
          this.scriptLoaded$.next(false);
        },
      });
  }

  private getScriptQueryParameters(paymentParameters: Attribute<string>[], basket: Basket, locale: string): string {
    let params = paymentParameters
      ?.filter(param => ['client-id', 'merchant-id', 'intent'].includes(param?.name)) // 'data-partner-attribution-id'
      .map(param => `${param.name}=${param.value}`)
      .join('&');
    params = `${params}&components=buttons,messages`;
    params = `${params}&currency=${basket.purchaseCurrency}`;
    params = `${params}&locale=${locale}`;
    params = `${params}&commit=false`; // do not show the "Pay now" button, but the "Continue to PayPal" button
    //params = `${params}&debug=false`;

    console.log(params);
    return params;
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
}
