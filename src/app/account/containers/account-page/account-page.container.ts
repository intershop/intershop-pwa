import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getLoggedInUser } from '../../../core/store/user';
import { getBreadcrumbData } from '../../../core/store/viewconf';
import { BreadcrumbItem } from '../../../models/breadcrumb-item/breadcrumb-item.interface';
import { User } from '../../../models/user/user.model';

@Component({
  templateUrl: './account-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountPageContainerComponent implements OnInit {
  user$: Observable<User>;
  breadcrumbData$: Observable<BreadcrumbItem[]>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));
    this.breadcrumbData$ = this.store.pipe(select(getBreadcrumbData));
  }
}
