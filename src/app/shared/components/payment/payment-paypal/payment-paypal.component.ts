import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { Observable, distinctUntilChanged, map, of, shareReplay, switchMap } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalComponentBuilder } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import { PaypalConfigService, PaypalPageType } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

/**
 * The PaymentPaypalComponent handles the integration of PayPal payment buttons and components
 * throughout the application. It dynamically loads the PayPal SDK, manages payment method selection,
 * and renders PayPal UI components based on the current page context.
 */
@Component({
  selector: 'ish-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalComponent implements OnInit, AfterViewInit {
  @Input() componentType: string;
  @Input() selectedPaymentMethod: PaymentMethod;
  @Output() selectPaypalPaymentMethod = new EventEmitter<string>();
  @Output() cancelPayment = new EventEmitter<void>();

  paypalComponentContainerId = 'paypal-container-';
  isCardFieldsReady = false;
  private scriptNamespace: string;
  private paypalPaymentMethod$: Observable<PaymentMethod>;
  private page: PaypalPageType;
  private rendered = false;
  private renderError = false;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private destroyRef: DestroyRef,
    private paypalConfigService: PaypalConfigService,
    private paypalComponentBuilder: PaypalComponentBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paypalComponentContainerId = `${this.paypalComponentContainerId}${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    this.setPageType();

    if (this.selectedPaymentMethod) {
      this.paypalPaymentMethod$ = of(this.selectedPaymentMethod);
    } else if (this.componentType === 'messages') {
      this.paypalPaymentMethod$ = this.checkoutFacade.paypalPaymentMethod$().pipe(whenTruthy(), shareReplay(1));
    } else {
      this.paypalPaymentMethod$ = this.checkoutFacade
        .paypalPaymentMethod$(this.page === 'cart' ? 'FastCheckout' : 'RedirectBeforeCheckout')
        .pipe(whenTruthy(), shareReplay(1));
    }
  }

  /**
   * Lifecycle hook that triggers the PayPal script loading process after the view has been initialized.
   * This ensures the DOM container element is available before attempting to render the PayPal component.
   */
  ngAfterViewInit(): void {
    if (!this.rendered) {
      this.paypalPaymentMethod$
        .pipe(
          whenTruthy(),
          distinctUntilChanged(isEqual),
          switchMap(paymentMethod => {
            this.scriptNamespace = this.setNameSpace(paymentMethod);
            return this.paypalConfigService
              .loadPayPalScript(this.scriptNamespace, {
                paymentMethod,
                page: this.page,
              })
              .pipe(
                whenTruthy(),
                map(() => paymentMethod)
              );
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(paymentMethod => {
          if (this.componentType === 'cardFields') {
            this.paypalComponentBuilder
              .render(this.scriptNamespace, paymentMethod)
              .then(() => {
                this.rendered = true;
              })
              .catch((error: string) => {
                if (error === 'INELIGIBLE') {
                  console.warn('PayPal CardFields are not eligible for this configuration');
                  this.rendered = true; // Mark as rendered to avoid showing error UI
                } else {
                  this.renderError = true;
                  console.error('PayPal CardFields render failed:', error);
                }
              });
          } else {
            const paypalComponent = this.paypalComponentBuilder.get({
              scriptNamespace: this.scriptNamespace,
              componentType: this.componentType,
              pageType: this.page,
              paypalPaymentMethod: paymentMethod,
              selectPaypalPaymentMethod: (id: string) => this.selectPaypalPaymentMethod.emit(id),
            });

            paypalComponent
              .render(`#${this.paypalComponentContainerId}`)
              .then(() => {
                this.rendered = true;
              })
              .catch((error: string) => {
                this.renderError = true;
                console.error('PayPal CardFields render failed:', error);
              });
          }
        });
    }
  }

  isCardFieldsComponent(): boolean {
    return this.componentType === 'cardFields';
  }

  hasError(): boolean {
    return this.renderError;
  }

  cancelNewPaymentInstrument() {
    this.cancelPayment.emit();
  }

  private setPageType() {
    const url = this.router.url;
    this.page = 'home';
    if (url.includes('/basket')) {
      this.page = 'cart';
    } else if (url.includes('/checkout')) {
      this.page = 'checkout';
    } else if (url.includes('-ctg')) {
      if (url.includes('-prd')) {
        this.page = 'product-details';
      } else {
        this.page = 'product-listing';
      }
    }
  }

  private setNameSpace(paymentMethod: PaymentMethod): string {
    return (this.scriptNamespace = 'PPCP_'.concat(`${paymentMethod.id}`));
  }
}
