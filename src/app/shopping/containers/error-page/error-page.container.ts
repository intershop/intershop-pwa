import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getErrorState } from '../../../core/store/error';

@Component({
  selector: 'ish-error-page-container',
  templateUrl: './error-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageContainerComponent {
  generalError$ = this.store.pipe(select(getErrorState));

  constructor(private store: Store<{}>) {}
}
