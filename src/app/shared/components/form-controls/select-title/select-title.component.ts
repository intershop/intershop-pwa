import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SelectOption } from '../select/select.component';

@Component({
  selector: 'is-select-title',
  templateUrl: './select-title.component.html'
})
export class SelectTitleComponent implements OnInit {
  @Input() form: FormGroup;     // required
  @Input() countryCode: string; // component will only be rendered if set
  @Input() controlName: string;
  @Input() formName: string;
  @Input() label: string;
  @Input() labelClass: string;  // default: 'col-sm-4'
  @Input() inputClass: string;  // default: 'col-sm-8'
  @Input() markRequiredLabel: string; /* values: 'auto' (default) - label is marked, if an required validator is set
                                                 'on' (label is always marked as required),
                                                 'off' (label is never marked as required) */


  constructor() { }

  ngOnInit() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for SelectTitleComponent');
    }
    this.setDefaultValues();
  }

  /*
   set default values for empty input parameters
 */
  private setDefaultValues() {
    if (!this.controlName) { this.controlName = 'title'; }
    if (!this.label) { this.label = 'Salutation'; }     // ToDo: Translation key
  }

  // get titles for the country of the address form
  get titles(): SelectOption[] {
    let options: SelectOption[] = [];
    const titles = this.getTitles(this.countryCode);

    if (titles) {
      // Map title array to an array of type SelectOption
      options = titles.map(title => {
        return {
          'label': title,
          'value': title
        };
      });
    } else {
      this.form.get('title').clearValidators();
    }
    return options;
  }

  // ToDo: replace this code, return titles from a service
  getTitles(countrycode) {
    if (countrycode) {
      return [
        'account.salutation.ms.text',
        'account.salutation.mr.text',
        'account.salutation.mrs.text'
      ];
    }
    return [];
  }
}
