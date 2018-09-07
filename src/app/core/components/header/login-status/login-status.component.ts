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
  @Input()
  view: 'auto' | 'small' | 'full' = 'auto';

  getViewClasses(): string {
    switch (this.view) {
      case 'auto':
        return 'd-none d-md-inline';
      case 'full':
        return 'd-inline';
      case 'small':
        return 'd-none';
    }
  }
}
