import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  NgZone,
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
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare let paypal_checkout: any;

declare let paypal_express: any;

/**
 * The Payment PayPal Component embeds a paypal script so paypal buttons are rendered within an iframe at a given container. See also {@link CheckoutPaymentPageComponent}
 * There are different configurations for standard checkout and express checkout.
 *
 */
@Component({
  selector: 'ish-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalComponent implements OnInit, AfterViewInit {
  @Input() expressCheckout = false;

  @Output() selectPaypalPaymentMethod = new EventEmitter<string>(); // paymentInstrumentId

  private readonly paypalButtonsContainerId = '#paypal-buttons-container';
  private readonly paypalMessagesContainerId = '#paypal-messages-container';
  private readonly paypalCheckoutButtonStyle = {
    layout: 'horizontal',
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  };
  private readonly paypalExpressButtonStyle = {
    shape: 'sharp',
    label: 'paypal',
    height: 40,
    tagline: false,
  };
  scriptLoaded$ = new BehaviorSubject<boolean>(undefined);
  scriptUrl: string;

  private basket$ = this.checkoutFacade.basket$.pipe(shareReplay(1));
  paypalPaymentMethod$: Observable<PaymentMethod>;
  isPaypalPaymentMethodSelected$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);

  constructor(
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private ngZone: NgZone,
    private router: Router,
    private scriptLoader: ScriptLoaderService
  ) {}

  ngOnInit(): void {
    this.paypalPaymentMethod$ = this.checkoutFacade
      .paypalPaymentMethod$(this.expressCheckout ? 'FastCheckout' : 'RedirectBeforeCheckout')
      .pipe(shareReplay(1));
    this.isPaypalPaymentMethodSelected$ = combineLatest({
      method: this.paypalPaymentMethod$,
      basket: this.basket$,
    }).pipe(map(({ method, basket }) => method?.paymentInstruments[0]?.id === basket?.payment?.paymentInstrument?.id));
  }

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
            this.scriptUrl = `https://www.paypal.com/sdk/js?${this.getScriptQueryParameters(
              paypalPaymentMethod.hostedPaymentPageParameters,
              basket,
              locale
            )}`;

            return this.scriptLoader
              .load(this.scriptUrl, {
                attributes: [
                  ...(paypalPaymentMethod.hostedPaymentPageParameters?.filter(attr => attr.name.startsWith('data-')) ??
                    []),
                  { name: 'data-namespace', value: this.expressCheckout ? 'paypal_express' : 'paypal_checkout' }, // <-- fixed parameter here
                ],
              })
              .pipe(map(() => ({ locale, basket, paypalPaymentMethod })));
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ basket, paypalPaymentMethod }) => {
          this.expressCheckout
            ? this.initializePaypalExpressButton(basket, paypalPaymentMethod)
            : this.initializePaypalCheckoutButton(basket, paypalPaymentMethod);
        },
        error: () => {
          this.scriptLoaded$.next(false);
        },
      });
  }

  private initializePaypalCheckoutButton(basket: Basket, paypalPaymentMethod: PaymentMethod) {
    if (paypal_checkout?.Buttons) {
      this.scriptLoaded$.next(true);

      paypal_checkout
        .Buttons({
          style: this.paypalCheckoutButtonStyle,
          // Call your server to set up the transaction after the user has clicked the button
          createOrder: (data: { paymentSource: string }) => {
            this.selectPaypalPaymentMethod.emit(
              paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId
            );
            // eslint-disable-next-line no-console
            console.log('createOrder', data);
            return firstValueFrom(this.getPaypalOrderId$().pipe(take(1)));
          },
          // after the user has submitted the payment in the paypal overlay
          onApprove: (data: { payerID: string; orderID: string }) => {
            // eslint-disable-next-line no-console
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
    if (paypal_checkout?.Messages) {
      paypal_checkout
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
  }

  private initializePaypalExpressButton(basket: Basket, paypalPaymentMethod: PaymentMethod) {
    if (paypal_express?.Buttons) {
      this.scriptLoaded$.next(true);

      paypal_express
        .Buttons({
          style: this.paypalExpressButtonStyle,
          // Call your server to set up the transaction after the user has clicked the button
          createOrder: (data: { paymentSource: string }) => {
            this.selectPaypalPaymentMethod.emit(
              paypalPaymentMethod.paymentInstruments[0]?.id || paypalPaymentMethod.serviceId
            );
            // eslint-disable-next-line no-console
            console.log('createOrder', data);
            return firstValueFrom(this.getPaypalOrderId$().pipe(take(1)));
          },
          // after the user has submitted the payment in the paypal overlay
          onApprove: (data: { payerID: string; orderID: string }) => {
            // eslint-disable-next-line no-console
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
              this.router.navigate(['/basket'], { queryParams: { redirect: 'cancel' } });
            });
          },
          // show a generic error message in case of an error
          onError: () => {
            this.ngZone.run(() => {
              this.router.navigate(['/basket'], { queryParams: { redirect: 'failure' } });
            });
          },
        })
        .render(this.paypalButtonsContainerId);
    }
    if (paypal_express?.Messages) {
      paypal_express
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
  }

  private getScriptQueryParameters(paymentParameters: Attribute<string>[], basket: Basket, locale: string): string {
    let params = paymentParameters
      ?.filter(param => ['client-id', 'merchant-id', 'intent'].includes(param?.name)) // 'data-partner-attribution-id'
      .map(param => `${param.name}=${param.value}`)
      .join('&');
    params = `${params}&components=buttons,messages`;
    params = `${params}&currency=${basket.purchaseCurrency}`;
    params = `${params}&locale=${locale}`; // ToDo: decide if paypal should determine locale from browser settings
    params = `${params}&commit=false`; // do not show the "Pay now" button, but the "Continue to PayPal" button
    params = `${params}&enable-funding=paylater`;
    // ToDo: make sure the checkout and express scripts are different to load the script twice
    if (this.expressCheckout) {
      params = `${params}&disable-funding=card,sepa`;
    }
    // debug parameter available for sandbox only;

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
