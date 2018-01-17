import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '../select/select-option.interface';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'ish-select-title',
  templateUrl: '../select/select.component.html',
})
export class SelectTitleComponent extends SelectComponent implements OnChanges, OnInit {
  @Input() countryCode: string;                     // required: component will only be rendered if set

  constructor(
    protected translate: TranslateService
  ) {
    super(translate);
  }

  ngOnInit() {
    if (!this.countryCode) {
      throw new Error('required input parameter <countryCode> is missing for SelectRegionComponent');
    }
    this.setDefaultValues();
    super.componentInit();
  }

  /*
    refresh regions if country input changes
  */
  ngOnChanges(changes: SimpleChanges) {
    this.options = this.getTitleOptions();
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    this.controlName = this.controlName || 'title';
    this.label = this.label || 'account.default_address.title.label';
    this.errorMessages = this.errorMessages || { 'required': 'account.address.title.error.required' };
  }

  /*
    get salutation for the given country
    returns (SelectOption[]) - salutation options
  */
  public getTitleOptions(): SelectOption[] {
    let options: SelectOption[] = [];
    const titles = this.getSalutations(this.countryCode);

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
  private getSalutations(countrycode) {
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
