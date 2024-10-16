import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';

@Component({
  selector: 'ish-checkout-address-anonymous-form',
  templateUrl: './checkout-address-anonymous-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressAnonymousFormComponent implements OnInit {
  @Input({ required: true }) parentForm: FormGroup;
  @Input() invoiceFormId: string;
  @Input() shippingFormId: string;

  invoiceAddressForm = new FormGroup({});
  shippingAddressForm = new FormGroup({});
  attributesForm: FormGroup = new FormGroup({});
  shipOptionForm: FormGroup = new FormGroup({});

  shipOptionFields: FormlyFieldConfig[];

  isBusinessCustomer = false;

  private destroyRef = inject(DestroyRef);

  get isShippingAddressFormExpanded() {
    return this.shipOptionForm && this.shipOptionForm.get('shipOption').value === 'shipToDifferentAddress';
  }

  constructor(private featureToggleService: FeatureToggleService) {}

  ngOnInit() {
    if (this.featureToggleService.enabled('businessCustomerRegistration')) {
      this.isBusinessCustomer = true;
    }

    this.shipOptionFields = [
      {
        type: 'ish-radio-field',
        key: 'shipOption',
        defaultValue: 'shipToInvoiceAddress',
        props: {
          label: 'checkout.addresses.shipping_address.option1.text',
          value: 'shipToInvoiceAddress',
        },
      },
      {
        type: 'ish-radio-field',
        key: 'shipOption',
        defaultValue: 'shipToInvoiceAddress',
        props: {
          label: 'checkout.addresses.shipping_address.option2.text',
          value: 'shipToDifferentAddress',
        },
      },
    ];
    this.parentForm.setControl('invoiceAddress', this.invoiceAddressForm);
    this.parentForm.setControl('additionalAddressAttributes', this.attributesForm);
    this.parentForm.setControl('shipOptions', this.shipOptionForm);

    // add / remove shipping form if shipTo address option changes
    this.parentForm
      .get('shipOptions')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(options => {
        options.shipOption === 'shipToInvoiceAddress'
          ? this.parentForm.removeControl('shippingAddress')
          : this.parentForm.setControl('shippingAddress', this.shippingAddressForm);
      });
  }
}
