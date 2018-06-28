import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product, ProductHelper } from '../../../models/product/product.model';

/**
 * The Product Add To Quote Component displays a button which emits productToQuote when triggered.
 * It provides two display types, text and glyphicon.
 *
 * @example
 * <ish-product-add-to-quote
 *   [product]="product"
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
  @Input() product: Product;
  @Input() disabled = false;
  @Input() displayType?: string;
  @Input() class?: string;
  @Output() productToQuote = new EventEmitter<void>();

  canAddToQuote = ProductHelper.canAddToQuote;

  addToQuote() {
    this.productToQuote.emit();
  }
}
