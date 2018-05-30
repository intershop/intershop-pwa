import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInUser } from '../../../core/store/user';
import { User } from '../../../models/user/user.model';
import { resolveChildRouteData } from '../../../utils/router';

@Component({
  templateUrl: './account-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountPageContainerComponent implements OnInit {
  user$: Observable<User>;
  breadcrumbKey$: Observable<string>;

  constructor(private store: Store<CoreState>, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));
    this.breadcrumbKey$ = resolveChildRouteData<string>(this.route, this.router, 'breadcrumbKey');
  }
}
