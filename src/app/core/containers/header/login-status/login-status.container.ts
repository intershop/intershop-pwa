import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Customer } from '../../../../models/customer/customer.model';
import { CoreState } from '../../../store/core.state';
import { getLoggedInUser } from '../../../store/user';

@Component({
  selector: 'ish-login-status-container',
  templateUrl: './login-status.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusContainerComponent implements OnInit {
  customer$: Observable<Customer>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.customer$ = this.store.pipe(select(getLoggedInUser));
  }
}
