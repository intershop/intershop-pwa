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
          'label': title.label,
          'value': title.value
        };
      });
    } else {
      this.form.get('title').clearValidators();
    }
    return options;
  }

  // ToDo: replace this code, return titles from a service
  // ToDo: react on locale switch and close observables onDestroy
  private getSalutations(countrycode) {
    const salutations = [];
    if (countrycode) {
      this.translate.get('account.salutation.ms.text').subscribe(data => {
        salutations[0] = { 'label': 'account.salutation.ms.text', 'value': data };
      }).unsubscribe();
      this.translate.get('account.salutation.mr.text').subscribe(data => {
        salutations[1] = { 'label': 'account.salutation.mr.text', 'value': data };
      }).unsubscribe();
      this.translate.get('account.salutation.mrs.text').subscribe(data => {
        salutations[2] = { 'label': 'account.salutation.mrs.text', 'value': data };
      }).unsubscribe();
      return salutations;
    }
    return [];
  }
}
