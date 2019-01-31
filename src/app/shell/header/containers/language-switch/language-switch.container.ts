import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getAvailableLocales, getCurrentLocale } from 'ish-core/store/locale';

@Component({
  selector: 'ish-language-switch-container',
  templateUrl: './language-switch.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchContainerComponent {
  @Input() view: '' | 'accordion' = '';

  locale$ = this.store.pipe(select(getCurrentLocale));
  availableLocales$ = this.store.pipe(select(getAvailableLocales));

  constructor(private store: Store<{}>) {}
}
