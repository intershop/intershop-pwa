import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle';
import { Address } from 'ish-core/models/address/address.model';
import { FeatureEventService } from 'ish-core/utils/feature-event/feature-event.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { FormlyCustomerAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-customer-address-form/formly-customer-address-form.component';
import { FormsService } from 'ish-shared/forms/utils/forms.service';

import { AddressDoctorComponent } from '../../../../extensions/address-doctor/shared/address-doctor/address-doctor.component';

/**
 * Standalone widget component for selecting and setting the basket invoice address in the checkout.
 */
@Component({
  selector: 'ish-basket-invoice-address-widget',
  templateUrl: './basket-invoice-address-widget.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    AsyncPipe,
    TranslatePipe,
    NgIf,
    AddressDoctorComponent,
    FormlyForm,
    NgbCollapseModule,
    ReactiveFormsModule,
    FormlyCustomerAddressFormComponent,
    AddressComponent,
  ],
})
export class BasketInvoiceAddressWidgetComponent implements OnInit {
  @Input({ required: true }) eligibleAddresses$: Observable<Address[]>;
  @Input() showErrors = true;

  @Output() collapseChange = new BehaviorSubject(true);

  @Input()
  set collapse(value: boolean) {
    this.collapseChange.next(value);
    if (value) {
      this.editAddress = {};
    }
  }
  invoiceAddress$: Observable<Address>;
  addresses$: Observable<Address[]>;
  isLoggedIn$: Observable<boolean>;

  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[];
  editAddress: Partial<Address>;
  private emptyOptionLabel = 'checkout.addresses.select_invoice_address.button';

  private destroyRef = inject(DestroyRef);

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private featureToggleService: FeatureToggleService,
    private featureEventService: FeatureEventService
  ) {}

  ngOnInit() {
    this.invoiceAddress$ = this.checkoutFacade.basketInvoiceAddress$;

    this.invoiceAddress$
      .pipe(
        map(address =>
          address
            ? 'checkout.addresses.select_a_different_invoice_address.default'
            : 'checkout.addresses.select_invoice_address.button'
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(label => (this.emptyOptionLabel = label));

    // prepare data for invoice select drop down
    this.addresses$ = combineLatest([this.eligibleAddresses$, this.invoiceAddress$]).pipe(
      map(([addresses, invoiceAddress]) =>
        addresses?.filter(address => address.invoiceToAddress).filter(address => address.id !== invoiceAddress?.id)
      )
    );
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;

    this.fields = [
      {
        key: 'id',
        type: 'ish-search-select-field',
        props: {
          fieldClass: 'col-12',
          options: FormsService.getAddressOptions(this.addresses$),
          placeholder: this.emptyOptionLabel,
          ariaLabel: this.emptyOptionLabel,
        },
        hooks: {
          onInit: field => {
            field.form
              .get('id')
              .valueChanges.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef))
              .subscribe(addressId => this.checkoutFacade.assignBasketAddress(addressId, 'invoice'));
          },
        },
      },
    ];

    // preassign an invoice address if the user has only one invoice address
    combineLatest([this.addresses$, this.checkoutFacade.basket$])
      .pipe(
        // prevent assigning the address at an anonymous basket after login
        filter(([addresses, basket]) => !!basket?.customerNo && !!addresses?.length),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([addresses, basket]) => {
        if (!basket.invoiceToAddress && addresses.length === 1) {
          this.checkoutFacade.assignBasketAddress(addresses[0].id, 'invoice');
        }
      });

    this.invoiceAddress$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => (this.collapse = true));
  }
  showAddressForm(address?: Address) {
    if (address) {
      this.editAddress = { ...address };
    } else {
      this.editAddress = {};
    }
    this.collapse = false;
  }

  saveAddress(address: Address) {
    if (this.editAddress && Object.keys(this.editAddress).length > 0) {
      if (this.featureToggleService.enabled('addressDoctor')) {
        const id = this.featureEventService.sendNotification('addressDoctor', 'check-address', {
          address,
        });

        this.featureEventService
          .eventResultListener$('addressDoctor', 'check-address', id)
          .pipe(whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef))
          .subscribe(({ data }) => {
            if (data) {
              this.checkoutFacade.updateBasketAddress(data);
              this.collapse = true;
            }
          });
      } else {
        this.checkoutFacade.updateBasketAddress(address);
        this.collapse = true;
      }
    } else {
      if (this.featureToggleService.enabled('addressDoctor')) {
        const id = this.featureEventService.sendNotification('addressDoctor', 'check-address', {
          address,
        });

        this.featureEventService
          .eventResultListener$('addressDoctor', 'check-address', id)
          .pipe(whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef))
          .subscribe(({ data }) => {
            if (data) {
              this.checkoutFacade.createBasketAddress(data, 'invoice');
            }
          });
      } else {
        this.checkoutFacade.createBasketAddress(address, 'invoice');
      }
      (this.form.get('id') as UntypedFormControl).setValue('', { emitEvent: false });
    }
  }

  cancelEditAddress() {
    this.collapse = true;
  }
}

