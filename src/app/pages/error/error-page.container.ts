import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

// tslint:disable: ccp-no-intelligence-in-components
@Component({
  selector: 'ish-error-page-container',
  templateUrl: './error-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageContainerComponent implements OnInit {
  error$: Observable<HttpError>;
  type$: Observable<string>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.error$ = this.appFacade.generalError$;
    this.type$ = this.appFacade.generalErrorType$;
  }
}
