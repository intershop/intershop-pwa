import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * The Product Add To Quote Component displays a button which emits productToQuote when triggered.
 * It provides two display types, text and icon.
 */
@Component({
  selector: 'ish-product-add-to-quote',
  templateUrl: './product-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteComponent {
  @Input()
  disabled: boolean;
  @Input()
  displayType?: string;
  @Input()
  cssClass?: string;
  @Output()
  productToQuote = new EventEmitter<void>();

  addToQuote() {
    this.productToQuote.emit();
  }
}
