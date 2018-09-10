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

import { AddressFormFactoryProvider } from '../../../../forms/address/configurations/address-form-factory.provider';
import { markAsDirtyRecursive } from '../../../../forms/shared/utils/form-utils';
import { Address } from '../../../../models/address/address.model';
import { Country } from '../../../../models/country/country.model';
import { Region } from '../../../../models/region/region.model';

/**
 * The Checkout Address Form Component renders an address form so that the user can create a new address during the checkout process. See also {@link CheckoutAddressComponent}
 *
 * @example
 * <ish-checkout-address-form
      [regions]="regions"
      [titles]="titles"
      [countries]="countries"
      [resetForm]="resetForm"
      (submit)="createCustomerInvoiceAddress($event)"
      (cancel)="cancelCreateCustomerInvoiceAddress()"
      (countryChange)="handleCountryChange($event)"
   ></ish-checkout-address-form>
 */
@Component({
  selector: 'ish-checkout-address-form',
  templateUrl: './checkout-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  countries: Country[];
  @Input()
  regions: Region[];
  @Input()
  titles: string[];
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
  }

  /**
   * Trigger reset form from parent.
   */
  ngOnChanges(c: SimpleChanges) {
    if (c.resetForm && this.form) {
      this.form.reset();
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
    const address: Address = this.form.value.address;
    this.save.emit(address);
  }

  cancelForm() {
    this.cancel.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
