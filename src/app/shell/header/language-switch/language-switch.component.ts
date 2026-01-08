import { AsyncPipe, LocationStrategy, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { MakeHrefPipe } from 'ish-core/pipes/make-href.pipe';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

/**
 * The Language Switch Component shows a dropdown allowing to switch the current language/locale.
 */
@Component({
  selector: 'ish-language-switch',
  templateUrl: './language-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgbDropdownModule, NgClass, FontAwesomeModule, NgFor, AsyncPipe, TranslateModule, MakeHrefPipe],
})
export class LanguageSwitchComponent implements OnInit {
  @Input() deviceType: DeviceType = 'desktop';
  /**
   * determines position of dropbox
   */
  @Input() placement: '' | 'up' = '';

  languageSwitchData$: Observable<{ locale: string; availableLocales: string[] }>;

  constructor(
    private appFacade: AppFacade,
    private cookiesService: CookiesService,
    private featureToggleService: FeatureToggleService,
    public location: LocationStrategy
  ) {}

  ngOnInit() {
    this.languageSwitchData$ = combineLatest([
      this.appFacade.currentLocale$,
      this.appFacade.availableLocales$,
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
