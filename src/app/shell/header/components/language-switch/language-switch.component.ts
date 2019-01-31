import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Locale } from 'ish-core/models/locale/locale.model';

@Component({
  selector: 'ish-language-switch',
  templateUrl: './language-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchComponent {
  @Input() locale: Locale;
  @Input() availableLocales: Locale[];
  @Input() view: '' | 'accordion' = '';

  constructor(public location: Location) {}
}
