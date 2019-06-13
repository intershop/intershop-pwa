import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFormOptions } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { markAsDirtyRecursive } from '../../../../shared/forms/utils/form-utils';

/**
 * The Checkout Payment Component renders the checkout payment page. On this page the user can select a payment method. Some payment methods require the user to enter some additional data, like credit card data. For some payment methods there is special javascript functionality necessary provided by an external payment host. See also {@link CheckoutPaymentPageContainerComponent}
 *
 * @example
 * <ish-checkout-payment
 [basket]="basket$ | async"
 [paymentMethods]="paymentMethods$ | async"
 [error]="basketError$ | async"
 (updatePaymentMethod)="updateBasketPaymentMethod($event)"
 (createPaymentInstrument)="createBasketPaymentInstrument($event)"
 (deletePaymentInstrument)="deletePaymentInstrument($event)"
></ish-checkout-payment>
 */
@Component({
  selector: 'ish-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() basket: Basket;
  @Input() paymentMethods: PaymentMethod[];
  @Input() error: HttpError;

  @Output() updatePaymentMethod = new EventEmitter<string>();
  @Output() createPaymentInstrument = new EventEmitter<PaymentInstrument>();
  @Output() deletePaymentInstrument = new EventEmitter<string>();

  paymentForm: FormGroup;
  parameterForm = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {};

  nextSubmitted = false;
  formSubmitted = false;

  openFormIndex = -1; // index of the open parameter form

  private destroy$ = new Subject();

  constructor(private router: Router) {}

  /**
   * create payment form
   */
  ngOnInit() {
    this.paymentForm = new FormGroup({
      name: new FormControl(this.getBasketPayment()),
      parameters: this.parameterForm,
    });

    // trigger update payment method if payment selection changes and there are no form parameters
    this.paymentForm
      .get('name')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(paymentInstrumentId => {
        if (paymentInstrumentId !== this.getBasketPayment()) {
          this.updatePaymentMethod.emit(paymentInstrumentId);
        }
      });
  }

  private getBasketPayment(): string {
    return this.basket && this.basket.payment ? this.basket.payment.paymentInstrument.id : '';
  }

  /**
   * set payment selection to the corresponding basket value (important in case of an error)
   */
  ngOnChanges(c: SimpleChanges) {
    if (c.basket && this.paymentForm) {
      this.paymentForm.get('name').setValue(this.getBasketPayment(), { emitEvent: false });
      this.openFormIndex = -1; // close parameter form after successfully basket changed
      this.parameterForm.reset();
    }
  }

  /**
   * opens the payment parameter form for a payment method to create a new payment instrument
   */
  openPaymentParameterForm(index: number) {
    this.formSubmitted = false;
    this.openFormIndex = index;

    // enable / disable the appropriate parameter form controls
    Object.keys(this.parameterForm.controls).forEach(key => {
      this.paymentMethods[index].parameters.find(para => para.key === key)
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
  createNewPaymentInstrument(parameters: { name: string; value: string }[]) {
    this.createPaymentInstrument.emit({
      id: undefined,
      paymentMethod: this.paymentMethods[this.openFormIndex].id,
      parameters,
    });
  }

  /**
   * submits a payment parameter form
   */
  submit() {
    if (this.paymentForm.invalid) {
      this.formSubmitted = true;
      markAsDirtyRecursive(this.parameterForm);
      return;
    }

    if (this.openFormIndex === -1) {
      // should never happen
      return;
    }

    const parameters = [];
    Object.keys(this.parameterForm.controls).forEach(key => {
      if (this.parameterForm.controls[key].enabled && this.parameterForm.controls[key].value !== null) {
        parameters.push({ name: key, value: this.parameterForm.controls[key].value });
      }
    });

    this.createNewPaymentInstrument(parameters);
  }

  /**
   * deletes a basket instrument and related payment
   */
  deleteBasketPayment(paymentInstrumentId) {
    if (paymentInstrumentId) {
      this.deletePaymentInstrument.emit(paymentInstrumentId);
    }
  }

  /**
   * leads to next checkout page (checkout review)
   */
  nextStep() {
    this.nextSubmitted = true;
    if (!this.nextDisabled) {
      this.router.navigate(['/checkout/review']);
    }
  }

  get nextDisabled() {
    return (!this.basket || !this.basket.payment) && this.nextSubmitted;
  }

  get submitDisabled() {
    return this.paymentForm.invalid && this.formSubmitted;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
