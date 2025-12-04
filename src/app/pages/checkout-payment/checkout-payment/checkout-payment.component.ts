import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subject, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PriceType } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { PaypalAdapterTypes, PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';
import { BasketAddressSummaryComponent } from 'ish-shared/components/basket/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketItemsSummaryComponent } from 'ish-shared/components/basket/basket-items-summary/basket-items-summary.component';
import { BasketPaymentCostInfoComponent } from 'ish-shared/components/basket/basket-payment-cost-info/basket-payment-cost-info.component';
import { BasketPromotionCodeComponent } from 'ish-shared/components/basket/basket-promotion-code/basket-promotion-code.component';
import { BasketRecurrenceSummaryComponent } from 'ish-shared/components/basket/basket-recurrence-summary/basket-recurrence-summary.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { InfoMessageComponent } from 'ish-shared/components/common/info-message/info-message.component';
import { PaymentPaypalComponent } from 'ish-shared/components/payment/payment-paypal/payment-paypal.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { PaymentConcardisCreditcardCvcDetailComponent } from '../payment-concardis-creditcard-cvc-detail/payment-concardis-creditcard-cvc-detail.component';
import { PaymentConcardisCreditcardComponent } from '../payment-concardis-creditcard/payment-concardis-creditcard.component';
import { PaymentConcardisDirectdebitComponent } from '../payment-concardis-directdebit/payment-concardis-directdebit.component';
import { PaymentCybersourceCreditcardComponent } from '../payment-cybersource-creditcard/payment-cybersource-creditcard.component';
import { PaymentParameterFormComponent } from '../payment-parameter-form/payment-parameter-form.component';
import { PaymentPayoneCreditcardComponent } from '../payment-payone-creditcard/payment-payone-creditcard.component';

/**
 * The Checkout Payment Component renders the checkout payment page.
 * On this page the user can select a payment method.
 * Some payment methods require the user to enter some additional data, like credit card data.
 * For some payment methods there is special javascript functionality necessary provided by an external payment host.
 * See also {@link CheckoutPaymentPageComponent}
 */
@Component({
  selector: 'ish-checkout-payment',
  imports: [
    AsyncPipe,
    BasketAddressSummaryComponent,
    BasketCostSummaryComponent,
    BasketErrorMessageComponent,
    BasketItemsSummaryComponent,
    BasketPaymentCostInfoComponent,
    BasketPromotionCodeComponent,
    BasketRecurrenceSummaryComponent,
    BasketValidationResultsComponent,
    InfoMessageComponent,
    NgbCollapseModule,
    NgClass,
    PaymentConcardisCreditcardComponent,
    PaymentConcardisCreditcardCvcDetailComponent,
    PaymentConcardisDirectdebitComponent,
    PaymentCybersourceCreditcardComponent,
    PaymentParameterFormComponent,
    PaymentPayoneCreditcardComponent,
    PaymentPaypalComponent,
    PricePipe,
    ReactiveFormsModule,
    ServerHtmlDirective,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './checkout-payment.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPaymentComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: Basket;
  @Input({ required: true }) paymentMethods: PaymentMethod[];
  @Input() priceType: PriceType;
  @Input() error: HttpError;

  @Output() readonly updatePaymentMethod = new EventEmitter<string>();
  @Output() readonly createPaymentInstrument = new EventEmitter<{
    paymentInstrument: PaymentInstrument;
    saveForLater: boolean;
  }>();
  @Output() readonly deletePaymentInstrument = new EventEmitter<PaymentInstrument>();
  @Output() readonly nextStep = new EventEmitter<void>();

  paymentForm: FormGroup;

  filteredPaymentMethods: PaymentMethod[] = [];

  // visible-for-testing
  nextSubmitted = false;
  // visible-for-testing
  formSubmitted = false;

  redirectStatus$: Observable<string>;

  private redirectStatusReset$ = new Subject<string>();

  private openFormIndex = -1; // index of the open parameter form

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private paypalConfigService: PaypalConfigService
  ) {}

  /**
   * create payment form
   */
  ngOnInit() {
    this.paymentForm = new FormGroup({
      name: new FormControl(this.getBasketPayment()),
      parameters: new FormGroup({}),
    });

    // trigger update payment method if payment selection changes and there are no form parameters
    this.paymentForm
      .get('name')
      .valueChanges.pipe(
        filter(paymentInstrumentId => paymentInstrumentId !== this.getBasketPayment()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(id => {
        this.setBasketPayment(id);
      });

    // if page is shown after cancelled/faulty redirect determine error message variable
    this.redirectStatus$ = merge(
      this.route.queryParamMap.pipe(map(params => params.get('redirect') || '')),
      this.redirectStatusReset$
    );
  }

  ngOnChanges(c: SimpleChanges) {
    this.setPaymentSelectionFromBasket(c);

    if (c.paymentMethods) {
      // copy objects for runtime checks because formly modifies them, TODO: refactor
      this.filteredPaymentMethods = this.paymentMethods?.map(x => JSON.parse(JSON.stringify(x)));
    }
  }

  get parameterForm(): FormGroup {
    return this.paymentForm.get('parameters') as FormGroup;
  }

  /**
   * Reset payment selection with current values from basket
   * Should be used for initialization when basket data is changed
   * invoked by `ngOnChanges()`, important in case of an error
   */
  private setPaymentSelectionFromBasket(c: SimpleChanges) {
    if (c.basket && !this.paymentForm) {
      return;
    }

    this.paymentForm.get('name').setValue(this.getBasketPayment(), { emitEvent: false });
    this.closePaymentInstrumentForm(); // close parameter form after successfully basket changed
    this.parameterForm.reset();
  }

  /**
   * Returns a payment method if basket payment has paypal capabilities and redirect required, otherwise undefined
   */
  selectedPayPalMethod(): PaymentMethod {
    if (
      this.basket?.payment?.capabilities?.includes('PaypalCheckout') &&
      this.basket?.payment?.capabilities?.includes('RedirectBeforeCheckout') &&
      this.basket?.payment?.redirectRequired
    ) {
      return this.paymentMethods?.find(pm => pm.id.includes(this.basket.payment.paymentInstrument.id));
    }
    return;
  }

  /**
   * Estimate the PayPal adapter type for a given payment method based on its capabilities.
   */
  getPaypalAdapterType(method?: PaymentMethod): PaypalAdapterTypes {
    return this.paypalConfigService.getPaypalAdapterType(method);
  }

  /**
   * Necessary for PayPal Privacy Policy to determine the invoice country code for the buyer, default is 'us' if no invoice address is present
   */
  getCustomerInvoiceCountryCode(): string {
    return this.basket?.invoiceToAddress ? this.basket.invoiceToAddress.countryCode?.toLowerCase() : 'us';
  }

  /**
   * Determine whether payment parameter form for a payment method is opened or not
   *
   * @param index Numerical index of the parameter form to get info from
   */
  formIsOpen(index: number): boolean {
    return index === this.openFormIndex;
  }

  /**
   * Determine whether there are payment methods present
   * for usage in template
   */
  get hasPaymentMethods() {
    return this.filteredPaymentMethods && this.filteredPaymentMethods.length > 0;
  }

  /**
   * opens the payment parameter form for a payment method to create a new payment instrument
   */
  openPaymentParameterForm(index: number) {
    this.formSubmitted = false;
    this.openFormIndex = index;

    // enable / disable the appropriate parameter form controls
    Object.keys(this.parameterForm.controls).forEach(key => {
      this.filteredPaymentMethods[index].parameters.find(param => param.key === key)
        ? this.parameterForm.controls[key].enable()
        : this.parameterForm.controls[key].disable();
    });
  }

  /**
   * cancel new payment instrument, hides parameter form
   */
  closePaymentInstrumentForm() {
    this.openFormIndex = -1;
  }

  /**
   * creates a new payment instrument
   */
  createNewPaymentInstrument(body: { parameters: Attribute<string>[]; saveAllowed: boolean }) {
    const paymentMethod = this.filteredPaymentMethods[this.openFormIndex];
    const paymentInstrument: PaymentInstrument = {
      id: undefined,
      paymentMethod: paymentMethod.id,
      parameters: body.parameters,
    };

    this.createPaymentInstrument.emit({ paymentInstrument, saveForLater: body.saveAllowed });
    this.redirectStatusReset$.next('');
  }

  /**
   * submits a payment parameter form
   */
  submitParameterForm() {
    if (this.paymentForm.invalid) {
      this.formSubmitted = true;
      markAsDirtyRecursive(this.parameterForm);
      return;
    }

    if (!this.isParameterFormOpen) {
      return;
    }

    const paymentMethod = this.filteredPaymentMethods[this.openFormIndex];
    const parameters = Object.entries(this.parameterForm.controls)
      .filter(([, control]) => control.enabled && control.value)
      .map(([key, control]) => ({
        name: key,
        value: typeof control.value === 'string' ? control.value.trim() : control.value,
      }));

    this.createNewPaymentInstrument({
      parameters,
      saveAllowed: paymentMethod.saveAllowed && this.paymentForm.get('saveForLater').value,
    });
  }

  private setBasketPayment(paymentInstrumentId: string) {
    this.redirectStatusReset$.next('');
    this.updatePaymentMethod.emit(paymentInstrumentId);
  }

  /**
   * deletes a basket instrument and related payment
   */
  deleteBasketPayment(paymentInstrument: PaymentInstrument) {
    if (paymentInstrument) {
      this.deletePaymentInstrument.emit(paymentInstrument);
    }
  }

  /**
   * leads to next checkout page (checkout review)
   */
  goToNextStep() {
    this.nextSubmitted = true;
    this.nextStep.emit();
  }

  get nextDisabled() {
    return !this.basket?.payment && this.nextSubmitted;
  }

  get submitDisabled() {
    return this.paymentForm.invalid && this.formSubmitted;
  }

  private getBasketPayment(): string {
    return this.basket?.payment ? this.basket.payment.paymentInstrument.id : '';
  }

  private isParameterFormOpen() {
    return this.openFormIndex !== -1;
  }
}
