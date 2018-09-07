import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getErrorState } from '../../../core/store/error';
import { ErrorState } from '../../../core/store/error/error.reducer';

@Component({
  selector: 'ish-error-page-container',
  templateUrl: './error-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageContainerComponent implements OnInit {
  generalError$: Observable<ErrorState>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.generalError$ = this.store.pipe(select(getErrorState));
  }
}
