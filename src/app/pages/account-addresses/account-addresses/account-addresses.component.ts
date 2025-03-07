import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, take, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { FeatureEventService } from 'ish-core/utils/feature-event/feature-event.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { mapToAddressOptions } from 'ish-shared/forms/utils/forms.service';

/**
 * The Account Address Page Component displays the preferred InvoiceTo and ShipTo addresses of the user
 * and any further addresses. The user can add and delete addresses. It is mandatory to have at least one address.
 */
@Component({
  selector: 'ish-account-addresses',
  templateUrl: './account-addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountAddressesComponent implements OnInit {
  @Input() error: HttpError;

  addresses$: Observable<Address[]>;
  private user$: Observable<User>;
  hasPreferredAddresses = false;
  preferredAddressesEqual: boolean;
  preferredInvoiceToAddress: Address;
  preferredShipToAddress: Address;

  selectInvoiceConfig: FormlyFieldConfig;
  selectShippingConfig: FormlyFieldConfig;

  isCreateAddressFormCollapsed = true;
  updateFormExpandedAddressId: string;

  preferredAddressForm: FormGroup = new FormGroup({});
  furtherAddresses: Address[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private accountFacade: AccountFacade,
    private featureToggleService: FeatureToggleService,
    private featureEventService: FeatureEventService
  ) {}

  ngOnInit() {
    this.addresses$ = this.accountFacade.addresses$().pipe(shareReplay(1));
    this.user$ = this.accountFacade.user$;

    // trigger set preferred invoice address if it changes
    this.preferredAddressForm.valueChanges
      .pipe(
        filter(value => value.preferredInvoiceAddressUrn),
        map(value => value.preferredInvoiceAddressUrn),
        distinctUntilChanged(),
        withLatestFrom(this.user$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([urn, user]) => {
        if (urn) {
          this.accountFacade.updateUser(
            { ...user, preferredInvoiceToAddressUrn: urn },
            { message: 'account.addresses.preferredinvoice.change.message' }
          );
          this.preferredAddressForm.get('preferredInvoiceAddressUrn').setValue('', { emitEvent: false });
        }
      });

    // trigger set preferred shipping address if it changes
    this.preferredAddressForm.valueChanges
      .pipe(
        filter(value => value.preferredShippingAddressUrn),
        map(value => value.preferredShippingAddressUrn),
        distinctUntilChanged(),
        withLatestFrom(this.user$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([urn, user]) => {
        if (urn) {
          this.accountFacade.updateUser(
            { ...user, preferredShipToAddressUrn: urn },
            { message: 'account.addresses.preferredshipping.change.message' }
          );
          this.preferredAddressForm.get('preferredShippingAddressUrn').setValue('', { emitEvent: false });
        }
      });

    const addressesAndUser$ = combineLatest([this.addresses$.pipe(whenTruthy()), this.user$.pipe(whenTruthy())]);

    // Selectbox formly configurations
    this.selectInvoiceConfig = {
      key: 'preferredInvoiceAddressUrn',
      type: 'ish-select-field',
      props: {
        fieldClass: 'w-100',
        options: addressesAndUser$.pipe(
          map(([addresses, user]) =>
            addresses.filter(
              (address: Address) =>
                ((user.preferredInvoiceToAddressUrn && address.urn !== user.preferredInvoiceToAddressUrn) ||
                  !user.preferredInvoiceToAddressUrn) &&
                address.invoiceToAddress
            )
          ),
          mapToAddressOptions()
        ),
        placeholder: 'account.addresses.preferredinvoice.button.label',
        ariaLabel: 'account.addresses.preferredinvoice.heading',
      },
    };

    this.selectShippingConfig = {
      key: 'preferredShippingAddressUrn',
      type: 'ish-select-field',
      props: {
        fieldClass: 'w-100',
        options: addressesAndUser$.pipe(
          map(([addresses, user]) =>
            addresses.filter(
              (address: Address) =>
                ((user.preferredShipToAddressUrn && address.urn !== user.preferredShipToAddressUrn) ||
                  !user.preferredShipToAddressUrn) &&
                address.shipToAddress
            )
          ),
          mapToAddressOptions()
        ),
        placeholder: 'account.addresses.preferredshipping.button.label',
        ariaLabel: 'account.addresses.preferredshipping.heading',
      },
    };

    addressesAndUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([addresses, user]) => {
      this.calculateFurtherAddresses(addresses, user);

      this.hasPreferredAddresses = !!user.preferredInvoiceToAddressUrn || !!user.preferredShipToAddressUrn;

      // determine preferred addresses
      this.preferredInvoiceToAddress = this.getAddress(addresses, user.preferredInvoiceToAddressUrn);
      this.preferredShipToAddress = this.getAddress(addresses, user.preferredShipToAddressUrn);

      this.preferredAddressesEqual = AddressHelper.equal(this.preferredInvoiceToAddress, this.preferredShipToAddress);

      // close possibly open address forms
      if (!this.isCreateAddressFormCollapsed) {
        this.hideCreateAddressForm();
      }
    });
  }

  showCreateAddressForm() {
    this.isCreateAddressFormCollapsed = false;
  }
  hideCreateAddressForm() {
    this.isCreateAddressFormCollapsed = true;
  }

  showUpdateAddressForm(address: Address) {
    this.updateFormExpandedAddressId = address.id;
  }
  hideUpdateAddressForm() {
    this.updateFormExpandedAddressId = undefined;
  }

  isUpdateAddressFormCollapsed(address: Address) {
    return address?.id !== this.updateFormExpandedAddressId;
  }

  createAddress(address: Address) {
    if (this.featureToggleService.enabled('addressDoctor')) {
      const id = this.featureEventService.sendNotification('addressDoctor', 'check-address', {
        address,
      });

      this.featureEventService
        .eventResultListener$('addressDoctor', 'check-address', id)
        .pipe(whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef))
        .subscribe(({ data }) => {
          if (data) {
            this.accountFacade.createCustomerAddress(data);
          }
        });
    } else {
      this.accountFacade.createCustomerAddress(address);
    }
  }

  updateAddress(address: Address): void {
    if (this.featureToggleService.enabled('addressDoctor')) {
      const id = this.featureEventService.sendNotification('addressDoctor', 'check-address', {
        address,
      });

      this.featureEventService
        .eventResultListener$('addressDoctor', 'check-address', id)
        .pipe(whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef))
        .subscribe(({ data }) => {
          if (data) {
            this.accountFacade.updateCustomerAddress(data);
          }
        });
    } else {
      this.accountFacade.updateCustomerAddress(address);
    }
    this.hideUpdateAddressForm();
  }

  deleteAddress(address: Address) {
    this.accountFacade.deleteCustomerAddress(address.id);
  }

  // helper methods

  private getAddress(addresses: Address[], urn: string) {
    return addresses && !!urn ? addresses.find(address => address.urn === urn) : undefined;
  }

  private calculateFurtherAddresses(addresses: Address[], user: User) {
    // all addresses of the user except the preferred invoiceTo and shipTo addresses
    this.furtherAddresses = addresses.filter(
      (address: Address) =>
        (!user.preferredInvoiceToAddressUrn || address.urn !== user.preferredInvoiceToAddressUrn) &&
        (!user.preferredShipToAddressUrn || address.urn !== user.preferredShipToAddressUrn)
    );
  }
}
