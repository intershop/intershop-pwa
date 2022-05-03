import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { QuotingFacade } from '../../../facades/quoting.facade';
import { QuotingHelper } from '../../../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuoteStubFromAttributes } from '../../../models/quoting/quoting.model';

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
 * <ish-quote-list [quotes]="quotes$ | async" (deleteItem)="deleteItem($event)"></ish-quote-list>
 */
@Component({
  selector: 'ish-quote-list',
  templateUrl: './quote-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
