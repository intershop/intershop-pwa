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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Basket } from '../../../../../models/basket/basket.model';
import { HttpError } from '../../../../../models/http-error/http-error.model';
import { PaymentMethod } from '../../../../../models/payment-method/payment-method.model';

@Component({
  selector: 'ish-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  basket: Basket;
  @Input()
  paymentMethods: PaymentMethod[];
  @Input()
  error: HttpError;

  @Output()
  updatePaymentMethod = new EventEmitter<string>();

  paymentForm: FormGroup;
  submitted = false;
  destroy$ = new Subject();

  constructor(private router: Router) {}

  /**
   * create payment form
   */
  ngOnInit() {
    this.paymentForm = new FormGroup({
      name: new FormControl(this.getBasketPayment()),
    });

    // trigger update payment method if payment selection changes
    this.paymentForm
      .get('name')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(paymentName => this.updatePaymentMethod.emit(paymentName));
  }

  private getBasketPayment(): string {
    return this.basket.payment ? this.basket.payment.name : '';
  }

  /**
   * set payment selection to the corresponding basket value (important in case of an error)
   */
  ngOnChanges(c: SimpleChanges) {
    if (c.basket && this.paymentForm) {
      this.paymentForm.get('name').setValue(this.getBasketPayment(), { emitEvent: false });
    }
  }

  /**
   * leads to next checkout page (checkout review)
   */
  nextStep() {
    this.submitted = true;
    if (!this.nextDisabled) {
      this.router.navigate(['/checkout/review']);
    }
  }

  get nextDisabled() {
    return !this.basket.payment && this.submitted;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
