import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Address Page Component displays the preferred InvoiceTo and ShipTo addresses of the user
 * and any further addresses.
 * see also: {@link AccountAddressPageContainerComponent}
 *
 */
@Component({
  selector: 'ish-account-addresses-page',
  templateUrl: './account-addresses-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountAddressesPageComponent implements OnChanges {
  @Input()
  addresses: Address[];
  @Input()
  user: User;
  @Input()
  error: HttpError;

  @Output()
  createCustomerAddress = new EventEmitter<Address>();

  @Output()
  deleteCustomerAddress = new EventEmitter<string>();

  furtherAddresses: Address[] = [];

  hasPreferredAddresses = false;
  preferredAddressesEqual: boolean;
  isCreateAddressFormCollapsed = true;

  /*
    on changes - update the shown further addresses
  */
  ngOnChanges(c: SimpleChanges) {
    if (c.addresses) {
      this.calculateFurtherAddresses();

      this.hasPreferredAddresses = !!this.user.preferredInvoiceToAddress || !!this.user.preferredShipToAddress;

      this.preferredAddressesEqual = AddressHelper.equal(
        this.user.preferredInvoiceToAddress,
        this.user.preferredShipToAddress
      );

      // close possibly open address forms
      this.hideCreateAddressForm();
    }
  }

  private calculateFurtherAddresses() {
    // all addresses of the user except the preferred invoiceTo and shipTo addresses
    this.furtherAddresses = this.addresses.filter(
      (address: Address) =>
        (!this.user.preferredInvoiceToAddress || address.id !== this.user.preferredInvoiceToAddress.id) &&
        (!this.user.preferredShipToAddress || address.id !== this.user.preferredShipToAddress.id)
    );
  }

  showCreateAddressForm() {
    this.isCreateAddressFormCollapsed = false;
    // do not close address form immediately to show possible server errors
  }

  hideCreateAddressForm() {
    this.isCreateAddressFormCollapsed = true;
  }

  createAddress(address: Address) {
    this.createCustomerAddress.emit(address);
  }

  deleteAddress(address: Address) {
    this.deleteCustomerAddress.emit(address.id);
  }
}
