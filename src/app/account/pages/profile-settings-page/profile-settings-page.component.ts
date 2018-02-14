import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { getLoggedInUser, State } from '../../../core/store/user';
import { Customer } from '../../../models/customer/customer.model';

@Component({
  templateUrl: './profile-settings-page.component.html'
})
export class ProfileSettingsPageComponent implements OnInit {

  showSuccessMessage: string;
  customer$: Observable<Customer>;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.customer$ = this.store.select(getLoggedInUser);
  }

}
