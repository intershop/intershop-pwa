import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../models/user/user.model';

@Component({
  selector: 'ish-account-page',
  templateUrl: './account-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
  @Input() user: User;
}
