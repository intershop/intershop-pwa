import { HttpErrorResponse } from '@angular/common/http';
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
  error: HttpErrorResponse;

  @Output()
  updatePaymentMethod = new EventEmitter<string>();

  paymentForm: FormGroup;
  destroy$ = new Subject();

  constructor(private router: Router) {}

  /**
   * create payment form
   */
  ngOnInit() {
    this.paymentForm = new FormGroup({
      name: new FormControl(this.basket.paymentMethod ? this.basket.paymentMethod.name : ''),
    });

    // trigger update payment method if payment selection changes
    this.paymentForm
      .get('name')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(paymentName => this.updatePaymentMethod.emit(paymentName));
  }

  /**
   * set payment selection to the corresponding basket value (important in case of an error)
   */
  ngOnChanges(c: SimpleChanges) {
    if (c.basket && this.paymentForm) {
      this.paymentForm
        .get('name')
        .setValue(this.basket.paymentMethod ? this.basket.paymentMethod.name : '', { emitEvent: false });
    }
  }

  /**
   * leads to next checkout page (checkout review)
   */
  nextStep() {
    this.router.navigate(['/checkout/review']);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
