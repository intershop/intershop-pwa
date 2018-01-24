import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../../../models/country/country.model';
import { Region } from '../../../models/region/region.model';

@Component({
  selector: 'ish-address-form',
  templateUrl: './address-form.component.html'
})
export class AddressFormComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() controlName = 'address';
  @Input() countryCode: any;
  @Input() countries: Country[];
  @Input() regions: Region[];

  ngOnInit() {
    if (!this.parentForm) {
      throw new Error('required input parameter <parentForm> is missing for AddressFormComponent');
    }
  }

  get addressForm(): FormGroup {
    return this.parentForm.get(this.controlName) as FormGroup;
  }
}
