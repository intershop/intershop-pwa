import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Basket } from '../../../../../models/basket/basket.model';
import { PaymentMethod } from '../../../../../models/payment-method/payment-method.model';

@Component({
  selector: 'ish-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentComponent implements OnInit {
  @Input()
  basket: Basket;
  @Input()
  paymentMethods: PaymentMethod;

  paymentForm: FormGroup;

  constructor(private router: Router) {}

  ngOnInit() {
    this.paymentForm = new FormGroup({
      id: new FormControl(''),
    });
  }

  /**
   * leads to next checkout page (checkout review)
   */
  nextStep() {
    this.router.navigate(['/checkout/review']);
  }
}
