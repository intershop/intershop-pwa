import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Address } from 'ish-core/models/address/address.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Customer Address Form Component renders an address form with apply/cancel buttons so that the user can create or edit an address. When the user submits the form the new/changed address will be sent to the parent component.
 *
 * @example
 * <ish-customer-address-form
      [address]="basket.invoiceToAddress"
      [resetForm]="resetForm"
      (save)="createCustomerInvoiceAddress($event)"
      (cancel)="cancelCreateCustomerInvoiceAddress()"
   ></ish-checkout-address-form>
 */
@Component({
  selector: 'ish-customer-address-form',
  templateUrl: './customer-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CustomerAddressFormComponent implements OnInit, OnChanges {
  @Input() address: Address;
  @Input() resetForm = false;

  @Output() save = new EventEmitter<Address>();
  @Output() cancel = new EventEmitter();

  form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // create form for creating a new address
    this.form = this.fb.group({
      countryCodeSwitch: ['', [Validators.required]],
      // create address sub form, init/country change will be done by address-form-container
      address: this.fb.group({}),
    });

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
      this.form.controls.countryCodeSwitch.setValue(''); // prevent null value to show please select entry
      this.submitted = false;
    }
  }

  initializeAddressForm(address: Address) {
    if (this.form && address) {
      this.form.reset();
      this.form.controls.address.patchValue(this.address);
      this.form.controls.countryCodeSwitch.setValue(this.address.countryCode);
    }
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
}
