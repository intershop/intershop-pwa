import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The data request page handles the interaction for dispatching of a confirmation request triggered via confirmation email link.
 */
@Component({
  selector: 'ish-data-request-page',
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
