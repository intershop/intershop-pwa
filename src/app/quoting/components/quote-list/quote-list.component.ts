import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';

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

  @Output() deleteItem = new EventEmitter<Quote>();

  // TODO: is the API using UTC?
  currentDateTime = new Date().getTime();

  // TODO: find a better solution for specific, selection related variables in modal dialog content
  selectedQuoteName: string;

  /**
   * Generate quote and quote request detail route.
   * @param item  The quote or quote request item.
   * @returns     The items detail route.
   */
  generateDetailRoute(item: Quote | QuoteRequest): string | void {
    if (item.type === 'Quote') {
      return `/account/quote/${item.id}`;
    }
    if (item.type === 'QuoteRequest') {
      return `/account/quote-request/${item.id}`;
    }
  }

  /**
   * Throws deleteItem event.
   * @param item  The Quote item that should be deleted
   */
  onDeleteItem(item: Quote): void {
    this.deleteItem.emit(item);
  }
}
