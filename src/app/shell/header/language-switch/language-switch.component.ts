import { LocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

/**
 * The Language Switch Component shows a dropdown allowing to switch the current language/locale.
 */
@Component({
  selector: 'ish-language-switch',
  templateUrl: './language-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchComponent implements OnInit {
  @Input() deviceType: DeviceType = 'desktop';
  /**
   * determines position of dropbox
   */
  @Input() placement: '' | 'up' = '';

  locale$: Observable<string>;
  availableLocales$: Observable<string[]>;
  languageSwitchData$: Observable<{ locale: string; availableLocales: string[] }>;

  constructor(
    private appFacade: AppFacade,
    private cookiesService: CookiesService,
    private featureToggleService: FeatureToggleService,
    public location: LocationStrategy
  ) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.availableLocales$ = this.appFacade.availableLocales$;
    this.languageSwitchData$ = combineLatest([
      this.locale$,
      this.availableLocales$,
      this.appFacade.serverConfigurationLoaded$,
    ]).pipe(
      filter(
        ([locale, availableLocales, serverConfigLoaded]) =>
          serverConfigLoaded && !!locale && availableLocales?.length > 1
      ),
      map(([locale, availableLocales]) => ({ locale, availableLocales }))
    );
  }

  setLocaleCookie(locale: string) {
    if (this.featureToggleService.enabled('saveLanguageSelection')) {
      this.cookiesService.put('preferredLocale', locale, {
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        path: '/',
      });
      return true;
    }
  }
}
