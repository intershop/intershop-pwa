import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '../select-option.interface';
import { SelectComponent } from '../select.component';

@Component({
  selector: 'ish-select-title',
  templateUrl: '../select.component.html',
})
export class SelectTitleComponent extends SelectComponent implements OnChanges, OnInit {
  @Input() countryCode: string;

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
    this.translateOptionLabels = true;
    this.translateOptionValues = true;
  }

  /*
    refresh titles if country input changes
  */
  ngOnChanges(changes: SimpleChanges) {
    this.options = this.getSalutations(this.countryCode);
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    this.controlName = this.controlName || 'title';
    this.label = this.label || 'account.default_address.title.label';
    this.errorMessages = this.errorMessages || { 'required': 'account.address.title.error.required' };
  }


  // ToDo: replace this code, get titles from input property
  // ToDo: react on locale switch
  private getSalutations(countryCode): SelectOption[] {
    let salutationlabels = [];
    let options: SelectOption[] = [];

    switch (countryCode) {
      case 'DE': {
        salutationlabels = [
          'account.salutation.ms.text',
          'account.salutation.mr.text',
          'account.salutation.dr.text'
        ];
        break;
      }
      case 'FR': {
        salutationlabels = [
          'account.salutation.ms.text',
          'account.salutation.mr.text',
          'account.salutation.dr.text'
        ];
        break;
      }
      case 'GB': {
        salutationlabels = [
          'account.salutation.ms.text',
          'account.salutation.miss.text',
          'account.salutation.mrs.text',
          'account.salutation.mr.text',
          'account.salutation.dr.text'
        ];
        break;
      }
    }

    if (salutationlabels) {
      // Map questions array to an array of type SelectOption
      options = salutationlabels.map(salutation => {
        return {
          'label': salutation,
          'value': salutation
        };
      });
    }
    return options;
  }
}
