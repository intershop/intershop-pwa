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

import { AppFacade } from 'ish-core/facades/app.facade';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import {
  PaypalComponentBuilder,
  PaypalComponentsConfig,
} from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import {
  PaypalComponentTypes,
  PaypalConfigService,
  PaypalPageTypes,
} from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

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
  @Input() componentType: PaypalComponentTypes = PaypalComponentTypes.Messages;
  @Input() selectedPaymentMethod: PaymentMethod;
  @Output() selectPaypalPaymentMethod = new EventEmitter<string>();
  @Output() paymentInstrument = new EventEmitter<{ parameters: Attribute<string>[]; saveAllowed: boolean }>();
  @Output() cancelPayment = new EventEmitter<void>();

  showPayPalComponent = false;
  paypalComponentContainerId = 'paypal-container-';
  isCardFieldsReady = false;
  private scriptNamespace: string;
  private page: PaypalPageTypes;
  private rendered = false;
  private renderError = false;

  constructor(
    private destroyRef: DestroyRef,
    private appFacade: AppFacade,
    private paypalConfigService: PaypalConfigService,
    private paypalComponentBuilder: PaypalComponentBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setPageType();

    this.appFacade
      .showPaypalPayLaterInformation$(this.page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.showPayPalComponent =
          (this.componentType === PaypalComponentTypes.Messages && value) ||
          this.componentType !== PaypalComponentTypes.Messages;
        if (this.showPayPalComponent) {
          this.paypalComponentContainerId = `${this.paypalComponentContainerId}${Math.random()
            .toString(36)
            .substring(2, 15)}`;
          this.scriptNamespace = this.selectedPaymentMethod
            ? 'PPCP_'.concat(`${this.selectedPaymentMethod.id}`)
            : 'PPCP_MESSAGES';
        }
      });
  }

  /**
   * Lifecycle hook that triggers the PayPal script loading process after the view has been initialized.
   * This ensures the DOM container element is available before attempting to render the PayPal component.
   */
  ngAfterViewInit(): void {
    if (this.showPayPalComponent && !this.rendered) {
      if (this.componentType === PaypalComponentTypes.Messages) {
        this.paypalConfigService
          .loadPayPalScript(this.scriptNamespace, this.page)
          .pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.paypalComponentBuilder
              .build({
                scriptNamespace: this.scriptNamespace,
                componentType: this.componentType,
                pageType: this.page,
                containerId: this.paypalComponentContainerId,
              })
              .then(() => {
                this.rendered = true;
              })
              .catch((error: string) => {
                this.renderError = true;
                console.error('PayPal Messages render failure: ', error);
              });
          });
      } else {
        this.paypalConfigService
          .loadPayPalScript(this.scriptNamespace, this.page, this.selectedPaymentMethod)
          .pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            let config: PaypalComponentsConfig = {
              scriptNamespace: this.scriptNamespace,
              componentType: this.componentType,
              pageType: this.page,
              paypalPaymentMethod: this.selectedPaymentMethod,
            };
            if (this.isCardFieldsComponent()) {
              config = {
                ...config,
                paymentInstrument: (paymentInstrument: PaymentInstrument) =>
                  this.paymentInstrument.emit({ parameters: paymentInstrument.parameters, saveAllowed: undefined }),
              };
            } else {
              config = {
                ...config,
                containerId: this.paypalComponentContainerId,
                selectPaypalPaymentMethod: (id: string) => this.selectPaypalPaymentMethod.emit(id),
              };
            }
            this.paypalComponentBuilder
              .build(config)
              .then(() => {
                this.rendered = true;
              })
              .catch((error: string) => {
                this.renderError = true;
                console.error('PayPal Component render failure: ', error);
              });
          });
      }
    }
  }

  isCardFieldsComponent() {
    return this.componentType === PaypalComponentTypes.CardFields;
  }

  hasError(): boolean {
    return this.renderError;
  }

  cancelNewPaymentInstrument() {
    this.cancelPayment.emit();
  }

  private setPageType() {
    const url = this.router.url;
    if (url.includes('/basket')) {
      this.page = PaypalPageTypes.Cart;
    } else if (url.includes('checkout/payment')) {
      this.page = PaypalPageTypes.CheckoutPayment;
    } else if (url.includes('-ctg')) {
      if (url.includes('-prd')) {
        this.page = PaypalPageTypes.ProductDetails;
      } else {
        this.page = PaypalPageTypes.ProductListing;
      }
    } else if (url.includes('/home')) {
      this.page = PaypalPageTypes.Home;
    }
  }
}
