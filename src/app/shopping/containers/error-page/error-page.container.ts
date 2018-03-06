// NEEDS_WORK: DUMMY COMPONENT - container tslint rule disabled as long as it needs work
// tslint:disable ccp-no-markup-in-containers
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getErrorState } from '../../../core/store/error';
import { CoreState } from '../../../core/store/user';

@Component({
  selector: 'ish-error-page-container',
  templateUrl: './error-page.container.html'
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
