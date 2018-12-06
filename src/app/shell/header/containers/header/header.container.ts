import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getHeaderType } from 'ish-core/store/viewconf';

@Component({
  selector: 'ish-header-container',
  templateUrl: './header.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent {
  headerType$ = this.store.pipe(select(getHeaderType));

  constructor(private store: Store<{}>) {}
}
