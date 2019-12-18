import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';

@Component({
  selector: 'ish-language-switch',
  templateUrl: './language-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchComponent implements OnInit {
  @Input() view: '' | 'accordion' = '';

  locale$: Observable<Locale>;
  availableLocales$: Observable<Locale[]>;

  constructor(private appFacade: AppFacade, public location: Location) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.availableLocales$ = this.appFacade.availableLocales$;
  }
}
