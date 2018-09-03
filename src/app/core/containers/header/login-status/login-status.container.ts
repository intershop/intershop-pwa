import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../../../models/user/user.model';
import { getLoggedInUser } from '../../../store/user';

@Component({
  selector: 'ish-login-status-container',
  templateUrl: './login-status.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusContainerComponent implements OnInit {
  @Input()
  logoutOnly = false;

  user$: Observable<User>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));
  }
}
