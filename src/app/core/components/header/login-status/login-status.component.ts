import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Customer } from '../../../../models/customer/customer.model';
import { CoreState, getLoggedInUser } from '../../../store/user';

@Component({
  selector: 'ish-login-status',
  templateUrl: './login-status.component.html'
})

export class LoginStatusComponent implements OnInit {

  customer$: Observable<Customer>;

  constructor(
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.customer$ = this.store.select(getLoggedInUser);
  }
}
