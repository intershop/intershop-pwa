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
  preferredInvoiceToAddress: Address;
  preferredShipToAddress: Address;

  isCreateAddressFormCollapsed = true;

  /*
    on changes - update the shown further addresses
  */
  ngOnChanges(c: SimpleChanges) {
    if (this.hasAddressOrUserChanged(c)) {
      this.calculateFurtherAddresses();

      this.hasPreferredAddresses = !!this.user.preferredInvoiceToAddressUrn || !!this.user.preferredShipToAddressUrn;

      // determine preferred addresses
      this.preferredInvoiceToAddress = this.getAddress(this.user.preferredInvoiceToAddressUrn);
      this.preferredShipToAddress = this.getAddress(this.user.preferredShipToAddressUrn);

      this.preferredAddressesEqual = AddressHelper.equal(this.preferredInvoiceToAddress, this.preferredShipToAddress);

      // close possibly open address forms
      this.hideCreateAddressForm();
    }
  }

  // for b2b, the user data are loaded later than the customer addresses
  private hasAddressOrUserChanged(c: SimpleChanges) {
    return (c.addresses || c.user) && this.user;
  }

  private getAddress(urn: string) {
    return this.addresses && !!urn ? this.addresses.find(address => address.urn === urn) : undefined;
  }

  private calculateFurtherAddresses() {
    // all addresses of the user except the preferred invoiceTo and shipTo addresses
    this.furtherAddresses = this.addresses.filter(
      (address: Address) =>
        (!this.user.preferredInvoiceToAddressUrn || address.urn !== this.user.preferredInvoiceToAddressUrn) &&
        (!this.user.preferredShipToAddressUrn || address.urn !== this.user.preferredShipToAddressUrn)
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
