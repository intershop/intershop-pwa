import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PricePipe } from 'ish-core/models/price/price.pipe';

@Component({
  selector: 'ish-shipping-info',
  templateUrl: './shipping-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, TranslateModule, PricePipe, AsyncPipe],
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
