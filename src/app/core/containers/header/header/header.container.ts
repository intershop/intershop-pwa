import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CoreState } from '../../../store/core.state';
import { getHeaderType } from '../../../store/viewconf';

@Component({
  selector: 'ish-header-container',
  templateUrl: './header.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent implements OnInit {
  headerType$: Observable<string>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.headerType$ = this.store.pipe(select(getHeaderType));
  }
}
