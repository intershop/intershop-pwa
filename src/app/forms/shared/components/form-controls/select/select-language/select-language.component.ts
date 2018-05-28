import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Locale } from '../../../../../../models/locale/locale.model';
import { SelectOption } from '../../select/select-option.interface';
import { SelectComponent } from '../select.component';

@Component({
  selector: 'ish-select-language',
  templateUrl: '../select.component.html',
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
    return languages.map(
      lang =>
        ({
          label: lang.displayLong,
          value: lang.lang,
        } as SelectOption)
    );
  }
}
