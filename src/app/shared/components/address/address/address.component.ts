import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Address } from 'ish-core/models/address/address.model';

/**
 * The Address Component displays an address. The readout is country-dependent.
 *
 * @example
 * <ish-address
 *   [address]="order.invoiceToAddress" [isEmailShown]="true"
 * ></ish-address>
 */
@Component({
  selector: 'ish-address',
  templateUrl: './address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  /**
   * The Address to be displayed.
   *
   */
  @Input() address: Address;

  /**
   * If set to true, the email is displayed as part of the address.
   *
   */
  @Input() displayEmail = false;
}
