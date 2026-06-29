import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { DatePipe as IshDatePipe } from 'ish-core/pipes/date.pipe';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote, QuoteStatus } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-expiration-date',
  imports: [AsyncPipe, IshDatePipe, TranslatePipe],
  standalone: true,
  templateUrl: './quote-expiration-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteExpirationDateComponent implements OnChanges {
  @Input({ required: true }) quote: Partial<Pick<Quote, 'id' | 'validToDate'>>;

  state$: Observable<QuoteStatus>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnChanges() {
    this.state$ = this.quotingFacade.state$(this.quote?.id);
  }
}
