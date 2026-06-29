import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

/**
 * The data request page handles the interaction for dispatching of a confirmation request triggered via confirmation email link.
 */
@Component({
  selector: 'ish-data-request-page',
  imports: [AsyncPipe, ErrorMessageComponent, LoadingComponent, ServerHtmlDirective, TranslatePipe],
  standalone: true,
  templateUrl: './data-request-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataRequestPageComponent implements OnInit {
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;
  firstGDPRDataRequest$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.error$ = this.accountFacade.dataRequestError$;
    this.loading$ = this.accountFacade.dataRequestLoading$;
    this.firstGDPRDataRequest$ = this.accountFacade.isFirstGDPRDataRequest$;
  }
}
