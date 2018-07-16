import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * The Product Add To Quote Component displays a button which emits productToQuote when triggered.
 * It provides two display types, text and glyphicon.
 *
 * @example
 * <ish-product-add-to-quote
 *   [disabled]="disabled"
 *   (productToQuote)="addToQuote()"
 *   [class]="'btn-block'"
 * ></ish-product-add-to-quote>
 */
@Component({
  selector: 'ish-product-add-to-quote',
  templateUrl: './product-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteComponent {
  @Input() disabled = false;
  @Input() displayType?: string;
  @Input() class?: string;
  @Output() productToQuote = new EventEmitter<void>();

  addToQuote() {
    this.productToQuote.emit();
  }
}
