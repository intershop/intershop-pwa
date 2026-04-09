import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { DatePipe as IshDatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { QuotingFacade } from '../../../facades/quoting.facade';
import { QuotingHelper } from '../../../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuoteStubFromAttributes } from '../../../models/quoting/quoting.model';
import { QuoteExpirationDateComponent } from '../../../shared/quote-expiration-date/quote-expiration-date.component';
import { QuoteStateComponent } from '../../../shared/quote-state/quote-state.component';

type QuoteColumnsType =
  | 'quoteNo'
  | 'displayName'
  | 'lineItems'
  | 'creationDate'
  | 'expirationDate'
  | 'status'
  | 'actions';

/**
 * The Quote List Component displays a list of quotes.
 *
 * @example
 * <ish-quote-list [quotes]="quotes$ | async" (deleteItem)="deleteItem($event)" />
 */
@Component({
  selector: 'ish-quote-list',
  templateUrl: './quote-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CdkTableModule,
    IshDatePipe,
    ModalDialogComponent,
    QuoteExpirationDateComponent,
    QuoteStateComponent,
    TranslatePipe,
    RouterLink,
  ],
})
export class QuoteListComponent {
  @Input() quotes: (Quote | QuoteRequest | QuoteStubFromAttributes)[] = [];
  @Input() columnsToDisplay: QuoteColumnsType[] = [
    'quoteNo',
    'displayName',
    'lineItems',
    'creationDate',
    'expirationDate',
    'status',
    'actions',
  ];

  asQuote = QuotingHelper.asQuote;
  itemCount = QuotingHelper.itemCount;

  constructor(private quotingFacade: QuotingFacade) {}

  /**
   * Deletes an item.
   *
   * @param item  The Quote item that should be deleted
   */
  onDeleteItem(item: Quote | QuoteRequest): void {
    this.quotingFacade.delete(item);
  }
}
