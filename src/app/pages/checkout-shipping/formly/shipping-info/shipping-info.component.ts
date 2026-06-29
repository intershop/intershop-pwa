import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-shipping-info',
  imports: [AsyncPipe, PricePipe, TranslatePipe],
  standalone: true,
  templateUrl: './shipping-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingInfoComponent implements OnInit {
  @Input({ required: true }) shippingMethodId: string;

  shippingMethod$: Observable<ShippingMethod>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    if (this.shippingMethodId) {
      this.shippingMethod$ = this.checkoutFacade.shippingMethod$(this.shippingMethodId);
    }
  }
}
