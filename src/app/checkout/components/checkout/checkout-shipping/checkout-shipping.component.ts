import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Basket } from '../../../../models/basket/basket.model';
import { ShippingMethod } from '../../../../models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingComponent implements OnInit {
  @Input() basket: Basket;
  @Input() shippingMethods: ShippingMethod[];

  shippingForm: FormGroup;

  ngOnInit() {
    this.shippingForm = new FormGroup({
      id: new FormControl(this.basket.commonShippingMethod ? this.basket.commonShippingMethod.id : ''),
    });
  }
}
