import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';

import { AccountProfileComponent } from './account-profile/account-profile.component';

@Component({
  templateUrl: './account-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AccountProfileComponent, AsyncPipe],
})
export class AccountProfilePageComponent implements OnInit {
  user$: Observable<User>;
  subscribedToNewsletter$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.subscribedToNewsletter$ = this.accountFacade.subscribedToNewsletter$;
  }
}
