import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FormElementComponent } from '../form-element/form-element.component';
import { SelectOption } from '../select/select.component';

@Component({
  selector: 'is-select-title',
  templateUrl: './select-title.component.html'
})
export class SelectTitleComponent extends FormElementComponent implements OnInit {
  @Input() countryCode: string; // component will only be rendered if set

  constructor(
    protected translate: TranslateService
  ) { super(translate); }

  ngOnInit() {
    this.setDefaultValues();

    // tslint:disable-next-line:ban
    super.ngOnInit();

  }

  /*
   set default values for empty input parameters
 */
  protected setDefaultValues() {
    if (!this.controlName) { this.controlName = 'title'; }
    if (!this.label) { this.label = 'Salutation'; }     // ToDo: Translation key
    if (!this.errorMessages) {
      this.errorMessages = { 'required': 'Please select a salutation' };  // ToDo: Translation key
    }
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
