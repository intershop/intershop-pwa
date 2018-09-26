import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getWrapperClass } from './core/store/viewconf';

@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  wrapperClass$ = this.store.pipe(select(getWrapperClass));

  constructor(private store: Store<{}>) {}
}
