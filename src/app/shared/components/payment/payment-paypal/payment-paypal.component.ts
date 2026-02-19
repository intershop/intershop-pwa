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
import { EMPTY, Observable, shareReplay, switchMap, take } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalAdaptersBuilder, PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PaypalButtonsAdapter } from 'ish-core/utils/paypal/adapters/paypal-buttons/paypal-buttons.adapter';
import { PaypalCardFieldsAdapter } from 'ish-core/utils/paypal/adapters/paypal-card-fields/paypal-card-fields.adapter';
import { PaypalMessagesAdapter } from 'ish-core/utils/paypal/adapters/paypal-messages/paypal-messages.adapter';
import {
  PaypalAdapterTypes,
  PaypalConfigService,
  PaypalPageType,
} from 'ish-core/utils/paypal/paypal-config/paypal-config.service';
import { ScriptType } from 'ish-core/utils/script-loader/script-loader.service';

/**
 * Component for rendering PayPal payment components (Buttons, Messages, CardFields).
 *
 * This component dynamically loads the PayPal SDK and renders the appropriate PayPal component
 * based on the configured component type and current page context. It supports Buttons, Messages and CardFields.*/
@Component({
  selector: 'ish-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaypalAdaptersBuilder, PaypalButtonsAdapter, PaypalCardFieldsAdapter, PaypalMessagesAdapter],
})
export class PaymentPaypalComponent implements OnInit, AfterViewInit {
  /** Type of PayPal adapter to render. Defaults to Messages. */
  @Input() adapterType: PaypalAdapterTypes = 'Messages';

  /** Type of page to render. */
  @Input({ required: true }) pageType: PaypalPageType;

  /** The selected PayPal payment method configuration. Required for Buttons and CardFields. */
  @Input() selectedPaymentMethod: PaymentMethod;

  /** Emits when the card fields form should be closed. */
  @Output() closeForm = new EventEmitter<void>();

  /** Unique container ID for the PayPal component DOM element. */
  paypalComponentContainerId = 'paypal-container-'.concat(uuid());

  /** Observable for tracking the PayPal script loading state. */
  private loadingScript$: Observable<ScriptType>;

  /** Observable indicating whether the PayPal iframe is loading. */
  loadingIframe$: Observable<boolean>;

  /** Observable indicating whether the PayPal iframe is loading. */
  renderError$: Observable<string>;

  /** Error state observables for card fields */
  nameFieldError$: Observable<boolean>;
  numberFieldError$: Observable<boolean>;
  cvvFieldError$: Observable<boolean>;
  expiryFieldError$: Observable<boolean>;

  constructor(
    private destroyRef: DestroyRef,
    private appFacade: AppFacade,
    private paypalConfigService: PaypalConfigService,
    private paypalAdaptersBuilder: PaypalAdaptersBuilder,
    private paypalCardFields: PaypalCardFieldsAdapter
  ) {}

  ngOnInit(): void {
    if (this.selectedPaymentMethod?.id) {
      this.paypalComponentContainerId = `paypal-component-container-${this.selectedPaymentMethod.id}`; // Generate unique container ID for each component instanc
    }
    this.loadingScript$ = this.appFacade.serverSetting$<PaypalConfig>('payment.paypal').pipe(
      whenTruthy(),
      take(1),
      switchMap(paypalConfig => this.loadPaypalScript(paypalConfig)),
      shareReplay(1)
    );

    // Subscribe to close form event from PayPal card fields
    this.paypalCardFields.closeForm$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.closeForm.emit();
    });
    this.loadingIframe$ = this.paypalCardFields.loadingIframe$;
    this.renderError$ = this.paypalCardFields.renderError$;

    // Assign error state observables from card fields adapter
    this.nameFieldError$ = this.paypalCardFields.nameFieldError$;
    this.numberFieldError$ = this.paypalCardFields.numberFieldError$;
    this.cvvFieldError$ = this.paypalCardFields.cvvFieldError$;
    this.expiryFieldError$ = this.paypalCardFields.expiryFieldError$;
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
  private loadPaypalScript(paypalConfig: PaypalConfig): Observable<ScriptType> {
    // Do not load PayPal Messages component if Pay Later information is not to be shown
    if (this.adapterType === 'Messages' && !this.showPaypalPayLaterInformation(paypalConfig)) {
      return EMPTY;
    }

    return this.adapterType === 'Messages'
      ? this.paypalConfigService.loadPaypalScript('PPCP_MESSAGES', this.pageType)
      : this.paypalConfigService.loadPaypalScript(
          'PPCP_'.concat(`${this.selectedPaymentMethod.id}`),
          this.pageType,
          this.selectedPaymentMethod
        );
  }

  /**
   * Builds and renders the PayPal component after the view has been initialized
   * and the PayPal SDK script has been successfully loaded.
   */
  ngAfterViewInit(): void {
    console.log('view init paypal component');
    this.loadingScript$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(loadingResult => {
      if (loadingResult.loaded) {
        const config: PaypalComponentsConfig = {
          scriptNamespace: this.selectedPaymentMethod
            ? 'PPCP_'.concat(`${this.selectedPaymentMethod.id}`)
            : 'PPCP_MESSAGES',
          adapterType: this.adapterType,
          pageType: this.pageType,
          paypalPaymentMethod: this.selectedPaymentMethod,
        };

        this.paypalAdaptersBuilder.build(
          this.adapterType === 'CardFields' ? config : { ...config, containerId: this.paypalComponentContainerId }
        );
      }
    });
  }

  /**
   * Determines whether Pay Later messaging should be displayed based on the PayPal configuration and the current page type.
   */
  private showPaypalPayLaterInformation(paypalConfig: PaypalConfig): boolean {
    switch (this.pageType) {
      case 'cart':
        return paypalConfig.payLaterPreferences.PayLaterMessagingCartEnabled;
      case 'checkout':
        return paypalConfig.payLaterPreferences.PayLaterMessagingPaymentEnabled;
      case 'home':
        return paypalConfig.payLaterPreferences.PayLaterMessagingHomeEnabled;
      case 'product-details':
        return paypalConfig.payLaterPreferences.PayLaterMessagingProductDetailsEnabled;
      case 'product-listing':
        return paypalConfig.payLaterPreferences.PayLaterMessagingCategoryEnabled;
      default:
        return false;
    }
  }
}
