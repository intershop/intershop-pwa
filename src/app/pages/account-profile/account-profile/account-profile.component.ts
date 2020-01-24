import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-account-profile',
  templateUrl: './account-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileComponent {
  @Input() user: User;
  @Input() customer: Customer;

  constructor(@Inject(AVAILABLE_LOCALES) public locales: Locale[]) {}

  get preferredLanguageName(): string {
    if (
      !this.user ||
      !this.user.preferredLanguage ||
      !this.locales ||
      !this.locales.some(locale => locale.lang === this.user.preferredLanguage)
    ) {
      return '';
    }
    return this.locales.find(locale => locale.lang === this.user.preferredLanguage).displayLong;
  }
}
