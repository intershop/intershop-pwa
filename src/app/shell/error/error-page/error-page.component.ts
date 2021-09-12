import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'ish-error-page',
  templateUrl: './error-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent implements OnInit {
  error$: Observable<HttpError | string>;
  type$: Observable<string>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.error$ = this.appFacade.generalError$;
    this.type$ = this.appFacade.generalErrorType$;
  }
}
