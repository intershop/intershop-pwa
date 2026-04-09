import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle';
import { Address } from 'ish-core/models/address/address.model';
import { FORMLY_ADDRESS_FORMS_COMPONENTS } from 'ish-shared/formly-address-forms/formly-address-forms';

/**
 * The Customer Address Form Component renders an address form with apply/cancel buttons so that the user can create or edit an address.
 * When the user submits the form the new/changed address will be sent to the parent component.
 *
 * @example
 * <ish-customer-address-form
      [address]="basket.invoiceToAddress"
      [resetForm]="resetForm"
      (save)="createCustomerInvoiceAddress($event)"
      (cancel)="cancelCreateCustomerInvoiceAddress()"
   />
 */
@Component({
  selector: 'ish-formly-customer-address-form',
  templateUrl: './formly-customer-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, ...FORMLY_ADDRESS_FORMS_COMPONENTS, AsyncPipe],
})
export class FormlyCustomerAddressFormComponent implements OnInit, OnChanges {
  @Input() address: Partial<Address>;
  // not-dead-code
  @Input() resetForm = false;
  // display address extension form fields
  @Input() extension = false;

  @Output() readonly save = new EventEmitter<Address>();
  @Output() readonly cancelForm = new EventEmitter();

  form: FormGroup;
  extensionForm: FormGroup = new FormGroup({});

  extensionModel: { email: string };

  businessCustomer$: Observable<boolean>;

  @ViewChild('addressForm') addressForm: FormGroupDirective;

  constructor(
    private accountFacade: AccountFacade,
    private featureToggleService: FeatureToggleService
  ) {}

  get buttonLabel() {
    return Object.keys(this.address ?? {}).length > 0
      ? 'account.addresses.update_address.button.label'
      : 'account.addresses.create_address.button.label';
  }

  ngOnInit() {
    this.businessCustomer$ = this.accountFacade.isBusinessCustomer$.pipe(
      withLatestFrom(this.accountFacade.isLoggedIn$),
      map(([isBusinessCustomer, isLoggedIn]) =>
        isBusinessCustomer || isLoggedIn
          ? isBusinessCustomer
          : this.featureToggleService.enabled('businessCustomerRegistration')
      )
    );

    // create form for creating a new address
    this.form = new FormGroup({
      address: new FormGroup({}),
      additionalAddressAttributes: this.extensionForm,
    });
  }

  /**
   * Trigger reset form from parent.
   */
  ngOnChanges(c: SimpleChanges) {
    this.doResetForm(c.resetForm?.currentValue);

    this.extensionModel = this.address ? { email: this.address.email } : undefined;
  }

  private doResetForm(resetForm: boolean) {
    if (resetForm && this.form) {
      this.addressForm.resetForm();
      this.form.reset();
    }
  }

  submitForm() {
    if (this.form.valid) {
      // build address from form data and send it to the parent
      let formAddress: Address = this.form.value.address;
      if (this.address) {
        // update form values in the original address
        formAddress = { ...this.address, mainDivisionCode: '', ...formAddress };
      }
      if (this.extension) {
        formAddress = { ...formAddress, email: this.extensionForm.get('email')?.value };
      }
      this.save.emit(formAddress);
    }
  }

  emitCancelForm() {
    this.cancelForm.emit();
  }
}
