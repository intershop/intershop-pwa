import { AsyncPipe, LocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
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
  imports: [ NgbDropdownModule, AsyncPipe, TranslatePipe, MakeHrefPipe],
})
export class LanguageSwitchComponent implements OnInit {
  @Input() deviceType: DeviceType = 'desktop';
  /**
   * determines position of dropbox
   */
  @Input() placement: '' | 'up' = '';

  locale$: Observable<string>;
  availableLocales$: Observable<string[]>;

  constructor(
    private appFacade: AppFacade,
    private cookiesService: CookiesService,
    private featureToggleService: FeatureToggleService,
    public location: LocationStrategy
  ) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.availableLocales$ = this.appFacade.availableLocales$;
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

