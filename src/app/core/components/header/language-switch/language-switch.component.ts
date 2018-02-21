import { Component, Inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Locale } from '../../../../models/locale/locale.interface';
import { AVAILABLE_LOCALES } from '../../../configurations/injection-keys';
import { CoreState } from '../../../store/core.state';
import { getCurrentLocale, SelectLocale } from '../../../store/locale';

@Component({
  selector: 'ish-language-switch',
  templateUrl: './language-switch.component.html'
})

export class LanguageSwitchComponent implements OnInit {

  lang$: Observable<Locale>;

  constructor(
    @Inject(AVAILABLE_LOCALES) public localizationArray,
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.lang$ = this.store.pipe(select(getCurrentLocale));
  }

  languageChange(locale) {
    this.store.dispatch(new SelectLocale(locale));
    return false; // prevent actual navigation, only change localized values on the current page and set language state
  }
}
