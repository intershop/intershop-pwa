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
import { BehaviorSubject, Observable, filter, map, switchMap, take, tap } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import {
  PaypalComponent,
  PaypalComponentBuilder,
  PaypalSdk,
} from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import { PaypalConfigService, PaypalPageType } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

/**
 * The PaymentPaypalComponent handles the integration of PayPal payment buttons and components
 * throughout the application. It dynamically loads the PayPal SDK, manages payment method selection,
 * and renders PayPal UI components based on the current page context.
 *
 * This component supports both standard checkout flows and fast checkout (express) options
 * depending on the page type and payment method capabilities.
 *
 * @example
 * <ish-payment-paypal
 *   [componentType]="'button'"
 *   (selectPaypalPaymentMethod)="handlePaymentMethodSelection($event)"
 * ></ish-payment-paypal>
 */
@Component({
  selector: 'ish-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalComponent implements OnInit, AfterViewInit {
  /**
   * The type of PayPal component to render (e.g., 'button', 'messages').
   * This determines which PayPal UI component will be displayed in the container.
   */
  @Input() componentType: string;

  /**
   * Event emitted when a PayPal payment method is selected.
   * Emits the payment instrument ID for the selected PayPal payment method.
   */
  @Output() selectPaypalPaymentMethod = new EventEmitter<string>();

  /**
   * Observable stream of the eligible PayPal payment method filtered by capabilities
   * based on the current page context (checkout vs. fast checkout).
   */
  paypalPaymentMethod$: Observable<PaymentMethod>;

  /**
   * Unique identifier for the DOM container element where the PayPal component will be rendered.
   * Generated dynamically to avoid conflicts when multiple PayPal components are present.
   */
  paypalComponentContainerId = 'paypal-container-';

  /**
   * Unique namespace for the PayPal SDK instance, prefixed with 'PPCP_' and the payment method ID.
   * Used to avoid conflicts when multiple payment methods are present on the same page.
   */
  scriptNamespace: string;

  /**
   * The current page type (e.g., 'checkout', 'cart', 'product-details').
   * Determines which PayPal capabilities are required and how the component behaves.
   */
  private page: PaypalPageType;

  /**
   * Observable that tracks the PayPal script loading state.
   * - `undefined`: Initial state, script loading not yet started or in progress
   * - `true`: Script loaded and component rendered successfully
   * - `false`: Script loading or component rendering failed
   */
  scriptLoaded$ = new BehaviorSubject<boolean>(undefined);

  constructor(
    private checkoutFacade: CheckoutFacade,
    private destroyRef: DestroyRef,
    private paypalConfigService: PaypalConfigService,
    private paypalComponentBuilder: PaypalComponentBuilder,
    private router: Router
  ) {}

  /**
   * Initializes the component by generating a unique container ID, determining the page type,
   * and setting up the observable stream for the appropriate PayPal payment method.
   *
   * Payment method selection logic:
   * - For 'messages' component type: Prefers methods with both 'PaypalCheckout' and 'FastCheckout' capabilities,
   *   falls back to any method with 'PaypalCheckout' capability
   * - For checkout pages: Looks for methods with 'RedirectBeforeCheckout' capability (excluding 'FastCheckout')
   * - For other pages (cart, product pages): Looks for methods with 'FastCheckout' capability
   */
  ngOnInit(): void {
    this.paypalComponentContainerId = `${this.paypalComponentContainerId}${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    this.setPageType();

    this.paypalPaymentMethod$ = this.checkoutFacade.eligiblePaymentMethods$().pipe(
      whenTruthy(),
      map(methods => {
        // Special handling for 'messages' component type
        if (this.componentType === 'messages') {
          // First, try to find a method with PaypalCheckout and FastCheckout
          const fastCheckoutMethod = methods.find(
            method => method.capabilities?.includes('PaypalCheckout') && method.capabilities?.includes('FastCheckout')
          );

          if (fastCheckoutMethod) {
            return fastCheckoutMethod;
          }

          // Fallback: find any method with PaypalCheckout capability
          return methods.find(method => method.capabilities?.includes('PaypalCheckout'));
        }

        // Default behavior for other component types
        return methods.find(
          method =>
            method.capabilities?.includes('PaypalCheckout') &&
            (this.page === 'checkout'
              ? method.capabilities?.includes('RedirectBeforeCheckout') &&
                !method.capabilities?.includes('FastCheckout')
              : method.capabilities?.includes('FastCheckout'))
        );
      })
    );
  }

  /**
   * Lifecycle hook that triggers the PayPal script loading process after the view has been initialized.
   * This ensures the DOM container element is available before attempting to render the PayPal component.
   */
  ngAfterViewInit(): void {
    this.loadScript();
  }

  /**
   * Loads the PayPal SDK script and initializes the PayPal payment component.
   *
   * This method:
   * 1. Filters for payment methods with hosted payment page parameters
   * 2. Sets up the script namespace based on the payment method ID
   * 3. Loads the PayPal SDK script with appropriate configuration
   * 4. Renders the PayPal component in the designated container
   * 5. Updates the scriptLoaded$ observable based on success or failure
   *
   * Uses a 300ms timeout before rendering to ensure DOM element availability.
   * Handles errors gracefully by logging to console and updating the loading state.
   */
  private loadScript() {
    this.paypalPaymentMethod$
      .pipe(
        filter(paymentMethod => !!paymentMethod.hostedPaymentPageParameters?.length),
        tap(paymentMethod => this.setNameSpace(paymentMethod)),
        take(1),
        switchMap(paypalPaymentMethod =>
          this.paypalConfigService
            .loadPayPalScript(this.scriptNamespace, {
              paymentMethod: paypalPaymentMethod,
              page: this.page,
            })
            .pipe(
              map(() => ({
                paypalPaymentMethod,
              }))
            )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ paypalPaymentMethod }) => {
          const paypalObject = (window as unknown as Record<string, PaypalSdk>)[this.scriptNamespace];

          if (paypalObject) {
            // Wait for DOM element to be available before rendering
            setTimeout(() => {
              const containerElement = document.getElementById(this.paypalComponentContainerId);
              if (containerElement) {
                this.getPaypalComponent(paypalPaymentMethod)
                  .render(`#${this.paypalComponentContainerId}`)
                  .then(() => {
                    this.scriptLoaded$.next(true);
                  })
                  .catch((error: string) => {
                    console.error('PayPal Component render failed:', error);
                    this.scriptLoaded$.next(false);
                  });
              } else {
                console.error('PayPal container element not found:', this.paypalComponentContainerId);
                this.scriptLoaded$.next(false);
              }
            }, 300);
          }
        },
        error: () => {
          this.scriptLoaded$.next(false);
        },
      });
  }

  /**
   * Creates and configures a PayPal component instance using the PaypalComponentBuilder.
   *
   * @param paypalPaymentMethod The PayPal payment method containing configuration details
   * @returns A configured PayPal component ready to be rendered
   */
  private getPaypalComponent(paypalPaymentMethod: PaymentMethod): PaypalComponent {
    return this.paypalComponentBuilder.get({
      scriptNamespace: this.scriptNamespace,
      pageType: this.page,
      componentType: this.componentType,
      paypalPaymentMethod,
      selectPaypalPaymentMethod: (id: string) => this.selectPaypalPaymentMethod.emit(id),
    });
  }

  /**
   * Determines the current page type based on the router URL.
   *
   * Page types affect which PayPal capabilities are required:
   * - 'checkout': Standard checkout flow, requires 'RedirectBeforeCheckout' capability
   * - 'cart': Shopping cart page, supports fast checkout
   * - 'product-details': Product detail page, supports fast checkout
   * - 'product-listing': Category/listing page, supports fast checkout
   * - 'home': Home page or any other page, supports fast checkout
   */
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

  /**
   * Generates and sets a unique namespace for the PayPal SDK instance.
   *
   * The namespace is used to isolate PayPal SDK instances when multiple payment methods
   * are present on the same page, preventing conflicts and ensuring each payment method
   * operates independently.
   *
   * @param paymentMethod The payment method whose ID will be used in the namespace
   * @returns The generated namespace string in the format 'PPCP_{paymentMethodId}'
   */
  private setNameSpace(paymentMethod: PaymentMethod): string {
    return (this.scriptNamespace = 'PPCP_'.concat(`${paymentMethod.id}`));
  }
}
