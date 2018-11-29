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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Country } from 'ish-core/models/country/country.model';
import { Region } from 'ish-core/models/region/region.model';
import { markAsDirtyRecursive } from '../../../forms/utils/form-utils';
import { AddressFormFactoryProvider } from '../../configurations/address-form-factory.provider';

/**
 * The Customer Address Form Component renders an address form with apply/cancel buttons so that the user can create or edit an address. When the user submits the form the new/changed address will be sent to the parent component.
 *
 * @example
 * <ish-customer-address-form
      [regions]="regions"
      [titles]="titles"
      [countries]="countries"
      [address]="basket.invoiceToAddress"
      [resetForm]="resetForm"
      (save)="createCustomerInvoiceAddress($event)"
      (cancel)="cancelCreateCustomerInvoiceAddress()"
      (countryChange)="handleCountryChange($event)"
   ></ish-checkout-address-form>
 */
@Component({
  selector: 'ish-customer-address-form',
  templateUrl: './customer-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAddressFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  countries: Country[];
  @Input()
  regions: Region[];
  @Input()
  titles: string[];
  @Input()
  address: Address;
  @Input()
  resetForm = false;

  @Output()
  save = new EventEmitter<Address>();
  @Output()
  cancel = new EventEmitter();
  @Output()
  countryChange = new EventEmitter<string>();

  form: FormGroup;
  submitted = false;

  destroy$ = new Subject();

  constructor(private fb: FormBuilder, private afs: AddressFormFactoryProvider) {}

  ngOnInit() {
    // create form for creating a new address
    this.form = this.fb.group({
      countryCodeSwitch: ['', [Validators.required]],
      address: this.afs.getFactory('default').getGroup(), // filled dynamically when country code changes
    });

    // build and register new address form when country code changed
    this.form
      .get('countryCodeSwitch')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(countryCodeSwitch => this.handleCountryChange(countryCodeSwitch));

    // initialize address form
    this.initializeAddressForm(this.address);
  }

  /**
   * Trigger reset form from parent.
   */
  ngOnChanges(c: SimpleChanges) {
    this.doResetForm(c.resetForm && c.resetForm.currentValue);
    this.initializeAddressForm(c.address && this.address);
  }

  doResetForm(resetForm: boolean) {
    if (resetForm && this.form) {
      this.form.reset();
    }
  }

  initializeAddressForm(address: Address) {
    if (this.form && address) {
      this.form.reset();
      this.form.controls.address.patchValue(this.address);
      this.form.controls.countryCodeSwitch.setValue(this.address.countryCode);
      this.handleCountryChange(this.address.countryCode);
    }
  }

  /**
   * Changes address form after country has been changed.
   * Emits countryChange event to get country specific data like regions and salutations
   * @param countryCode country code of the country that has been selected in the address form
   */
  private handleCountryChange(countryCode: string) {
    const oldFormValue = this.form.get('address').value;
    const group = this.afs.getFactory(countryCode).getGroup({
      ...oldFormValue,
      countryCode,
    });
    this.form.setControl('address', group);

    this.countryChange.emit(countryCode);
  }

  get countryCode() {
    return this.form.get('countryCodeSwitch').value;
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }

  submitForm() {
    // if the form is invalid only mark all invalid fields
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    // build address from form data and send it to the parent
    let formAddress: Address = this.form.value.address;
    if (this.address) {
      // update form values in the original address
      formAddress = { ...this.address, ...formAddress };
    }
    this.save.emit(formAddress);
  }

  cancelForm() {
    this.cancel.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
