import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { SelectOption } from '../../select/select-option.interface';
import { SelectComponent } from '../select.component';

@Component({
  selector: 'ish-select-language',
  templateUrl: '../select.component.html'
})
export class SelectLanguageComponent extends SelectComponent implements OnChanges {

  @Input() languages: any[]; // TODO: type
  @Input() controlName = 'preferredLanguage';
  @Input() label = 'account.default_address.preferred_language.label';
  @Input() errorMessages = { required: 'Please select a preferred language' };  // ToDo: Translation key

  ngOnChanges(c: SimpleChanges) {
    if (c.languages) {
      this.options = this.mapToOptions(this.languages);
    }
  }

  private mapToOptions(languages: any[]): SelectOption[] { // TODO: type
    if (!languages) { return; }
    return languages.map(lang => ({
      label: lang.name,
      value: lang.localeid
    } as SelectOption));
  }
}
