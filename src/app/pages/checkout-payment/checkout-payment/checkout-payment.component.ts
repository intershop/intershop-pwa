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
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, take } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Checkout Payment Component renders the checkout payment page.
 * On this page the user can select a payment method.
 * Some payment methods require the user to enter some additional data, like credit card data.
 * For some payment methods there is special javascript functionality necessary provided by an external payment host.
 * See also {@link CheckoutPaymentPageComponent}
 */
@Component({
  selector: 'ish-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPaymentComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: Basket;
  @Input({ required: true }) paymentMethods: PaymentMethod[];
  @Input() priceType: 'gross' | 'net';
  @Input() error: HttpError;

  @Output() updatePaymentMethod = new EventEmitter<string>();
  @Output() createPaymentInstrument = new EventEmitter<{
    paymentInstrument: PaymentInstrument;
    saveForLater: boolean;
  }>();
  @Output() deletePaymentInstrument = new EventEmitter<PaymentInstrument>();
  @Output() nextStep = new EventEmitter<void>();

  paymentForm: FormGroup;

  filteredPaymentMethods: PaymentMethod[] = [];

  // visible-for-testing
  nextSubmitted = false;
  // visible-for-testing
  formSubmitted = false;

  redirectStatus: string;

  private openFormIndex = -1; // index of the open parameter form

  private destroyRef = inject(DestroyRef);

  constructor(private route: ActivatedRoute) {}

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
        this.redirectStatus = undefined;
        this.updatePaymentMethod.emit(id);
      });

    // if page is shown after cancelled/faulty redirect determine error message variable
    this.route.queryParamMap.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const redirect = params.get('redirect');
      this.redirectStatus = redirect;
    });
  }

  get parameterForm(): FormGroup {
    return this.paymentForm.get('parameters') as FormGroup;
  }

  private getBasketPayment(): string {
    return this.basket?.payment ? this.basket.payment.paymentInstrument.id : '';
  }

  ngOnChanges(c: SimpleChanges) {
    this.setPaymentSelectionFromBasket(c);

    if (c.paymentMethods) {
      // copy objects for runtime checks because formly modifies them, TODO: refactor
      this.filteredPaymentMethods = this.paymentMethods?.map(x => JSON.parse(JSON.stringify(x)));
    }
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
    this.openFormIndex = -1; // close parameter form after successfully basket changed
    this.parameterForm.reset();
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
  cancelNewPaymentInstrument() {
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
  }

  /**
   * submits a payment parameter form
   */
  submitParameterForm() {
    if (this.paymentForm.invalid) {
      this.formSubmitted = true;
      markAsDirtyRecursive(this.parameterForm);
      focusFirstInvalidField(this.parameterForm);
      return;
    }

    if (this.openFormIndex === -1) {
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
    if (this.paymentRedirectRequired) {
      // do a hard redirect to payment redirect URL
      location.assign(this.basket.payment.redirectUrl);
    }
  }

  get paymentRedirectRequired() {
    if (this.basket.payment) {
      return (
        this.basket.payment.capabilities?.includes('RedirectBeforeCheckout') &&
        this.basket.payment.redirectUrl &&
        this.basket.payment.redirectRequired
      );
    }
  }

  get nextDisabled() {
    return !this.basket?.payment && this.nextSubmitted;
  }

  get submitDisabled() {
    return this.paymentForm.invalid && this.formSubmitted;
  }
}
