import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-account-profile-settings-page',
  templateUrl: './account-profile-settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileSettingsPageComponent {
  @Input() user: User;

  showSuccessMessage: string;
}
