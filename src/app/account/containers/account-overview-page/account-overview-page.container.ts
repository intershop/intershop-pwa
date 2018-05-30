import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInUser } from '../../../core/store/user';
import { User } from '../../../models/user/user.model';

@Component({
  templateUrl: './account-overview-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewPageContainerComponent implements OnInit {
  user$: Observable<User>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));
  }
}
