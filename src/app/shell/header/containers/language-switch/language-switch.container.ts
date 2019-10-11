import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';

@Component({
  selector: 'ish-language-switch-container',
  templateUrl: './language-switch.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchContainerComponent implements OnInit {
  @Input() view: '' | 'accordion' = '';

  locale$: Observable<Locale>;
  availableLocales$: Observable<Locale[]>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.availableLocales$ = this.appFacade.availableLocales$;
  }
}
