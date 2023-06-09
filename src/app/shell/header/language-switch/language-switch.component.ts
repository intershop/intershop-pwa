import { LocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

@Component({
  selector: 'ish-language-switch',
  templateUrl: './language-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchComponent implements OnInit {
  @Input() view: '' | 'accordion' = '';
  /**
   * determines position of dropbox
   */
  @Input() placement: '' | 'up' = '';

  locale$: Observable<string>;
  availableLocales$: Observable<string[]>;

  constructor(
    private appFacade: AppFacade,
    private cookiesService: CookiesService,
    public location: LocationStrategy
  ) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.availableLocales$ = this.appFacade.availableLocales$;
  }

  setLocaleCookie(locale: string) {
    this.cookiesService.put('preferredLocale', locale, {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      path: '/',
    });
    return true;
  }
}
