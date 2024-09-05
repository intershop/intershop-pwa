import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Address } from 'ish-core/models/address/address.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { AddressFormConfigurationProvider } from 'ish-shared/formly-address-forms/configurations/address-form-configuration.provider';

/**
 * Address Form Component that reconfigures itself when a new country is selected.
 * Gets field configurations from the `AddressFormConfigurationProvider`.
 *
 * @param parentForm - the parent FormGroup that the address form will belong to
 * @param businessCustomer - whether the address form is for a business customer
 * @param shortForm - whether the address form is in long or short format
 * @param prefilledAddress - a collection of key-value pairs that will be used to prefill the form
 *
 * @example
 * <ish-formly-address-form
      [businessCustomer]="isBusinessCustomer$ | async"
      [shortForm]="true"
      [parentForm]="formGroup"
   ></ish-formly-address-form>
 */
@Component({
  selector: 'ish-formly-address-form',
  templateUrl: './formly-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyAddressFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) parentForm: FormGroup;
  @Input() businessCustomer: boolean;
  @Input() shortForm: boolean;
  @Input() prefilledAddress: Partial<Address>;

  private countryCode = '';

  private countries$: Observable<SelectOption[]>;

  // needed to correctly display the placeholder in the country select box when initializing the form
  private fromInitialized = false;

  addressForm: FormGroup;
  addressModel: { [key: string]: unknown; countryCode: string };
  addressFields: FormlyFieldConfig[];
  addressOptions: FormlyFormOptions = {
    formState: {},
  };

  constructor(private appFacade: AppFacade, private afcProvider: AddressFormConfigurationProvider) {}

  ngOnInit(): void {
    this.countries$ = this.appFacade.countries$()?.pipe(
      filter(countries => !!countries?.length),
      map(countries => countries?.map(country => ({ value: country.countryCode, label: country.name }))),
      tap(() => this.fillForm(this.prefilledAddress)),
      shareReplay(1)
    );
    this.initForm();
    this.parentForm?.setControl('address', this.addressForm);
  }

  ngOnChanges(c: SimpleChanges) {
    this.fillForm(c.prefilledAddress?.currentValue);
  }

  handleCountryChange(model: { countryCode: string }) {
    // extract old and new countryCode
    const prevCountryCode = this.countryCode;
    this.countryCode = model.countryCode;

    if (model.countryCode !== prevCountryCode) {
      const configuration = this.afcProvider.getConfiguration(model.countryCode, this.businessCustomer, this.shortForm);

      // assign new form, model and fields
      this.addressForm = new FormGroup({
        countryCode: new FormControl(''),
      });
      this.addressModel = {
        countryCode: model.countryCode,
        ...configuration.getModel(this.addressModel),
      };

      this.addressFields = [
        (this.fromInitialized && this.isCountryAlreadySelected()) || this.createCountrySelectField(),
      ].concat(configuration.getFieldConfiguration(model.countryCode));

      this.addressModel.countryCode = model.countryCode;
      this.addressForm.updateValueAndValidity();
      if (model.countryCode) {
        this.addressForm.get('countryCode').markAsDirty();
      }

      this.parentForm?.setControl('address', this.addressForm);
    }
  }

  private createCountrySelectField(): FormlyFieldConfig {
    return {
      type: 'ish-fieldset-field',
      fieldGroup: [
        {
          key: 'countryCode',
          type: 'ish-select-field',
          props: {
            required: true,
            label: 'account.address.country.label',
            forceRequiredStar: true,
            placeholder: 'account.option.select.text',
            options: this.countries$,
          },
          validation: {
            messages: {
              required: 'account.address.country.error.default',
            },
          },
        },
      ],
    };
  }

  // prevent re-initializing the country select field so the tab-focus doesn't get lost when selecting a country and the form is updated
  // this also allows for a correct selection via the arrow keys when the select box dropdown isn't opened
  private isCountryAlreadySelected(): FormlyFieldConfig {
    return this.addressFields?.find(field => field.fieldGroup?.[0]?.key === 'countryCode');
  }

  private initForm() {
    const configuration = this.afcProvider.getConfiguration('default', this.businessCustomer, this.shortForm);
    this.addressForm = new FormGroup({});
    this.addressModel = {
      countryCode: '',
      ...configuration.getModel(),
    };
    this.addressFields = [this.createCountrySelectField()].concat(configuration.getFieldConfiguration());
  }

  private fillForm(prefilledAddress: Partial<Address> = {}) {
    if (!this.addressForm) {
      return;
    }
    if (Object.keys(prefilledAddress).length === 0) {
      this.addressModel = {
        countryCode: '',
      };
    }

    this.addressModel.countryCode = prefilledAddress.countryCode;
    this.handleCountryChange(this.addressModel);
    this.addressModel = {
      countryCode: this.addressModel.countryCode,
      ...prefilledAddress,
    };
    this.addressForm.updateValueAndValidity();

    this.fromInitialized = true;
  }
}
