import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Address } from 'ish-core/models/address/address.model';

/**
 * The Address Component displays an address. The readout is country-dependent.
 *
 * @example
 * <ish-address [address]="order.shipToAddress" [displayEmail]="false" />
 */
@Component({
  selector: 'ish-address',
  standalone: false,
  templateUrl: './address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  /**
   * The Address to be displayed.
   *
   */
  @Input({ required: true }) address: Address;

  /**
   * If set to false, the email is not displayed as part of the address.
   *
   */
  @Input() displayEmail = true;
}
