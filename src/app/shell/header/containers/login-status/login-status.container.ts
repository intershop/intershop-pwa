import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-login-status-container',
  templateUrl: './login-status.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusContainerComponent implements OnInit {
  @Input() logoutOnly = false;
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  user$: Observable<User>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
  }
}
