import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Country } from '../../../../models/country';
import { CountryService } from '../../../../services/countries/country.service';
import { SpecialValidators } from '../../../../shared/validators/special-validators';
import { SelectOption } from '../../form-controls/select/select.component';

@Component({
  selector: 'is-address-form',
  templateUrl: './address-form.component.html',
  providers: [CountryService]
})
export class AddressFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  /*
    create address form group with all controls which are needed on all country specific sub address forms
  */
  private createForm() {
    this.addressForm = this.fb.group({
      countryCode: ['', [Validators.required]],
      firstName: ['', [Validators.required, SpecialValidators.noSpecialChars]],
      lastName: ['', [Validators.required, SpecialValidators.noSpecialChars]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      postalCode: [''],
      city: ['', [Validators.required]],
      phoneHome: ['']
    });

    // add address form group to the given parent form
    this.parentForm.addControl('address', this.addressForm);
  }

  // get countries of the address form
  get countries(): SelectOption[] {
    let options: SelectOption[] = [];
    const countries = this.countryService.getCountries();
    if (countries) {
      // Map region array to an array of type SelectOption
      options = countries.map(function(country: Country) {
        return {
          'label': country.name,
          'value': country.countryCode
        };
      });
    }
    return options;
  }

  // get countryCode for showing a country dependent sub address form component
  get countryCode() { return this.addressForm.get('countryCode'); }
}
