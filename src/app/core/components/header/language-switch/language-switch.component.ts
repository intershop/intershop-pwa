import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Locale } from '../../../../models/locale/locale.model';

@Component({
  selector: 'ish-language-switch',
  templateUrl: './language-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchComponent {
  @Input()
  locale: Locale;
  @Input()
  availableLocales: Locale[];
  @Input()
  view: '' | 'accordion' = '';
  @Output()
  localeChange = new EventEmitter<Locale>();

  switch(locale: Locale) {
    this.localeChange.emit(locale);
    return false; // prevent actual navigation, only change localized values on the current page and set language state
  }
}
