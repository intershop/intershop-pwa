import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreState, getLoggedInUser } from '../../../core/store/user';
import { Customer } from '../../../models/customer/customer.model';

@Component({
  templateUrl: './account-page.component.html'
})

export class AccountPageComponent implements OnInit {

  customer$: Observable<Customer>;

  constructor(
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.customer$ = this.store.select(getLoggedInUser);
  }
}
