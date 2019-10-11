import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Locale } from 'ish-core/models/locale/locale.model';
import { SelectComponent, SelectOption } from 'ish-shared/forms/components/select/select.component';

@Component({
  selector: 'ish-select-language',
  templateUrl: '../select/select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectLanguageComponent extends SelectComponent implements OnChanges {
  @Input() languages: Locale[];
  @Input() controlName = 'preferredLanguage';
  @Input() label = 'account.default_address.preferred_language.label';
  @Input() errorMessages = { required: 'Please select a preferred language' }; // ToDo: Translation key

  ngOnChanges(c: SimpleChanges) {
    if (c.languages) {
      this.options = this.mapToOptions(this.languages);
    }
  }

  private mapToOptions(languages: Locale[]): SelectOption[] {
    // TODO: insert type
    if (!languages) {
      return;
    }
    return languages.map(lang => ({
      label: lang.displayLong,
      value: lang.lang,
    }));
  }
}
