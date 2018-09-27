import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Locale } from '../../../../models/locale/locale.model';
import { SelectLocale, getAvailableLocales, getCurrentLocale } from '../../../store/locale';

@Component({
  selector: 'ish-language-switch-container',
  templateUrl: './language-switch.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchContainerComponent {
  @Input()
  view: '' | 'accordion' = '';

  locale$ = this.store.pipe(select(getCurrentLocale));
  availableLocales$ = this.store.pipe(select(getAvailableLocales));

  constructor(private store: Store<{}>) {}

  switch(locale: Locale) {
    this.store.dispatch(new SelectLocale(locale));
  }
}
