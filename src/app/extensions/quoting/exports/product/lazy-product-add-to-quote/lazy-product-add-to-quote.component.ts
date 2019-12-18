import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

/**
 * The Lazy Product Add To Quote Component displays a button which adds a product to a Quote Request.
 * It provides two display types, text and icon.
 *
 * @example
 * <ish-lazy-product-add-to-quote
 *   [disabled]="disabled"
 *   [product]="product$ | async"
 *   class="btn-block"
 *   displayType="icon"
 * ></ish-lazy-product-add-to-quote>
 */
@Component({
  selector: 'ish-lazy-product-add-to-quote',
  templateUrl: './lazy-product-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line:component-creation-test
export class LazyProductAddToQuoteComponent {
  @Input() product: Product;
  @Input() disabled = false;
  @Input() displayType?: string;
  @Input() class?: string;
  @Input() quantity?: number;

  componentLocation = {
    moduleId: 'ish-extensions-quoting',
    selector: 'ish-product-add-to-quote',
  };
}
