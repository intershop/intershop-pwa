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
  ViewChild,
} from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
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
  selector: 'ish-formly-customer-address-form',
  templateUrl: './formly-customer-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyCustomerAddressFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() address: Partial<Address>;
  @Input() resetForm = false;

  @Output() save = new EventEmitter<Address>();
  @Output() cancel = new EventEmitter();

  form: FormGroup;
  submitted = false;
  businessCustomer$: Observable<boolean>;

  @ViewChild('addressForm') addressForm: FormGroupDirective;

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade) {}

  get buttonLabel() {
    return Object.keys(this.address ?? {}).length > 0
      ? 'account.addresses.update_address.button.label'
      : 'account.addresses.create_address.button.label';
  }

  ngOnInit() {
    this.businessCustomer$ = this.accountFacade.isBusinessCustomer$.pipe(takeUntil(this.destroy$));

    // create form for creating a new address
    this.form = new FormGroup({
      address: new FormGroup({}),
    });
  }

  /**
   * Trigger reset form from parent.
   */
  ngOnChanges(c: SimpleChanges) {
    this.doResetForm(c.resetForm && c.resetForm.currentValue);
  }

  doResetForm(resetForm: boolean) {
    if (resetForm && this.form) {
      this.addressForm.resetForm();
      this.form.reset();
      this.submitted = false;
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
