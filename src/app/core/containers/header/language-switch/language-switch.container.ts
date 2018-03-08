import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Locale } from '../../../../models/locale/locale.interface';
import { CoreState, getAvailableLocales, getCurrentLocale, SelectLocale } from '../../../store/locale';

@Component({
  selector: 'ish-language-switch-container',
  templateUrl: './language-switch.container.html'
})
export class LanguageSwitchContainerComponent implements OnInit {

  locale$: Observable<Locale>;
  availableLocales$: Observable<Locale[]>;

  constructor(
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.locale$ = this.store.pipe(select(getCurrentLocale));
    this.availableLocales$ = this.store.pipe(select(getAvailableLocales));
  }

  switch(locale: Locale) {
    this.store.dispatch(new SelectLocale(locale));
  }
}
