import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

/**
 * The Basket Add To Quote Component displays a button which emits basketToQuote when triggered.
 *
 * @example
 * <ish-basket-add-to-quote
 *   (basketToQuote)="onAddToQuote()"
 * ></ish-basket-add-to-quote>
 */
@Component({
  selector: 'ish-basket-add-to-quote',
  templateUrl: './basket-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketAddToQuoteComponent {
  @Output() basketToQuote = new EventEmitter<void>();

  addToQuote() {
    this.basketToQuote.emit();
  }
}
