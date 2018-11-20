import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-profile-settings-page',
  templateUrl: './profile-settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsPageComponent {
  @Input()
  user: User;

  showSuccessMessage: string;
}
