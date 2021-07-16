import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-shipping-info',
  templateUrl: './shipping-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingInfoComponent {
  @Input() shippingMethod: ShippingMethod;
}
