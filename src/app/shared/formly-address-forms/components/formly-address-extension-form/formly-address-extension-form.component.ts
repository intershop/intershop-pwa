import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Sub form with additional fields like email address and taxation id to extend the anonymous invoice address form.
 */
@Component({
  selector: 'ish-formly-address-extension-form',
  templateUrl: './formly-address-extension-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAddressExtensionFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() businessCustomer: boolean;
  @Input() model: Partial<{ email: string; taxationId: string }> = {}; // model with data for the update mode.

  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.fields = [
      {
        type: 'ish-fieldset-field',
        fieldGroup: [
          {
            key: 'email',
            type: 'ish-email-field',
            templateOptions: {
              required: true,
              label: 'checkout.addresses.email.label',
              customDescription: {
                key: 'account.address.email.hint',
              },
              postWrappers: [{ wrapper: 'description', index: -1 }],
            },
          },
        ],
      },
    ];
    if (this.businessCustomer) {
      this.fields = [this.createTaxationIDField(), ...this.fields];
    }
  }

  private createTaxationIDField(): FormlyFieldConfig {
    return {
      type: 'ish-fieldset-field',
      fieldGroup: [
        {
          type: '#taxationID',
        },
      ],
    };
  }
}
