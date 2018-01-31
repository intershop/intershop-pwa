import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SelectOption } from '../select/select-option.interface';

@Component({
  selector: 'ish-select-language',
  templateUrl: './select-language.component.html'
})
export class SelectLanguageComponent implements OnChanges {

  @Input() form: FormGroup;
  @Input() languages: any[]; // TODO: type
  @Input() controlName = 'preferredLanguage';
  @Input() label = 'account.default_address.preferred_language.label';
  @Input() errorMessages = { required: 'Please select a preferred language' };  // ToDo: Translation key

  options: SelectOption[] = [];

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
