import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CoreState } from '../../../core/store/core.state';
import { getErrorState } from '../../../core/store/error';
import { ErrorState } from '../../../core/store/error/error.reducer';

@Component({
  selector: 'ish-error-page-container',
  templateUrl: './error-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageContainerComponent implements OnInit {
  generalError$: Observable<ErrorState>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.generalError$ = this.store.pipe(select(getErrorState));
  }
}
