import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Locale } from '../../../../models/locale/locale.interface';
import { CoreState } from '../../../store/core.state';
import { getAvailableLocales, getCurrentLocale, SelectLocale } from '../../../store/locale';

@Component({
  selector: 'ish-language-switch',
  templateUrl: './language-switch.component.html'
})

export class LanguageSwitchComponent implements OnInit {

  lang$: Observable<Locale>;
  availableLocales$: Observable<Locale[]>;

  constructor(
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.lang$ = this.store.pipe(select(getCurrentLocale));
    this.availableLocales$ = this.store.pipe(select(getAvailableLocales));
  }

  languageChange(locale) {
    this.store.dispatch(new SelectLocale(locale));
    return false; // prevent actual navigation, only change localized values on the current page and set language state
  }
}
