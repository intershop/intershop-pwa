import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CoreState } from '../../../core/store/core.state';
import { getRoutingData } from '../../../core/store/routing-data';
import { getLoggedInUser } from '../../../core/store/user';
import { User } from '../../../models/user/user.model';

@Component({
  templateUrl: './account-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountPageContainerComponent implements OnInit {
  user$: Observable<User>;
  breadcrumbKey$: Observable<string>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));
    this.breadcrumbKey$ = this.store.pipe(select(getRoutingData('breadcrumbKey')));
  }
}
