import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-requisition-management-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, RouterOutlet, TranslatePipe],
})
export class AppComponent implements OnInit {
  user$: Observable<User>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
  }
}
