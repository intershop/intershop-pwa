import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getHeaderType } from '../../../store/viewconf';

@Component({
  selector: 'ish-header-container',
  templateUrl: './header.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent implements OnInit {
  headerType$: Observable<string>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.headerType$ = this.store.pipe(select(getHeaderType));
  }
}
