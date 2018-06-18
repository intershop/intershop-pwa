import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Quote } from '../../../models/quote/quote.model';

/**
 * The Quote List Component displays a list of quotes.
 * It uses the {@link AccountNavigationComponent} to display the profile menu and it's current state
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
  @Input() quotes: Quote[] = [];

  @Output() deleteItem = new EventEmitter<Quote>();

  // TODO: find a better solution for specific, selection related variables in modal dialog content
  selectedQuoteName: string;

  constructor(private datePipe: DatePipe, private domSanitizer: DomSanitizer) {}

  /**
   * Get sanitized value for validToDate
   * @param timestamp The validToDate timestamp
   * @returns         Sanitized Html
   */
  getValidToDate(timestamp?: number): SafeHtml {
    // TODO: is the API using UTC?
    const currentDateTime = new Date().getTime();
    let dateString: string;

    if (!timestamp) {
      dateString = '-';
    } else if (timestamp < currentDateTime) {
      dateString = `<span class="text-danger">${this.datePipe.transform(timestamp, 'shortDate')}</span>`;
    } else {
      dateString = this.datePipe.transform(timestamp, 'shortDate');
    }

    return this.domSanitizer.bypassSecurityTrustHtml(dateString);
  }

  /**
   * Throws deleteItem event.
   * @param item  The Quote item that should be deleted
   */
  onDeleteItem(item: Quote): void {
    this.deleteItem.emit(item);
  }
}
