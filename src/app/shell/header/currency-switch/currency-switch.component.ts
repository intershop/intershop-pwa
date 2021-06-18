import { LocationStrategy, getCurrencySymbol } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';

@Component({
  selector: 'ish-currency-switch',
  templateUrl: './currency-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySwitchComponent implements OnInit {
  @Input() view: '' | 'accordion' = '';
  /**
   * determines position of dropbox
   */
  @Input() placement: '' | 'up' = '';

  visible$: Observable<boolean>;
  locale$: Observable<string>;
  currency$: Observable<string>;
  availableCurrencies$: Observable<string[]>;

  constructor(private appFacade: AppFacade, public location: LocationStrategy) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.currency$ = this.appFacade.currentCurrency$;
    this.availableCurrencies$ = this.appFacade.availableCurrencies$;
    this.visible$ = this.availableCurrencies$.pipe(map(currencies => currencies?.length > 1));
  }

  getSymbol$(currency: string) {
    return this.locale$.pipe(map(locale => getCurrencySymbol(currency, 'narrow', locale)));
  }
}
