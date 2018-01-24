import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { SelectOption } from '../select/select-option.interface';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'ish-select-language',
  templateUrl: './select-language.component.html'
})
export class SelectLanguageComponent implements OnChanges {

  @Input() form: FormGroup;
  @Input() languages: any[]; // TODO: type
  @Input() controlName = 'preferredLanguage';
  @Input() label = 'Preferred Language';
  @Input() errorMessages = { required: 'Please select a preferred language' };  // ToDo: Translation key

  options: SelectOption[] = [];

  ngOnChanges(c: SimpleChanges) {
    console.log(c);
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
