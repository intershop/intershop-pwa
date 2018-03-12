// NEEDS_WORK: DUMMY COMPONENT - container tslint rule disabled as long as it needs work
// tslint:disable ccp-no-markup-in-containers
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CoreState } from '../../../core/store/core.state';
import { getErrorState } from '../../../core/store/error';

@Component({
  selector: 'ish-error-page-container',
  templateUrl: './error-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ErrorPageContainerComponent implements OnInit {

  generalError$;

  constructor(
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.generalError$ = this.store.pipe(select(getErrorState));
  }
}
