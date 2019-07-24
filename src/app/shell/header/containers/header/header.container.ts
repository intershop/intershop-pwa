import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { getDeviceType, getHeaderType, isStickyHeader } from 'ish-core/store/viewconf';

@Component({
  selector: 'ish-header-container',
  templateUrl: './header.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent {
  headerType$ = this.store.pipe(select(getHeaderType));
  deviceType$ = this.store.pipe(select(getDeviceType));
  isSticky$ = this.store.pipe(select(isStickyHeader));
  reset$ = this.router.events.pipe(filter(event => event instanceof NavigationStart));

  constructor(private store: Store<{}>, private router: Router) {}
}
