import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CoreState } from './core/store/core.state';
import { getWrapperClass } from './core/store/viewconf';

@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  wrapperClass$: Observable<string>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.wrapperClass$ = this.store.pipe(select(getWrapperClass));
  }
}
