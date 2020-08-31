import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { QuotingHelper } from '../../../models/quoting/quoting.helper';
import { Quote, QuoteRequest } from '../../../models/quoting/quoting.model';

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
  @Input() quotes: (Quote | QuoteRequest)[] = [];

  @Output() deleteItem = new EventEmitter<Quote | QuoteRequest>();

  asQuote = QuotingHelper.asQuote;

  /**
   * Throws deleteItem event.
   * @param item  The Quote item that should be deleted
   */
  onDeleteItem(item: Quote | QuoteRequest): void {
    this.deleteItem.emit(item);
  }
}
