import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-login-status',
  templateUrl: './login-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusComponent implements OnInit {
  @Input() logoutOnly = false;
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  isSticky$: Observable<boolean>;

  user$: Observable<User>;

  isOrganizationHierarchiesServiceAvailable$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.isSticky$ = this.appFacade.stickyHeader$;
    this.isOrganizationHierarchiesServiceAvailable$ = this.appFacade
      .serverSetting$<string>('services.OrganizationHierarchyServiceDefinition.Endpoint')
      .pipe(map(url => (url && url.length !== 0 ? true : false)));
  }

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
