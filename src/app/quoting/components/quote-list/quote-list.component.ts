import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';

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
export class QuoteListComponent implements OnChanges {
  @Input() quotes: (Quote | QuoteRequest)[] = [];

  @Output() deleteItem = new EventEmitter<Quote>();

  sortedQuotes: (Quote | QuoteRequest)[] = [];

  // TODO: is the API using UTC?
  currentDateTime = new Date().getTime();

  // TODO: find a better solution for specific, selection related variables in modal dialog content
  selectedQuoteName: string;

  ngOnChanges() {
    this.quotes.sort(this.sortCreationDesc);
  }

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

  /**
   * Sorts quote related items for creation date.
   * @param a First item to compare.
   * @param b Second item to compare.
   */
  sortCreationDesc(a: Quote | QuoteRequest, b: Quote | QuoteRequest) {
    if (a.creationDate > b.creationDate) {
      return -1;
    }

    if (a.creationDate < b.creationDate) {
      return 1;
    }

    return 0;
  }
}
