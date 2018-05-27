import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck } from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInUser } from '../../../core/store/user';
import { User } from '../../../models/user/user.model';

@Component({
  templateUrl: './account-root.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountRootContainerComponent implements OnInit {
  user$: Observable<User>;
  breadcrumbKey$: Observable<string>;

  constructor(private store: Store<CoreState>, route: ActivatedRoute, router: Router) {
    this.breadcrumbKey$ = merge(
      route.firstChild.data.pipe(pluck('breadcrumbKey')),
      router.events.pipe(
        filter(
          (event: ChildActivationEnd) =>
            !!event.snapshot && !!event.snapshot.data && !!event.snapshot.data.breadcrumbKey
        ),
        map(event => event.snapshot.data.breadcrumbKey)
      )
    ).pipe(distinctUntilChanged());
  }

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));
  }
}
