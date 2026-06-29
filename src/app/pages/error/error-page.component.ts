import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ErrorComponent } from './error/error.component';
import { ServerErrorComponent } from './server-error/server-error.component';

@Component({
  selector: 'ish-error-page',
  imports: [AsyncPipe, ErrorComponent, ServerErrorComponent],
  standalone: true,
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
