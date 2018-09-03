import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Locale } from '../../../../models/locale/locale.model';
import { SelectLocale, getAvailableLocales, getCurrentLocale } from '../../../store/locale';

@Component({
  selector: 'ish-language-switch-container',
  templateUrl: './language-switch.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchContainerComponent implements OnInit {
  locale$: Observable<Locale>;
  availableLocales$: Observable<Locale[]>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.locale$ = this.store.pipe(select(getCurrentLocale));
    this.availableLocales$ = this.store.pipe(select(getAvailableLocales));
  }

  switch(locale: Locale) {
    this.store.dispatch(new SelectLocale(locale));
  }
}
