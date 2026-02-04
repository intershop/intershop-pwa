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
import { EMPTY, Observable, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { ScriptType } from 'ish-core/utils/script-loader/script-loader.service';
import { PayPalCardFields } from 'ish-core/utils/sdk/paypal/paypal-components/card-fields/paypal-card-fields';
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
 * Component for rendering PayPal payment components (Buttons, Messages, CardFields).
 *
 * This component dynamically loads the PayPal SDK and renders the appropriate PayPal component
 * based on the configured component type and current page context. It supports:
 * - **Buttons**: PayPal checkout buttons for standard payments
 * - **Messages**: Pay Later messaging for promotional content
 * - **CardFields**: Hosted card input fields for credit card payments
 */
@Component({
  selector: 'ish-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalComponent implements OnInit, AfterViewInit {
  /** Type of PayPal component to render. Defaults to Messages. */
  @Input() componentType: PaypalComponentTypes = PaypalComponentTypes.Messages;

  /** The selected PayPal payment method configuration. Required for Buttons and CardFields. */
  @Input() selectedPaymentMethod: PaymentMethod;

  /** Emits when the card fields form should be closed. */
  @Output() closeForm = new EventEmitter<void>();

  /** Unique container ID for the PayPal component DOM element. */
  paypalComponentContainerId = 'paypal-container-'.concat(Math.random().toString(36).substring(2, 15));

  /** The identified page type based on the current URL. */
  private page: PaypalPageTypes;

  /** Observable for tracking the PayPal script loading state. */
  private loading$: Observable<ScriptType>;

  constructor(
    private destroyRef: DestroyRef,
    private appFacade: AppFacade,
    private paypalConfigService: PaypalConfigService,
    private paypalComponentBuilder: PaypalComponentBuilder,
    private payPalCardFields: PayPalCardFields,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.identifyPageType();

    this.loading$ = this.appFacade
      .serverSetting$<PaypalConfig>('payment.paypal')
      .pipe(switchMap(paypalConfig => this.loadPayPalScript(paypalConfig)));

    // Subscribe to close form event from PayPal card fields
    this.payPalCardFields.closeForm$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.closeForm.emit();
    });
  }

  /**
   * Loads the PayPal SDK script based on the component type and configuration.
   *
   * For Messages components, the script is only loaded if Pay Later information should be shown.
   * For Buttons and CardFields, the script is loaded with the selected payment method configuration.
   *
   * @param showPaypalPayLaterInformation - Whether Pay Later messaging should be displayed
   * @returns Observable that emits the script loading result, or EMPTY if loading should be skipped
   */
  private loadPayPalScript(paypalConfig: PaypalConfig): Observable<ScriptType> {
    // Do not load PayPal Messages component if Pay Later information is not to be shown
    if (this.componentType === PaypalComponentTypes.Messages && !this.showPaypalPayLaterInformation(paypalConfig)) {
      return EMPTY;
    }

    return this.componentType === PaypalComponentTypes.Messages
      ? this.paypalConfigService.loadPayPalScript('PPCP_MESSAGES', this.page)
      : this.paypalConfigService.loadPayPalScript(
          'PPCP_'.concat(`${this.selectedPaymentMethod.id}`),
          this.page,
          this.selectedPaymentMethod
        );
  }

  /**
   * Builds and renders the PayPal component after the view has been initialized
   * and the PayPal SDK script has been successfully loaded.
   */
  ngAfterViewInit(): void {
    this.loading$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(loadingResult => {
      if (loadingResult.loaded) {
        const config: PaypalComponentsConfig = {
          scriptNamespace: this.selectedPaymentMethod
            ? 'PPCP_'.concat(`${this.selectedPaymentMethod.id}`)
            : 'PPCP_MESSAGES',
          componentType: this.componentType,
          pageType: this.page,
          paypalPaymentMethod: this.selectedPaymentMethod,
        };

        this.paypalComponentBuilder.build(
          this.componentType === PaypalComponentTypes.CardFields
            ? config
            : { ...config, containerId: this.paypalComponentContainerId }
        );
      }
    });
  }

  private getPage(): PaypalPageTypes {
    return this.page;
  }

  /**
   * Identifies the current page type based on the router URL.
   * The page type is used to configure the PayPal SDK with the appropriate context
   * (e.g., 'cart', 'checkout', 'product-details', 'product-listing', 'home').
   */
  private identifyPageType() {
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

  private showPaypalPayLaterInformation(paypalConfig: PaypalConfig): boolean {
    switch (this.getPage()) {
      case PaypalPageTypes.Cart:
        return paypalConfig.payLaterPreferences.PayLaterMessagingCartEnabled;
      case PaypalPageTypes.CheckoutPayment:
        return paypalConfig.payLaterPreferences.PayLaterMessagingPaymentEnabled;
      case PaypalPageTypes.Home:
        return paypalConfig.payLaterPreferences.PayLaterMessagingHomeEnabled;
      case PaypalPageTypes.ProductDetails:
        return paypalConfig.payLaterPreferences.PayLaterMessagingProductDetailsEnabled;
      case PaypalPageTypes.ProductListing:
        return paypalConfig.payLaterPreferences.PayLaterMessagingCategoryEnabled;
      default:
        return false;
    }
  }
}
