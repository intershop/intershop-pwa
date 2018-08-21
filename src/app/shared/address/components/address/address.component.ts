import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Address } from '../../../../models/address/address.model';

@Component({
  selector: 'ish-address',
  templateUrl: './address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  @Input()
  address: Address;
}
