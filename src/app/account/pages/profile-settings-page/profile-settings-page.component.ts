import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInUser } from '../../../core/store/user';
import { Customer } from '../../../models/customer/customer.model';

@Component({
  templateUrl: './profile-settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsPageComponent implements OnInit {

  showSuccessMessage: string;
  customer$: Observable<Customer>;

  constructor(
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.customer$ = this.store.pipe(select(getLoggedInUser));
  }

}
