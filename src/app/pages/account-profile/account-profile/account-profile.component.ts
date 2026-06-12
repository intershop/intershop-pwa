import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-account-profile',
  templateUrl: './account-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileComponent {
  @Input({ required: true }) user: User;

  @Input() subscribedToNewsletter: boolean;
}
