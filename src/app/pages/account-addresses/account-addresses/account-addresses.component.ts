import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Address Page Component displays the preferred InvoiceTo and ShipTo addresses of the user
 * and any further addresses. The user can add and delete addresses. It is mandatory to have at least one address.
 * see also: {@link AccountAddressPageContainerComponent}
 */
@Component({
  selector: 'ish-account-addresses',
  templateUrl: './account-addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountAddressesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() addresses: Address[];
  @Input() user: User;
  @Input() error: HttpError;

  @Output() createCustomerAddress = new EventEmitter<Address>();
  @Output() deleteCustomerAddress = new EventEmitter<string>();

  hasPreferredAddresses = false;
  preferredAddressesEqual: boolean;
  preferredInvoiceToAddress: Address;
  preferredShipToAddress: Address;

  isCreateAddressFormCollapsed = true;

  preferredAddressForm: FormGroup;
  invoiceAddresses: Address[] = [];
  shippingAddresses: Address[] = [];
  furtherAddresses: Address[] = [];

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    // create preferred select form (selectboxes)
    this.preferredAddressForm = new FormGroup({
      preferredInvoiceAddressUrn: new FormControl(''),
      preferredShippingAddressUrn: new FormControl(''),
    });

    // trigger set preferred invoice address if it changes
    this.preferredAddressForm
      .get('preferredInvoiceAddressUrn')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(urn => {
        if (urn) {
          this.accountFacade.updateUser(
            { ...this.user, preferredInvoiceToAddressUrn: urn },
            { message: 'account.addresses.preferredinvoice.change.message' }
          );
          this.preferredAddressForm.get('preferredInvoiceAddressUrn').setValue('');
        }
      });

    // trigger set preferred shipping address if it changes
    this.preferredAddressForm
      .get('preferredShippingAddressUrn')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(urn => {
        if (urn) {
          this.accountFacade.updateUser(
            { ...this.user, preferredShipToAddressUrn: urn },
            { message: 'account.addresses.preferredshipping.change.message' }
          );
          this.preferredAddressForm.get('preferredShippingAddressUrn').setValue('');
        }
      });
  }

  /**
   * on changes - update the shown further addresses
   */
  ngOnChanges(c: SimpleChanges) {
    if (this.hasAddressOrUserChanged(c)) {
      // prepare select box label and content
      this.preparePreferredInvoiceAddressSelectBox();
      this.preparePreferredShippingAddressSelectBox();

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

  /**
   * for b2b, the user data are loaded later than the customer addresses
   */
  private hasAddressOrUserChanged(c: SimpleChanges) {
    return (c.addresses || c.user) && this.user;
  }

  private getAddress(urn: string) {
    return this.addresses && !!urn ? this.addresses.find(address => address.urn === urn) : undefined;
  }

  /**
   * Determines addresses of the select box: all invoice addresses are shown except the address which is currently assigned as preferred address to the user
   */
  private preparePreferredInvoiceAddressSelectBox() {
    this.invoiceAddresses = this.addresses.filter(
      (address: Address) =>
        ((this.user.preferredInvoiceToAddressUrn && address.urn !== this.user.preferredInvoiceToAddressUrn) ||
          !this.user.preferredInvoiceToAddressUrn) &&
        address.invoiceToAddress
    );
  }

  /**
   * Determines addresses of the select box: all shipping addresses are shown except the address which is currently assigned as preferred address to the user
   */
  private preparePreferredShippingAddressSelectBox() {
    this.shippingAddresses = this.addresses.filter(
      (address: Address) =>
        ((this.user.preferredShipToAddressUrn && address.urn !== this.user.preferredShipToAddressUrn) ||
          !this.user.preferredShipToAddressUrn) &&
        address.shipToAddress
    );
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
