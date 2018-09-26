import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getLoggedInUser } from '../../../store/user';

@Component({
  selector: 'ish-login-status-container',
  templateUrl: './login-status.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusContainerComponent {
  @Input()
  logoutOnly = false;
  @Input()
  view: 'auto' | 'small' | 'full' = 'auto';

  user$ = this.store.pipe(select(getLoggedInUser));

  constructor(private store: Store<{}>) {}
}
