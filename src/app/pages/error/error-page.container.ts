import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ErrorState } from 'ish-core/store/error/error.reducer';

// tslint:disable: ccp-no-intelligence-in-components
@Component({
  selector: 'ish-error-page-container',
  templateUrl: './error-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageContainerComponent implements OnInit {
  generalError$: Observable<ErrorState>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.generalError$ = this.appFacade.generalError$;
  }
}
