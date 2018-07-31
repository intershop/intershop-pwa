import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../../models/user/user.model';

@Component({
  selector: 'ish-login-status',
  templateUrl: './login-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusComponent {
  @Input()
  user: User;
}
