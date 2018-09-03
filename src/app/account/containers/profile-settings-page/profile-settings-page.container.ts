import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getLoggedInUser } from '../../../core/store/user';
import { User } from '../../../models/user/user.model';

@Component({
  templateUrl: './profile-settings-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsPageContainerComponent implements OnInit {
  user$: Observable<User>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(getLoggedInUser));
  }
}
