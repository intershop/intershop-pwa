import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../../models/user/user.model';

@Component({
  selector: 'ish-logout',
  templateUrl: './logout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  @Input() user: User;
}
