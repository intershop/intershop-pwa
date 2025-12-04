import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { NgIf, NgClass, AsyncPipe } from '@angular/common';

@Component({
    selector: 'ish-login-status',
    templateUrl: './login-status.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        FontAwesomeModule,
        NgClass,
        AsyncPipe,
        TranslateModule,
    ],
})
export class LoginStatusComponent implements OnInit {
  @Input() logoutOnly = false;
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  user$: Observable<User>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
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
