import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Basket } from '../../../../models/basket/basket.model';
import { ShippingMethod } from '../../../../models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingComponent implements OnInit {
  @Input()
  basket: Basket;
  @Input()
  shippingMethods: ShippingMethod[];

  shippingForm: FormGroup;

  constructor(private router: Router) {}

  ngOnInit() {
    this.shippingForm = new FormGroup({
      id: new FormControl(this.basket.commonShippingMethod ? this.basket.commonShippingMethod.id : ''),
    });
  }

  /**
   * leads to next checkout page (checkout payment)
   */
  nextStep() {
    this.router.navigate(['/checkout/payment']);
  }
}
