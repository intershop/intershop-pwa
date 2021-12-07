import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';

@Component({
  selector: 'ish-checkout-address-anonymous-form',
  templateUrl: './checkout-address-anonymous-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressAnonymousFormComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  formControl: FormControl;

  invoiceAddressForm = new FormGroup({});
  shippingAddressForm = new FormGroup({});
  form: FormGroup = new FormGroup({});

  addressFields: FormlyFieldConfig[];
  addressOptions: FormlyFormOptions = {};

  shipOptionFields: FormlyFieldConfig[];

  isBusinessCustomer = false;

  private destroy$ = new Subject();

  get isShippingAddressFormExpanded() {
    return this.form && this.form.get('shipOption').value === 'shipToDifferentAddress';
  }

  constructor(private featureToggleService: FeatureToggleService) {}

  ngOnInit() {
    this.addressFields = [
      {
        type: 'ish-fieldset-field',
        fieldGroup: [
          {
            key: 'email',
            type: 'ish-email-field',
            templateOptions: {
              required: true,
              label: 'checkout.addresses.email.label',
              forceRequiredStar: true,
              customDescription: {
                key: 'account.address.email.hint',
              },
              postWrappers: [{ wrapper: 'description', index: -1 }],
            },
          },
        ],
      },
    ];

    if (this.featureToggleService.enabled('businessCustomerRegistration')) {
      this.addressFields = [this.createTaxationIDField(), ...this.addressFields];
      this.isBusinessCustomer = true;
    }

    this.shipOptionFields = [
      {
        type: 'ish-radio-field',
        key: 'shipOption',
        defaultValue: 'shipToInvoiceAddress',
        templateOptions: {
          label: 'checkout.addresses.shipping_address.option1.text',
          value: 'shipToInvoiceAddress',
        },
      },
      {
        type: 'ish-radio-field',
        key: 'shipOption',
        defaultValue: 'shipToInvoiceAddress',
        templateOptions: {
          label: 'checkout.addresses.shipping_address.option2.text',
          value: 'shipToDifferentAddress',
        },
      },
    ];
    this.parentForm.setControl('invoiceAddress', this.invoiceAddressForm);
    this.parentForm.setControl('additionalAddressAttributes', this.form);

    // add / remove shipping form if shipTo address option changes
    this.parentForm
      .get('additionalAddressAttributes')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(attributes => {
        attributes.shipOption === 'shipToInvoiceAddress'
          ? this.parentForm.removeControl('shippingAddress')
          : this.parentForm.setControl('shippingAddress', this.shippingAddressForm);
      });
  }

  private createTaxationIDField(): FormlyFieldConfig {
    return {
      type: 'ish-fieldset-field',
      fieldGroup: [
        {
          key: 'taxationID',
          type: 'ish-text-input-field',
          templateOptions: {
            label: 'account.address.taxation.label',
          },
        },
      ],
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
